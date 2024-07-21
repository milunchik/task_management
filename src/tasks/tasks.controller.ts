import {
  Body,
  Param,
  Query,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.models';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-dto';
import { UpdateTaskStatusDto } from './dto/update-task-dto';
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getFilterTask(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, status);
  }
}
