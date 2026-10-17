import { Request, Response, NextFunction } from 'express';
import { jobsService } from './jobs.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';

export class JobsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobs, pagination } = await jobsService.getJobs({
        ...req.query,
        currentUserId: req.user?.id
      });
      return sendPaginated(res, jobs, pagination);
    } catch (error) {
      next(error);
    }
  }

  async listGovernment(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobs, pagination } = await jobsService.getJobs({
        ...req.query,
        isGovernment: true,
        currentUserId: req.user?.id
      });
      return sendPaginated(res, jobs, pagination);
    } catch (error) {
      next(error);
    }
  }

  async listPrivate(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobs, pagination } = await jobsService.getJobs({
        ...req.query,
        isGovernment: false,
        currentUserId: req.user?.id
      });
      return sendPaginated(res, jobs, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const slugOrId = req.params.slugOrId;
      const job = await jobsService.getJobBySlugOrId(slugOrId, req.user?.id);
      return sendSuccess(res, job);
    } catch (error) {
      next(error);
    }
  }

  async report(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, reason, description } = req.body;
      const result = await jobsService.reportJob(jobId, reason, description, req.user?.id);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const jobsController = new JobsController();
