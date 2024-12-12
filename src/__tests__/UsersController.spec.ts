import {
  ToUserDto,
  ToUserSchema,
} from "../modules/users/schemas/to-user.schema";
import {
  UpdateUserDto,
  UpdateUserSchema,
} from "../modules/users/schemas/update-user.schema";
import {
  UserIdDto,
  UserIdSchema,
} from "../modules/users/schemas/user-id.schema";
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
    let mockRequest;
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

  it("UpdateUser Function", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      params: {
        id: "1",
      },
      body: {
        user_clerk_id: "1",
        tipo_perfil: "ALUNO",
        github: "robertin039",
      },
    };

    const mockUser = {
      user_clerk_id: "1",
      tipo_perfil: "ALUNO",
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
      .spyOn(UpdateUserSchema, "parse")
      .mockReturnValue(mockRequest.body as UpdateUserDto);

    jest
      .spyOn(UserIdSchema, "parse")
      .mockReturnValue(mockRequest.params as UserIdDto);

    (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

    await userController.updateUser(
      mockRequest as FastifyRequest<{ Params: UserIdDto; Body: UpdateUserDto }>,
      mockReply as FastifyReply
    );

    expect(UpdateUserSchema.parse).toHaveBeenCalledWith(mockRequest.body);
    expect(UserIdSchema.parse).toHaveBeenCalledWith(mockRequest.params);
    expect(mockReply.send).toHaveBeenCalledWith(mockUser);
  });

  it("UpdateUser Function returns code 500", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {};

    const mockError = new Error("Erro!");

    (userService.updateUser as jest.Mock).mockRejectedValue(mockError);

    await userController.updateUser(
      mockRequest as FastifyRequest<{ Params: UserIdDto; Body: UpdateUserDto }>,
      mockReply as FastifyReply
    );

    expect(userService.updateUser).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ message: mockError });
  });

  it("DeleteUser", async () => {
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      params: { id: "1" },
    };

    const mockUser = {
      user_clerk_id: "1",
      tipo_perfil: "ALUNO",
      github: "robertin039",
    };

    (userService.deleteUser as jest.Mock).mockResolvedValue(mockUser);

    await userController.deleteUser(
      mockRequest.body as FastifyRequest<{ Params: { id: string } }>,
      mockReply as FastifyReply
    );

    expect(userService.deleteUser).toHaveBeenCalled();
    expect(mockReply.send).toHaveBeenCalledWith(mockUser);
  });

  it("DeleteUser Function returns code 500", async () => {
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
    (userService.deleteUser as jest.Mock).mockRejectedValue(mockError);

    await userController.deleteUser(
      mockRequest as FastifyRequest<{ Params: { id: string } }>,
      mockReply as FastifyReply
    );

    expect(userService.deleteUser).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ message: mockError });
  });
});
