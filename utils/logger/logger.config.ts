// src/logger/winston.config.ts
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';

const allTransports: (FileTransportInstance | ConsoleTransportInstance | DailyRotateFile)[] = [
  // Info and above - rotates daily, compresses old files, keeps 30 days
  new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    zippedArchive: true,
  }),
  // Errors - rotates daily, compresses old files, keeps 30 days
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
    zippedArchive: true,
  }),
];

if (process.env.NODE_ENV === 'development') {
  allTransports.push(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('App', {
          prettyPrint: true,
        }),
      ),
    }),
  );
}

export const winstonConfig = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: allTransports,
};
