import express from 'express';
import { VideoController } from '../controllers';

const { Router } = express;
const router = Router();

router.post('/video-service/uploadVideo', VideoController.uploadVideo);

export default router;
