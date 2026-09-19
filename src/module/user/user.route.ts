import express from 'express';
import { UserController } from './user.controller';
// auth() middleware পরের ধাপে (Auth module) যোগ হবে — routes: router.get('/me', auth(), UserController.getMyProfile)

const router = express.Router();

router.get('/me', UserController.getMyProfile);
router.patch('/me', UserController.updateMyProfile);
router.get('/', UserController.getAllUsers); // TODO: admin-only guard পরের ধাপে

export const UserRoutes = router;