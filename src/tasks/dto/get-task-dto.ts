import { TaskStatus } from '../tasks.models';

export class GetTaskFilterDto {
  status: TaskStatus;
  search: string;
}
