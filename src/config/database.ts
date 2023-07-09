import { knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'changeme',
        database: 'wallet',
        port: 5433,
    }
});

export default db;
