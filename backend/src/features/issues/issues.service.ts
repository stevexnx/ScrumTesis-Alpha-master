import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ClientSession, Model } from 'mongoose';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue, IssueDocument } from './schemas/issue.schema';
import { mongooseErrorHandler } from '@scrumfull/common/helpers/mongoose-error-handler';
import { GetIssueFilterDto } from './dto/get-issue-filter.dto';
import { CommentsService } from '@scrumfull/features/comments/comments.service';

@Injectable()
export class IssuesService {
  constructor(
    @InjectModel(Issue.name) private issueModel: Model<IssueDocument>,
    private readonly commentsService: CommentsService,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    const createIssue = new this.issueModel(createIssueDto);

    try {
      const result = await createIssue.save();
      return result;
    } catch (error) {
      mongooseErrorHandler(error);
    }
  }

  findAll(filterDto: GetIssueFilterDto) {
    const { projectId } = filterDto;
    const query = this.issueModel.find();

    if (projectId) {
      query.where('projectId', projectId);
    }
    return query.exec();
  }

  async findById(id: string) {
    const found = await this.issueModel.findById(id);
    if (!found) {
      throw new NotFoundException(`Tarea con el ID ${id} no encontrado`);
    }
    return found;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    let result: Issue;
    try {
      result = await this.issueModel
        .findOneAndUpdate({ _id: id }, updateIssueDto, {
          new: true,
        })
        .exec();
    } catch (error) {
      mongooseErrorHandler(error);
    }

    if (!result) {
      throw new NotFoundException(`Tarea con el ID ${id} no encontrado`);
    }
    return result;
  }

  async remove(id: string) {
    const session: ClientSession = await this.issueModel.startSession();
    session.startTransaction();

    try {
      const result = await this.issueModel
        .deleteOne({ _id: id }, { session })
        .exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Tarea con el ID ${id} no encontrado`);
      }
      await this.commentsService.deleteCommentsByIssueId(id, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteIssuesByProjectId(projectId: string, session: ClientSession) {
    try {
      const docs = await this.issueModel.find({ projectId });
      const issueIds: string[] = docs.map((issue) => issue.id);

      const result = await this.issueModel.deleteMany(
        { projectId },
        { session },
      );

      // Is 1 if the command executed correctly.
      if (result.ok !== 1) {
        throw new InternalServerErrorException(
          `Error al eliminar las tareas asociadas con el proyecto con el ID ${projectId}`,
        );
      }
      await this.commentsService.deleteCommentsByIssueIds(issueIds, session);
    } catch (error) {
      throw error;
    }
  }
}
