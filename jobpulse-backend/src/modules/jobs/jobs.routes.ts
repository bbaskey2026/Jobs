import { Router } from 'express';
import { jobsController } from './jobs.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { optionalAuthenticate, authenticate } from '../../middleware/auth.middleware.js';
import { jobFilterSchema, reportJobSchema } from './jobs.schema.js';

const router = Router();

router.get('/', optionalAuthenticate, validate(jobFilterSchema), jobsController.list);
router.get('/government', optionalAuthenticate, validate(jobFilterSchema), jobsController.listGovernment);
router.get('/private', optionalAuthenticate, validate(jobFilterSchema), jobsController.listPrivate);
router.get('/:slugOrId', optionalAuthenticate, jobsController.getDetail);
router.post('/report', authenticate, validate(reportJobSchema), jobsController.report);

export default router;
