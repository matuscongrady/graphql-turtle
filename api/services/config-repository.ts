import { readJsonSync } from 'fs-extra';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { resolve } from 'path';
import { fatal } from 'signale';
import { TypeField } from '../../utils/schema-introspection';

interface AppConfig {
  config: TurtleConfig;
  schema?: GraphQLSchema;
  resolveInfo: GraphQLResolveInfo;
  introspection: SchemaIntrospection;
  requestArgs: any;
  types: TypeField[];
}

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

export const appConfig: AppConfig = {
  config: getTurtleConfig(),
  schema: null,
  resolveInfo: null,
  introspection: null,
  types: [],
  requestArgs: null
};

export const setConfig = config => {
  appConfig.config = config;
};

export const setSchema = schema => {
  appConfig.schema = schema;
};

export const setTypes = types => {
  appConfig.types = types;
};

export const setResolveInfo = resolveInfo => {
  appConfig.resolveInfo = resolveInfo;
};

export const setRequestArgs = requestArgs => {
  appConfig.requestArgs = requestArgs;
};

export const setSchemaIntrospection = introspection => {
  appConfig.introspection = introspection;
};
