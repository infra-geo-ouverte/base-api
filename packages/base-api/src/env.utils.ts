import { PathLike } from 'node:fs';

/**
 * Loads an env file into a target object without polluting `process.env`,
 * replicating the behaviour of `dotenv.config({ path, processEnv, quiet: true })`.
 *
 * Only keys that did not already exist in `process.env` before loading are
 * captured in `target`; they are then removed from `process.env` so the
 * caller's environment remains unchanged.
 */
export function loadEnvFile(config?: {
  path?: PathLike | undefined;
  target?: Record<string, string | undefined>;
}): void {
  const before = new Set(Object.keys(process.env));
  try {
    process.loadEnvFile(config?.path);
  } catch {
    // file not found or unreadable — continue silently
    console.warn(`Failed to load env file at ${config?.path}, skipping.`);
    return;
  }

  if (config?.target) {
    for (const key of Object.keys(process.env)) {
      if (!before.has(key)) {
        config.target[key] = process.env[key];
        delete process.env[key];
      }
    }
  }
}
