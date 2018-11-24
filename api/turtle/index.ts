import { Router } from 'express';
import { parse } from 'graphql/language';
import { validate } from 'graphql/validation';
import { appConfig, setConfig } from '../services/config-repository';

export const turtleRouter = Router();

turtleRouter.post('/config', (req, res) => {
  const { token, ...config } = req.body;
  if (!token || token !== process.env.ACCESS_TOKEN) return res.status(403).json({ message: 'UNAUTHORIZED' });
  setConfig(config);
  return res.status(200).json({ message: 'SUCCESS' });
});

turtleRouter.get('/config', (_req, res) => {
  res.json(appConfig.config);
});

turtleRouter.post('/check', (req, res) => {
  const { requestor, query } = req.body;
  try {
    const validationErrors = validate(appConfig.schema, parse(query));
    if (validationErrors.length) {
      return res.json({ error: true, message: validationErrors[0].message });
    }
    res.json(appConfig.config);
  } catch (e) {
    return res.json({ error: true, message: 'Error validating query' });
  }
});
