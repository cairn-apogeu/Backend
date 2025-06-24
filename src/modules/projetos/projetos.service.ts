import prisma from "../../clients/prisma.client";
import { ToProjetosDto } from "./schemas/to-projetos.schema";
import { encryptData } from '../../utils/encryptData';
import { decryptData } from '../../utils/decryptData';
import axios from "axios";

interface GitHubFile {
  name: string;
  path: string;
  type: string;
  download_url: string | null;
}

interface DirectoryStructure {
  [key: string]: string | DirectoryStructure;
}

class ProjetoService {
  async findAll() {
    try {
      return await prisma.projetos.findMany({
        include: {
          AlunosProjetos: true
        }
      });
    } catch (error) {
      throw new Error("Tabela 'Projetos' não encontrada");
    }
  }

  async findById(id: number, userId: string) {
    try {
      const projeto = await prisma.projetos.findUnique({
        where: { id },
        include: {
          sprints: true,
          AlunosProjetos: true 
        }
      });
      if (!projeto) {
        throw new Error("Projeto não encontrado");
      }
      // Busca o usuário
      const user = await prisma.users.findUnique({
        where: { user_clerk_id: userId },
        select: { tipo_perfil: true }
      });
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      // Verifica se o usuário é Admin
      if (user.tipo_perfil === "Admin") {
        return projeto;
      }
      // Verifica se o usuário está relacionado ao projeto
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return projeto;
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto");
    } catch (error) {
      console.log("Erro no service", error);
      throw new Error("Projeto não encontrado ou acesso negado");
    }
  }

  async findByUserId(id: string) {
    try {
      // Busca os projetos relacionados ao aluno pelo ID
      const projetosAluno = await prisma.alunosProjetos.findMany({
        where: { aluno_id: id },
        include: {
          projeto: true, // Inclui os detalhes do projeto
        },
      });
      const projetosClienteGestor = await prisma.projetos.findMany({
        where: {
          OR: [
            { id_cliente: id },
            { id_mentor: id }
          ]
        }
      });

      // Extrai os projetos do array de alunosProjetos
      const projetosAlunoList = projetosAluno.map((alunoProjeto) => alunoProjeto.projeto);

      // Junta todos os projetos e remove duplicatas por id
      const todosProjetos = [...projetosAlunoList, ...projetosClienteGestor];
      const projetosUnicos = Object.values(
        todosProjetos.reduce((acc, projeto) => {
          acc[projeto.id] = projeto;
          return acc;
        }, {} as Record<number, typeof todosProjetos[0]>)
      );

      return projetosUnicos;
    } catch (error) {
      throw new Error("Projetos não encontrados para o usuário.");
    }
  }

  async newProjeto(toProjetosDto: ToProjetosDto) {
    try {
      let tokenToSave = toProjetosDto.token;
      if (tokenToSave) {
        try {
          tokenToSave = await encryptData(tokenToSave);
        } catch (encryptError) {
          console.error("Erro ao criptografar o token:", encryptError);
          throw new Error("Falha ao criptografar o token");
        }
      }
      if (typeof toProjetosDto.valor !== 'number') {
        throw new Error("O campo 'valor' é obrigatório e deve ser um número.");
      }
      if (!toProjetosDto.status) {
        throw new Error("O campo 'status' é obrigatório e deve ser uma string.");
      }
      return await prisma.projetos.create({
        data: {
          id_cliente: toProjetosDto.id_cliente,
          id_mentor: toProjetosDto.id_mentor,
          id_helper: toProjetosDto.id_helper,
          nome: toProjetosDto.nome,
          valor: toProjetosDto.valor,
          status: toProjetosDto.status,
          token: tokenToSave,
          repositorio: toProjetosDto.repositorio,
          owner: toProjetosDto.owner,
          dia_inicio: toProjetosDto.dia_inicio,
          dia_fim: toProjetosDto.dia_fim,
          logo_url: toProjetosDto.logo_url,
        },
      });
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      throw new Error("Falha ao criar projeto: " + errorMessage);
    }
  }

  async updateProjeto(id: number, toProjetosDto: Partial<ToProjetosDto>) {
    try {
      if (toProjetosDto.token) {
        try {
          toProjetosDto.token = await encryptData(toProjetosDto.token);
        } catch (encryptError) {
          console.error("Erro ao criptografar o token:", encryptError);
          throw new Error("Falha ao criptografar o token");
        }
      }
      return await prisma.projetos.update({
        where: { id },
        data: {
          ...toProjetosDto,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      throw new Error("Falha ao atualizar projeto");
    }
  }


  async deleteProjeto(id: number) {
    try {
      return await prisma.projetos.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar projeto");
    }
  }

  // função que vai ser usada no getGithubContent
  async fetchFilesRecursively(
    owner: string,
    repo: string,
    path: string,
    branch: string,
    token: string
  ): Promise<DirectoryStructure> { // Removemos a possibilidade de retornar null
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
    try {
      const response = await axios.get<GitHubFile[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw",
        },
        params: { ref: branch },
      });
  
      const files = response.data;
  
      // Verifica se há uma pasta "docs" antes de continuar
      if (path === "" || path === "/") {
        const docsFolder = files.find(file => file.type === "dir" && file.name === "docs");
        if (!docsFolder) {
          console.log("Pasta 'docs' não encontrada.");
          return {}; // Retorna um objeto vazio ao invés de null
        }
        // Chama novamente a função apenas para a pasta "docs"
        return await this.fetchFilesRecursively(owner, repo, docsFolder.path, branch, token);
      }
  
      const result: DirectoryStructure = {};
  
      for (const file of files) {
        if (file.type === "file" && file.name.endsWith(".md")) {
          if (file.download_url) {
            const contentResponse = await axios.get<string>(file.download_url);
            result[file.name] = contentResponse.data;
          }
        } else if (file.type === "dir") {
          result[file.name] = await this.fetchFilesRecursively(owner, repo, file.path, branch, token);
        }
      }
  
      return result; // Retornamos sempre um objeto válido
    } catch (error) {
      console.error(`Error fetching files from ${path}:`, error);
      throw error;
    }
  }
  

  async getGithubContent(id: number, filePath: string, branch: string) {
    try {
      const projeto = await prisma.projetos.findUnique({ where: { id } });

      if (!projeto || !projeto.token) {
        throw new Error("Projeto ou token não encontrado.");
      }

      else if (!projeto.owner || !projeto.repositorio) {
        throw new Error("Owner do projeto ou repositório não encontrados.");
      }


      const token = decryptData(projeto.token);

      const response = (await this.fetchFilesRecursively(projeto.owner, projeto.repositorio, "", branch, token)) || {};



      return response;
    } catch (error) {
      console.error("Erro ao buscar conteúdo do GitHub:", error);
      throw new Error("Erro ao buscar conteúdo do GitHub.");
    }
  }

  async userHasAccessToProjeto(projetoId: number, userId: string): Promise<boolean> {
    // Busca o projeto e alunos relacionados
    const projeto = await prisma.projetos.findUnique({
      where: { id: projetoId },
      include: { AlunosProjetos: true },
    });
    if (!projeto) return false;
    // Verifica se o usuário é cliente, mentor ou helper
    if (
      projeto.id_cliente === userId ||
      projeto.id_mentor === userId ||
      projeto.id_helper === userId
    ) {
      return true;
    }
    // Verifica se o usuário está listado como aluno
    if (projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)) {
      return true;
    }
    return false;
  }

  async findByIdWithAccessCheck(id: number, userId: string) {
    // Busca projeto com checagem de acesso e perfil
    return this.findById(id, userId);
  }

}

export default new ProjetoService();
