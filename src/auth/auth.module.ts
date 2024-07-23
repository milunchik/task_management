import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [AuthService, UsersRepository],
  controllers: [AuthController],
})
export class AuthModule {}
