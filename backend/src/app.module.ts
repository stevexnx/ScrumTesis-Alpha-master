import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProjectsModule } from '@Scrumfullt/features/projects/projects.module';
import { IssuesModule } from '@Scrumfullt/features/issues/issues.module';
import { UsersModule } from '@Scrumfullt/features/users/users.module';
import { CommentsModule } from '@Scrumfullt/features/comments/comments.module';
import { configValidationSchema } from './config/app/config.schema';
import { HealthController } from '@Scrumfullt/features/health/health.controller';
import { MongoRootProviderModule } from '@Scrumfullt/providers/database/mongo/root-provider.module';

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
