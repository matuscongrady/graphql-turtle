import { Router } from 'express';
import { getTurtleConfig } from '../services/config-loader';

export const turtleRouter = Router();

const turtleConfig = getTurtleConfig();

turtleRouter.get('/config', (_req, res) => {
  res.json(turtleConfig);
});
