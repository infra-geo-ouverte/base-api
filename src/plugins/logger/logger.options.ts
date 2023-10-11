export enum LoggerLevel {
  trace = 'trace',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal'
}

export interface LoggerOptions {
  exclude?: {
    ips: string[];
  };
  level?: LoggerLevel;
}
