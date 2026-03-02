import { IncomingHttpHeaders } from 'node:http';

import { ErrorEvent, EventHint } from '@sentry/node';
import { AxiosError } from 'axios';

export const MONITORING_SENSITIVE_HEADERS = [
  'auth',
  'token',
  'secret',
  'password',
  'passwd',
  'pwd',
  'key',
  'x-api-key',
  'x-private-api-key',
  'jwt',
  'bearer',
  'sso',
  'saml',
  'csrf',
  'xsrf',
  'credentials'
];

export function filterSensitiveInformation(
  sensitiveHeaders = MONITORING_SENSITIVE_HEADERS
) {
  const filterSensitiveInformation = new FilterSensitiveInformation(
    sensitiveHeaders
  );

  return (event: ErrorEvent, hint: EventHint) =>
    filterSensitiveInformation.filter(event, hint);
}

class FilterSensitiveInformation {
  constructor(private sensitiveHeaders: string[]) {}

  filter(event: ErrorEvent, hint: EventHint) {
    if (hint?.originalException instanceof AxiosError) {
      this.filterAxiosError(hint.originalException);
    }

    if (hint?.originalException && typeof hint.originalException === 'object') {
      const exc = hint.originalException as Record<string, unknown>;

      if (exc.message && typeof exc.message === 'string') {
        exc.message = this.filterJsonString(exc.message);
      }

      this.filterSensitiveDataDeep(exc);
    }

    return event;
  }
  // Helper function to check if a header name matches sensitive patterns
  private isSensitiveHeader(headerName: string): boolean {
    return this.sensitiveHeaders.some((pattern) =>
      headerName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  // Helper function to filter sensitive headers from an object
  private filterHeaders(headers: IncomingHttpHeaders): void {
    if (!headers || typeof headers !== 'object') return;
    Object.keys(headers).forEach((key) => {
      if (this.isSensitiveHeader(key)) {
        const curr = (headers as Record<string, unknown>)[key];
        if (Array.isArray(curr)) {
          (headers as Record<string, unknown>)[key] = curr.map(
            () => '[Filtered]'
          );
        } else {
          (headers as Record<string, unknown>)[key] = '[Filtered]';
        }
      }
    });
  }

  /**
   * Filter sensitive data from a JSON string (when error is stringified)
   */
  private filterJsonString(jsonString: string): string {
    try {
      const parsed = JSON.parse(jsonString);
      this.filterSensitiveDataDeep(parsed);
      return JSON.stringify(parsed);
    } catch {
      // If it's not valid JSON, return as-is
      return jsonString;
    }
  }

  /**
   * Deep recursive scrubbing for nested objects that might contain headers
   */
  private filterSensitiveDataDeep(
    obj: unknown,
    depth = 0,
    maxDepth = 10
  ): void {
    if (depth > maxDepth || !obj || typeof obj !== 'object') return;

    try {
      Object.keys(obj).forEach((key) => {
        const value = (obj as Record<string, unknown>)[key];

        // If we find a 'headers' object, filter it
        if (
          key.toLowerCase() === 'headers' &&
          typeof value === 'object' &&
          value !== null
        ) {
          this.filterHeaders(value as IncomingHttpHeaders);
        }

        // If we find a 'config' object with headers, filter it
        if (
          key.toLowerCase() === 'config' &&
          typeof value === 'object' &&
          value !== null
        ) {
          const config = value as Record<string, unknown>;
          if (typeof config.headers === 'object' && config.headers !== null) {
            this.filterHeaders(config.headers as IncomingHttpHeaders);
          }
        }

        // Recursively check nested objects and arrays
        if (Array.isArray(value)) {
          value.forEach((el) => {
            if (el && typeof el === 'object') {
              this.filterSensitiveDataDeep(el, depth + 1, maxDepth);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          this.filterSensitiveDataDeep(value, depth + 1, maxDepth);
        }
      });
    } catch {
      // Silently ignore errors during deep scrubbing
    }
  }

  private filterAxiosError(error: AxiosError) {
    // Filter headers from Axios error config
    if (error.config?.headers) {
      this.filterHeaders(error.config.headers);
    }

    // Filter headers from _options (used in request object)
    if (error.request?._options?.headers) {
      this.filterHeaders(error.request._options.headers);
    }

    // Filter headers from request object if present
    if (error.request?.headers) {
      this.filterHeaders(error.request.headers);
    }

    // Also filter response headers if present
    if (error.response?.headers) {
      this.filterHeaders(error.response.headers as IncomingHttpHeaders);
    }
  }
}
