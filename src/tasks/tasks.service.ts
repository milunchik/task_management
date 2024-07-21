import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.models';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getFilterTask(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException('Task not found!');
    }

    return found;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
//routes
