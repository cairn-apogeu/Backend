import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import projetoController from "../modules/projetos/projetos.controller";
import projetoService from "../modules/projetos/projetos.service";
import { ToProjetosDto, ToProjetosSchema } from "../modules/projetos/schemas/to-projetos.schema";

jest.mock("../modules/projetos/projetos.service");

describe("Projetos Controller", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockRequest = {};
  });

  it("Deve criar um novo projeto", async () => {
    const newProject = {
      id_cliente: "1",
      id_gestor: "2",
      nome: "Projeto Teste",
      valor: 50000,
      status: "Ativo",
      token: "token",
      repositorio: "repositorio",
      owner: "owner",
    };

    (projetoService.newProjeto as jest.Mock).mockResolvedValue(newProject);

    mockRequest.body = newProject;

    await projetoController.newProjeto(
      mockRequest as FastifyRequest<{ Body: typeof newProject }>,
      mockReply as FastifyReply
    );

    expect(projetoService.newProjeto).toHaveBeenCalledWith(newProject);
    expect(mockReply.send).toHaveBeenCalledWith(newProject);
  });

  it("Deve buscar todos os projetos", async () => {
    const mockProjects = [
      { id: "1", nome: "Projeto 1" },
      { id: "2", nome: "Projeto 2" },
    ];

    (projetoService.findAll as jest.Mock).mockResolvedValue(mockProjects);

    await projetoController.findAll(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    );

    expect(projetoService.findAll).toHaveBeenCalled();
    expect(mockReply.send).toHaveBeenCalledWith(mockProjects);
  });

  it("Deve buscar um projeto por ID", async () => {
    const mockProject = { id: 1, nome: "Projeto Teste" };

    mockRequest.params = { id: "1" };
    (projetoService.findById as jest.Mock).mockResolvedValue(mockProject);

    await projetoController.findProjectById(
      mockRequest as FastifyRequest<{ Params: { id: string } }>,
      mockReply as FastifyReply
    );

    expect(projetoService.findById).toHaveBeenCalledWith(1);
    expect(mockReply.send).toHaveBeenCalledWith(mockProject);
  });

  it("Deve atualizar um projeto", async () => {
    const updatedProject = { id: 1, nome: "Projeto Atualizado" };

    mockRequest.params = { id: "1" };
    mockRequest.body = { nome: "Projeto Atualizado" };

    (projetoService.updateProjeto as jest.Mock).mockResolvedValue(updatedProject);

    await projetoController.updateProjeto(
      mockRequest as FastifyRequest<{
        Params: { id: number };
        Body: Partial<typeof updatedProject>;
      }>,
      mockReply as FastifyReply
    );

    expect(projetoService.updateProjeto).toHaveBeenCalledWith(1, {
      nome: "Projeto Atualizado",
    });
    expect(mockReply.send).toHaveBeenCalledWith(updatedProject);
  });

  it("Deve deletar um projeto", async () => {
    const deletedProject = { id: 1, nome: "Projeto Deletado" };

    mockRequest.params = { id: "1" };
    (projetoService.deleteProjeto as jest.Mock).mockResolvedValue(deletedProject);

    await projetoController.deleteProjeto(
      mockRequest as FastifyRequest<{ Params: { id: number } }>,
      mockReply as FastifyReply
    );

    expect(projetoService.deleteProjeto).toHaveBeenCalledWith(1);
    expect(mockReply.send).toHaveBeenCalledWith(deletedProject);
  });

  it("NewProjeto Function returns code 500", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;
  
    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    mockRequest = {
      body: {
        id_cliente: "1",
        id_gestor: "2",
        nome: "Projeto Teste",
        valor: 50000,
        status: "Ativo",
      },
    };
  
    const mockError = new Error("Erro interno!");
  
    (projetoService.newProjeto as jest.Mock).mockRejectedValue(mockError);
  
    await projetoController.newProjeto(
      mockRequest as FastifyRequest<{ Body: ToProjetosDto }>,
      mockReply as FastifyReply
    );
  
    expect(projetoService.newProjeto).toHaveBeenCalledWith(mockRequest.body);
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ Message: mockError });
  });
  
});