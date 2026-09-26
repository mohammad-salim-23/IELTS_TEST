import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
// auth() middleware পরের ধাপে (Auth module) যোগ হবে — routes: router.get('/me', auth(), UserController.getMyProfile)

const router = express.Router();

router.get('/me',auth(), UserController.getMyProfile);
router.patch('/me',auth(), UserController.updateMyProfile);
router.get('/',auth(USER_ROLE.ADMIN), UserController.getAllUsers); // TODO: admin-only guard পরের ধাপে

export const UserRoutes = router;