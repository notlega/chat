import { format, createLogger, transports, type Logger } from 'winston';
import { join } from 'path';
import enums from '../constants';

const logdir = join(__dirname, '..', '..', 'logs');
const LEVELS: string[] = Object.values(enums.WINSTON);

const createWinstonLogger = (level: string) => {
  const logger: Logger = createLogger({
    level,
    levels: { [level]: 0 },
    transports: [
      new transports.File({
        level,
        format: format.combine(format.timestamp(), format.prettyPrint()),
        filename: `${level}.log`,
        dirname: logdir,
      }),
    ],
  });

  if (process.env.NODE_ENV === 'development') {
    logger.add(
      new transports.Console({
        level,
        format: format.combine(format.colorize(), format.simple()),
      })
    );
  }

  // TODO: fix this random ts error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (...args: string[]) => logger.log(level, ...args);
};

const loggers = {};

LEVELS.forEach((level: string) => {
  loggers[level] = createWinstonLogger(level);
});

export { loggers };
