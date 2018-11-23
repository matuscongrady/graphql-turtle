import { Router } from 'express';
import { getTurtleConfig } from '../services/config-loader';

export const turtleRouter = Router();

let turtleConfig = getTurtleConfig();

turtleRouter.post('/config', (req, res) => {
  const { token, ...config } = req.body;
  if (!token || token !== process.env.ACCESS_TOKEN) return res.status(403).json({ message: 'UNAUTHORIZED' });
  turtleConfig = config;
  return res.status(200).json({ message: 'SUCCESS' });
});

turtleRouter.get('/config', (_req, res) => {
  res.json(turtleConfig);
});
