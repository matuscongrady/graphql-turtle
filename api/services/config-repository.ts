import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import { fatal } from 'signale';

const isDev = process.env.NODE_ENV === 'development';

const handleMissingConfig = (configPath: string) => {
  if (isDev) {
    fatal(`No config found on ${configPath}. Exitting process..`);
  } else {
    fatal(
      `No config found on ${configPath}. Exitting process. Please provide 'turtle-config.json' file with your config `
    );
  }
  process.exit(1);
};

export const getTurtleConfig = () => {
  const configPath = isDev ? resolve('api', process.env.CONFIG_PATH) : resolve('turtle-config.json');
  try {
    return readJsonSync(configPath);
  } catch (e) {
    handleMissingConfig(configPath);
  }
};

export const appConfig = { config: getTurtleConfig(), schema: null };

export const setConfig = config => {
  appConfig.config = config;
};

export const setSchema = schema => {
  appConfig.schema = schema;
};
