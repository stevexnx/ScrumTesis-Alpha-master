import { Module } from '@nestjs/common';

import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { CommentsModule } from '@Scrumfullt/features/comments/comments.module';
import { MongoFeatureProviderModule } from '@Scrumfullt/providers/database/mongo/feature-provider.module';

@Module({
  imports: [MongoFeatureProviderModule, CommentsModule],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
