import { PrismaClient } from '@prisma/client';

console.log('Instantiating Prisma Client');
const prisma = new PrismaClient();

export default prisma;
