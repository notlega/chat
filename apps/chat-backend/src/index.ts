import app from './app';
import { loggers } from './utils/logger';
import enums from './constants';

const port = process.env.PORT ?? 3333;
const server = app.listen(port, () => {
  loggers[enums.WINSTON.INFO](`Listening at http://localhost:${port}/apiv1`);
});

server.on('error', loggers[enums.WINSTON.ERROR]);

process.on('uncaughtException', (error, origin) => {
  loggers[enums.WINSTON.ERROR](`An uncaught error at ${origin}`);
  loggers[enums.WINSTON.ERROR]('Uncaught error', error);

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  loggers[enums.WINSTON.ERROR]('Uncaught rejection', reason);
  promise.catch((e: Error) => {
    loggers[enums.WINSTON.DEBUG](`The error in promise ${e.stack ?? e.message}`);
  });
});
