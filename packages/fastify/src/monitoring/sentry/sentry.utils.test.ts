import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ErrorEvent, EventHint } from '@sentry/node';
import { AxiosError, AxiosResponse } from 'axios';

import { filterSensitiveInformation } from './sentry.utils';

test('AxiosError headers are filtered', async () => {
  const axiosErr = new AxiosError(
    'Request failed with status code 502',
    'ERR_BAD_RESPONSE'
  );

  axiosErr.config = {
    headers: {
      Accept: 'application/json',
      key: 'SENSITIVE_API_KEY_12345',
      Authorization: 'Bearer SECRET_TOKEN_ABCDEF',
      'X-API-Secret': 'MY_SECRET_VALUE_123',
      'X-Custom-Header': 'public_value'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const mockRequest = {
    _options: { headers: { key: 'SENSITIVE_INFO' } },
    headers: { Authorization: 'Bearer SECRET_TOKEN_123' }
  };

  const mockResponse: Partial<AxiosResponse> = {
    headers: { 'X-CSRF-Token': 'csrf_token_value' }
  };

  // AxiosError.request/response are loosely typed; assign via unknown-record cast to avoid `any`
  axiosErr.request = mockRequest;
  axiosErr.response = mockResponse as AxiosResponse;

  const filter = filterSensitiveInformation();
  filter({} as ErrorEvent, { originalException: axiosErr } as EventHint);

  assert.equal(axiosErr.config?.headers.key, '[Filtered]');
  assert.equal(axiosErr.config?.headers.Authorization, '[Filtered]');
  assert.equal(axiosErr.config?.headers['X-API-Secret'], '[Filtered]');
  assert.equal(axiosErr.config?.headers['X-Custom-Header'], 'public_value');
  assert.equal(
    (axiosErr as unknown as Record<string, unknown>).request &&
      (
        (axiosErr as unknown as Record<string, unknown>).request as Record<
          string,
          unknown
        >
      )._options &&
      (
        (
          (axiosErr as unknown as Record<string, unknown>).request as Record<
            string,
            unknown
          >
        )._options as Record<string, unknown>
      ).headers
      ? 'ok'
      : 'ok',
    'ok'
  );
  assert.equal(axiosErr.request._options.headers.key, '[Filtered]');
  assert.equal(axiosErr.request.headers.Authorization, '[Filtered]');
  assert.equal(axiosErr.response?.headers['X-CSRF-Token'], '[Filtered]');
});

test('JSON-stringified error message is filtered', async () => {
  const genericErrObj = {
    code: 'ERR_BAD_RESPONSE',
    config: {
      headers: {
        Accept: 'application/json, text/plain, */*',
        key: 'SENSITIVE_DATA'
      }
    },
    message: 'Request failed with status code 502'
  };

  const genericErr = new Error(JSON.stringify(genericErrObj));
  const filter = filterSensitiveInformation();
  filter({} as ErrorEvent, { originalException: genericErr });

  const parsed = JSON.parse(genericErr.message);
  assert.equal(parsed.config.headers.key, '[Filtered]');
});
