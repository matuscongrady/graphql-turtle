import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as logger from 'morgan';
import { join } from 'path';
import { error, info } from 'signale';
import { turtleRouter } from './turtle';

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

app.listen(port, () => info(`GraphQL turtle is listening on port ${port}`));
