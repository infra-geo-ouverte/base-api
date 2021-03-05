export interface LoggerOptions {
  exclude?: {
    ips: string[];
  };
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
}
