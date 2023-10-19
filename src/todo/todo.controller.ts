import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtGuard } from "src/auth/guard";
import { TodoService } from "./todo.service";
import { GetUser } from "src/auth/decorator";
import { CreateTodoDto, EditTodoDto } from "./dto";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Todo')
@UseGuards(JwtGuard)
@Controller("todo")
export class TodoController {
  constructor(private todoService: TodoService) {}
  @Get()
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of todos' })
  gettodos(@GetUser("id") userId: number) {
    return this.todoService.getTodos(userId);
  }
  @Get(":id")
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'todoId', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo details' })
  gettodoById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) todoId: number
  ) {
    return this.todoService.getTodoById(userId, todoId);
  }
  @Post()
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 201, description: 'Created todo' })
  createtodo(@GetUser("id") userId: number, @Body() dto: CreateTodoDto) {
    return this.todoService.createTodo(userId, dto);
  }
  @Patch(":id")
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'todoId', description: 'Todo ID' })
  @ApiBody({ type: EditTodoDto })
  @ApiResponse({ status: 200, description: 'Updated todo' })
  edittodoById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) todoId: number,
    @Body() dto: EditTodoDto
  ) {
    return this.todoService.editTodoById(userId, todoId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'todoId', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  deletetodoById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) todoId: number
  ) {
    return this.todoService.deleteTodoById(userId, todoId);
  }
}
