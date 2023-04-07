import morgan from 'morgan';
import { loggers } from '../utils/logger';
import enums from '../constants';

const morganSetup =
  process.env.NODE_ENV === 'production'
    ? morgan('combined', {
        stream: {
          write: (message) => {
            loggers[enums.WINSTON.ACCESS](message);
          },
        },
      })
    : morgan('dev');

export default morganSetup;
