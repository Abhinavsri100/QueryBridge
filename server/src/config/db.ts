import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

const db = knex({
  client: isPostgres ? 'pg' : 'sqlite3',
  connection: process.env.DATABASE_URL || {
    filename: './database.sqlite',
  },
  useNullAsDefault: !isPostgres,
});


const initDb = async () => {
  try {
    const hasTable = await db.schema.hasTable('users');
    if (!hasTable) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('name');
        table.timestamps(true, true);
      });
      console.log('Users table created');
    }

    const hasConnectionsTable = await db.schema.hasTable('db_connections');
    if (!hasConnectionsTable) {
      await db.schema.createTable('db_connections', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.string('name').notNullable();
        table.string('type').notNullable(); 
        table.text('connectionString').notNullable();
        table.timestamps(true, true);
      });
      console.log('DB Connections table created');
    }
  } catch (err) {
    console.error('Database migration/init error:', err);
  }
};

initDb();

export default db;
