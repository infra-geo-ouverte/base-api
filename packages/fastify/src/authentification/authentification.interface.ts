export interface IConsumer {
  /** Le id externe de l'usager */
  id: string;
  /** Le id interne de l'usager (DB:auth TABLE:user) */
  customId: number;
  username: string;
  groups: string[];
  isAnonymous: boolean;
}

export interface IAuthentification {
  consumer: IConsumer;
}

declare module 'fastify' {
  interface FastifyRequest {
    consumer: IConsumer;
  }
}
