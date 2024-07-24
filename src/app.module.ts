import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`, '.env'],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host: string = configService.get<string>('DB_HOST');
        const port: number = configService.get<number>('DB_PORT');
        const username: string = configService.get<string>('DB_USERNAME');
        const password: string = configService.get<string>('DB_PASSWORD');
        const database: string = configService.get<string>('DB_DATABASE');

        console.log({ host, port, username, password, database });
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: host,
          port: port,
          username: username,
          password: password,
          database: database,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
