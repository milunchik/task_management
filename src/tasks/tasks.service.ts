import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './dto/task.entity';
import { TaskStatus } from './tasks.status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto || null;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async getTaskById(id: string, user: User): Promise<Task | any> {
    try {
      const found = await this.tasksRepository.findOne({
        where: { id, user },
      });

      if (!found) {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }

      return found;
    } catch (error) {
      console.log(error);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      console.log('Falied to create ', error);
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      const found = await this.tasksRepository.findOne({
        where: { id, user },
      });

      if (!found) {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }

      await this.tasksRepository.delete(found.id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    try {
      const task = await this.getTaskById(id, user);

      task.status = status;
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      console.log(error);
    }
  }
}
