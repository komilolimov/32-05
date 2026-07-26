import { Router } from 'express';
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getJobByIdController,
} from '../controllers/jobs.controller.js';

const router = Router();

router.post('/', createJobController);
router.get('/', getAllJobsController);
router.get('/:id', getJobByIdController);
router.delete('/:id', deleteJobController);

export default router;
