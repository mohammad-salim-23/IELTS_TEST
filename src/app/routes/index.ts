
import express from 'express';
import { UserRoutes } from '../../module/user/user.route';
import { PaymentRoutes } from '../../module/payment/payment.route';
import { AuthRoutes } from '../../module/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
    {path : '/user', route:UserRoutes},
    {path: '/payment', route:PaymentRoutes},
    {path: '/auth', route:AuthRoutes}
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;