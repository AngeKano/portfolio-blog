// infrastructure/db/prisma/client.ts
import { PrismaClient } from '@prisma/client';

// Éviter les instances multiples du client Prisma en développement 
// à cause du hot-reloading de Next.js
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;