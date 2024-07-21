import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.models';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
