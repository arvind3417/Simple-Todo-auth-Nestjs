import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTodoDto, EditTodoDto } from "./dto";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  getTodos(userId: number) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }
  getTodoById(userId: number, TodoId: number) {
    return this.prisma.todo.findFirst({
      where: {
        id: TodoId,
        userId,
      },
    });
  }
  async createTodo(userId: number, dto: CreateTodoDto) {
    console.log("it enetering");
    
    const Todo = await this.prisma.todo.create({
      data: {
        userId,
        ...dto,
      },
    });

    return Todo;
  }
  async editTodoById(
    userId: number,
    TodoId: number,
    dto: EditTodoDto
  ) {
    // get the Todo by id
    const Todo = await this.prisma.todo.findUnique({
      where: {
        id: TodoId,
      },
    });

    // check if user owns the Todo
    if (!Todo || Todo.userId !== userId)
      throw new ForbiddenException("Access to resources denied");

    return this.prisma.todo.update({
      where: {
        id: TodoId,
      },
      data: {
        ...dto,
      },
    });
  }
  
  async deleteTodoById(userId: number, TodoId: number) {
    const Todo = await this.prisma.todo.findUnique({
      where: {
        id: TodoId,
      },
    });

    // check if user owns the Todo
    if (!Todo || Todo.userId !== userId)
      throw new ForbiddenException("Access to resources denied");

    await this.prisma.todo.delete({
      where: {
        id: TodoId,
      },
    });
  }
}
 