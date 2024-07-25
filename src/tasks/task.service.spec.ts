import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { GetTaskFilterDto } from './dto/get-task-dto';
import { TaskStatus } from './tasks.status.enum'; // Переконайтесь, що ви імпортуєте TaskStatus
import { TasksRepository } from './task-repository';
import { mock } from 'node:test';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }),
});

const mockUser: User = {
  id: 'someId',
  username: 'Ariel',
  password: 'somePassword',
  tasks: [],
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: MockRepository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<MockRepository<Task>>(
      getRepositoryToken(Task),
    );
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const mockTasks = [{ title: 'Test task', description: 'Test desc' }];
      tasksRepository.createQueryBuilder().getMany.mockResolvedValue(mockTasks);

      const filters: GetTaskFilterDto = {
        status: TaskStatus.OPEN,
        search: 'test',
      };
      const result = await tasksService.getTasks(filters, mockUser);

      expect(tasksRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask: object = {
        title: 'Test title',
        description: 'Test description ',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValueOnce(mockTask);

      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and handles an error', async () => {
      const taskId: string = 'someId';
      jest
        .spyOn(tasksService, 'getTaskById')
        .mockRejectedValue(
          new NotFoundException(`Task with ID "${taskId}" not found`),
        );

      await expect(tasksService.getTaskById(taskId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
