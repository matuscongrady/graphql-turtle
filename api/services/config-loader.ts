import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import { fatal } from 'signale';

const isDev = process.env.NODE_ENV === 'developmentt';

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

let config;

export const getTurtleConfig = () => {
  if (config) return config;
  const configPath = isDev ? resolve('api', process.env.CONFIG_PATH) : resolve('turtle-config.json');
  try {
    config = readJsonSync(configPath);
  } catch (e) {
    handleMissingConfig(configPath);
  }
  return config;
};
