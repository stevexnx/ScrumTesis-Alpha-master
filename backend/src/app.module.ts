import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProjectsModule } from '@scrumfull/features/projects/projects.module';
import { IssuesModule } from '@scrumfull/features/issues/issues.module';
import { UsersModule } from '@scrumfull/features/users/users.module';
import { CommentsModule } from '@scrumfull/features/comments/comments.module';
import { configValidationSchema } from './config/app/config.schema';
import { HealthController } from '@scrumfull/features/health/health.controller';
import { MongoRootProviderModule } from '@scrumfull/providers/database/mongo/root-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
      cache: true,
    }),
    MongoRootProviderModule,
    ProjectsModule,
    IssuesModule,
    UsersModule,
    CommentsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
