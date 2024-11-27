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
});
