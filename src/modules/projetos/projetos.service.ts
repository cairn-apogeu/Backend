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

  async findById(id: number) {
    try {
      return await prisma.projetos.findUnique({
        where: { id },
        include: {sprints: true}
      });
    } catch (error) {
        console.log("Erro no service", error);
        throw new Error("Projeto não encontrado");
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
            { id_gestor: id }
          ]
        }
      });
      console.log(projetosAluno);
      
      // Retorna apenas os projetos
      return projetosAluno[0]  ? projetosAluno.map((alunoProjeto) => alunoProjeto.projeto) : projetosClienteGestor
    } catch (error) {
      throw new Error("Projetos não encontrados para o aluno.");
    }
  }

  async newProjeto(toProjetosDto: ToProjetosDto) {
    try {
      return await prisma.projetos.create({
        data: {
          id_cliente: toProjetosDto.id_cliente,
          id_gestor: toProjetosDto.id_gestor,
          nome: toProjetosDto.nome,
          valor: toProjetosDto.valor,
          status: toProjetosDto.status,
        },
      });
    } catch (error) {
      throw new Error("Falha ao criar projeto");
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
        data: toProjetosDto,
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
  ): Promise<DirectoryStructure> {
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
      const result: DirectoryStructure = {};

      console.log(files);
      
  
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
  
      return result;
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

      const response = await this.fetchFilesRecursively(projeto.owner, projeto.repositorio, filePath, branch, token)


      return response;
    } catch (error) {
      console.error("Erro ao buscar conteúdo do GitHub:", error);
      throw new Error("Erro ao buscar conteúdo do GitHub.");
    }
  }









}

export default new ProjetoService();
