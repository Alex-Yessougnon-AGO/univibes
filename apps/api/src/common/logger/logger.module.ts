import { Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonUtilities,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            nestWinstonUtilities.format.nestLike('Univibes', {
              colors: process.env.NODE_ENV !== 'production',
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 10,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
