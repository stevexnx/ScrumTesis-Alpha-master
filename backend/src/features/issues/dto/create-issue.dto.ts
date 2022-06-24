import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { IssueType } from '@Scrumfullt/features/issues/enums/issue-type.enum';
import { IssueStatus } from '@Scrumfullt/features/issues/enums/issue-status.enum';
import { IssuePriority } from '@Scrumfullt/features/issues/enums/issue-priority.enum';
import { User } from '@Scrumfullt/features/users/schemas/user.schema';

export class CreateIssueDto {
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsOptional()
  @IsIn([...Object.values(IssueType)])
  type: string;

  @IsOptional()
  @IsIn([...Object.values(IssueStatus)])
  status: string;

  @IsOptional()
  @IsIn([...Object.values(IssuePriority)])
  priority: string;

  @IsOptional()
  listPosition: number;

  @IsOptional()
  description: Record<string, unknown>;

  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  reporter: User;

  @IsOptional()
  assignees: User[];
}
