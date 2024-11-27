import {
  ToUserDto,
  ToUserSchema,
} from "../modules/users/schemas/to-user.schema";
import userController from "../modules/users/users.controller";
import userService from "../modules/users/users.service";
import { FastifyRequest, FastifyReply } from "fastify";

jest.mock("../modules/users/users.service.ts");

describe("Users Controller", () => {
  it("FindAll Function", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {};

    const mockUsers = [
      { user_clerk_id: 1, github: "robertin039" },
      { user_clerk_id: 2, github: "asteristik98" },
    ];
    (userService.findAll as jest.Mock).mockResolvedValue(mockUsers);

    await userController.findAll(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    );

    expect(userService.findAll).toHaveBeenCalled();
    expect(mockReply.send).toHaveBeenCalledWith(mockUsers);
  });

  it("FindAll Function returns code 500", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {};

    const mockError = new Error("Erro!");
    (userService.findAll as jest.Mock).mockRejectedValue(mockError);

    await userController.findAll(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    );

    expect(userService.findAll).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ message: mockError });
  });

  it("FindById Function", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      params: { id: "1" },
    };

    const mockUsers = [
      { user_clerk_id: 1, github: "robertin039" },
      { user_clerk_id: 2, github: "asteristik98" },
    ];
    (userService.findById as jest.Mock).mockResolvedValue(mockUsers[0]);

    await userController.findById(
      mockRequest as FastifyRequest<{ Params: { id: string } }>,
      mockReply as FastifyReply
    );

    expect(userService.findById).toHaveBeenCalled();
    expect(mockReply.send).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("FindById Function returns code 404", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      params: { id: "1" },
    };

    const mockError = new Error("Erro!");
    (userService.findById as jest.Mock).mockRejectedValue(mockError);

    await userController.findById(
      mockRequest as FastifyRequest<{ Params: { id: string } }>,
      mockReply as FastifyReply
    );

    expect(userService.findById).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({ message: mockError });
  });

  it("NewUser Function", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      body: {
        user_clerk_id: "1",
        tipo_perfil: "ADM",
        discord: null,
        linkedin: null,
        github: "robertin039",
        objetivo_curto: null,
        objetivo_medio: null,
        objetivo_longo: null,
        genero: null,
        nascimento: null,
      },
    };

    const mockUser = {
      user_clerk_id: "1",
      tipo_perfil: "ADM",
      discord: null,
      linkedin: null,
      github: "robertin039",
      objetivo_curto: null,
      objetivo_medio: null,
      objetivo_longo: null,
      genero: null,
      nascimento: null,
    };

    jest
      .spyOn(ToUserSchema, "parse")
      .mockReturnValue(mockRequest.body as ToUserDto);

    (userService.newUser as jest.Mock).mockResolvedValue(mockUser);

    await userController.newUser(
      mockRequest as FastifyRequest<{ Body: ToUserDto }>,
      mockReply as FastifyReply
    );

    expect(ToUserSchema.parse).toHaveBeenCalledWith(mockRequest.body);
    expect(userService.newUser).toHaveBeenCalledWith(mockRequest.body);
    expect(mockReply.send).toHaveBeenCalledWith(mockUser);
  });

  it("NewUser Function returns code 500", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {};

    const mockError = new Error("Erro!");

    (userService.newUser as jest.Mock).mockRejectedValue(mockError);

    await userController.newUser(
      mockRequest as FastifyRequest<{ Body: ToUserDto }>,
      mockReply as FastifyReply
    );

    expect(userService.newUser).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ message: mockError });
  });
});
