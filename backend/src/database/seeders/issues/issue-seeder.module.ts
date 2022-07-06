import { Module } from '@nestjs/common';

import { IssueSeeder } from './issue-seeder.service';
import { MongoFeatureProviderModule } from '@scrumfull/providers/database/mongo/feature-provider.module';

@Module({
  imports: [MongoFeatureProviderModule],
  providers: [IssueSeeder],
  exports: [IssueSeeder],
})
export class IssueSeederModule {}
