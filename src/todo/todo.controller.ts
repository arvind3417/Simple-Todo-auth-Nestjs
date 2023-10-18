import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guard';
import { TodoService } from './todo.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
// @UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
    constructor(private bookmarkService:TodoService){}
    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(
          userId,
        );
      } 
      @Get(':id')
      getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
      ) {
        return this.bookmarkService.getBookmarkById(
          userId,
          bookmarkId,
        );
      }
      @Post()
      createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmarkDto,
      ) {
        return this.bookmarkService.createBookmark(
          userId,
          dto,
        );
      }
      @Patch(':id')
      editBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: EditBookmarkDto,
      ) {
        return this.bookmarkService.editBookmarkById(
          userId,
          bookmarkId,
          dto,
        );
      }
      @HttpCode(HttpStatus.NO_CONTENT)
      @Delete(':id')
      deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
      ) {
        return this.bookmarkService.deleteBookmarkById(
          userId,
          bookmarkId,
        );
      }
    
}
