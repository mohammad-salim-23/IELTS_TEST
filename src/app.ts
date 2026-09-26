import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './app/routes';
import globalErrorHandler from './errors/globalErrorHandler';
import notFound from './middleware/notFound';
import cookieParser from 'cookie-parser';
const app: Application = express();

// Middleware
app.use(cors({ origin: '*' })); // পরে নির্দিষ্ট origin দিয়ে বদলাবেন
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Health check route — server বেঁচে আছে কিনা টেস্ট করার জন্য
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'IELTS App server is running 🚀',
  });
});

app.use('/api/v1',routes);
app.use(notFound);
app.use(globalErrorHandler);


export default app;