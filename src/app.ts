import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors({ origin: '*' })); // পরে নির্দিষ্ট origin দিয়ে বদলাবেন
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route — server বেঁচে আছে কিনা টেস্ট করার জন্য
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'IELTS App server is running 🚀',
  });
});

// TODO: এখানে পরে সব module routes মাউন্ট হবে (router.use('/api/v1', routes))

export default app;