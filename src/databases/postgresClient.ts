import { PrismaClient } from '@prisma/client';

console.timeLog('Instantiating Prisma Client');
const prisma = new PrismaClient();

export default prisma;
