// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface FactoryProvider<T extends Function = Function> {
  /**
   * A function to invoke to create a value
   */
  useFactory: T;
}

export interface ValueProvider {
  useValue: unknown;
}

export type Provider = FactoryProvider | ValueProvider;

export function isFactory(provider: Provider): provider is FactoryProvider {
  return 'useFactory' in provider;
}
