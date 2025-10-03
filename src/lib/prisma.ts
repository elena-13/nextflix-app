import { PrismaClient } from '@prisma/client';

// Declare a global variable to store the Prisma client.
// This is needed to avoid creating new connections on every hot reload in development mode.
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// In the development environment, store the created instance in a global variable.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
