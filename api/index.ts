import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { request } from 'graphql-request';
import { addSchemaLevelResolveFunction } from 'graphql-tools';
import { buildClientSchema } from 'graphql/utilities/buildClientSchema';
import { introspectionQuery } from 'graphql/utilities/introspectionQuery';
import * as logger from 'morgan';
import { join, resolve } from 'path';
import { error, info } from 'signale';
import { getTypes } from '../utils/schema-introspection';
import { setResolveInfo, setSchema, setSchemaIntrospection, setTypes } from './services/config-repository';
import { turtleRouter } from './turtle/router';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(join(__dirname, '../dist-client')));
app.set('json spaces', 2);

app.use('/turtle', turtleRouter);
app.use((err, _req, res, _next) => {
  res.status(500).json({ error });
  error(err);
});

app.get('*', (_request, response) => {
  response.sendFile(resolve(__dirname, '../dist-client/index.html'));
});

request(process.env.GRAPH_API_URL, introspectionQuery)
  .then((introspection: any) => {
    const schema = buildClientSchema(introspection);
    addSchemaLevelResolveFunction(schema, (_p1, _p2, _p3, resolveInfo) => {
      setResolveInfo(resolveInfo);
    });
    setSchemaIntrospection(introspection);
    setTypes(getTypes(introspection));
    setSchema(schema);
    app.listen(port, () => info(`GraphQL turtle is listening on port ${port}`));
  })
  .catch(err => {
    error(`Unable to load schema from ${process.env.GRAPH_API_URL}`, err);
  });
