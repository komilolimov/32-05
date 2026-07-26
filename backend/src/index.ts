import cors from 'cors';
import express from 'express';
import jobsRouter from './routes/jobs.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
});

export default app;
