import pino from 'pino';
import { config } from '../src/config/config.js';

export const logger = pino({
    level: config.env === 'production' ? 'info' : 'debug',
    transport: config.env !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    } : undefined
});
