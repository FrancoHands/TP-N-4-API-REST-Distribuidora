import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

const url = new URL(process.env.DATABASE_URL as string);
url.searchParams.set('connectionLimit', '10');

const adapter = new PrismaMariaDb(url.toString());

const prisma = new PrismaClient({ adapter });

export default prisma;
