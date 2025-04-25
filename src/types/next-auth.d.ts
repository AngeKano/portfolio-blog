// types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { UserRole } from '../domain/entities/User';

declare module 'next-auth' {
  /**
   * Étendre le type de l'objet User dans la session
   */
  interface User {
    id: string;
    role: UserRole;
  }

  /**
   * Étendre la session pour inclure le role et l'id utilisateur
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Étendre le token JWT pour inclure le role et l'id utilisateur
   */
  interface JWT {
    id: string;
    role: UserRole;
  }
}