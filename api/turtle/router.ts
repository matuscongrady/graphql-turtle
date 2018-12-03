import { Router } from 'express';
import { parse } from 'graphql/language';
import { validate } from 'graphql/validation';
import { error } from 'signale';
import { appConfig, setConfig } from '../services/config-repository';
import { authorize } from './authorize';

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
  const { requestor: requestorJSON, query } = req.body;

  try {
    const validationErrors = validate(appConfig.schema, parse(query));
    if (validationErrors.length) {
      return res.json({ error: true, message: validationErrors[0].message });
    }
    const requestor = JSON.parse(requestorJSON);
    return res.json({ isAuthorized: authorize(query, requestor) });
  } catch (e) {
    error(e);
    return res.json({ error: true, message: 'Error validating query' });
  }
});
