/* eslint @typescript-eslint/no-explicit-any: 1 */

import { Server } from '../core/server';

export function log(tags: string | string[], data: string | object, requestId?: string) {
  if (!requestId) {
    Server.getServer().log(tags, data);
    return;
  }
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  const timestamp = Date.now();
  const field = data instanceof Error ? 'error' : 'data';
  const event = [{ info: { id: requestId } }, { timestamp, tags, [field]: data }];
  (Server.getServer() as any)._core.events.emit({ name: 'request', channel: 'app', tags }, event);
}
