import knex, { type Knex } from 'knex';

export const connectToUserDb = (config: {
  type: string;
  connectionString: string;
}): Knex => {
  let client = '';
  let connection: any = config.connectionString;

  switch (config.type.toLowerCase()) {
    case 'mysql':
      client = 'mysql2';
      break;
    case 'postgresql':
    case 'postgres':
      client = 'pg';
      break;
    case 'sqlite':
      client = 'sqlite3';
      break;
    default:
      throw new Error('Unsupported database type');
  }

  return knex({
    client,
    connection,
    useNullAsDefault: config.type.toLowerCase() === 'sqlite',
  });
};

export const getTableSchema = async (db: Knex): Promise<string> => {
  
  let tables: any[] = [];
  const clientType = (db.client as any).config.client;

  if (clientType === 'sqlite3') {
    tables = await db('sqlite_master').where({ type: 'table' }).select('sql');
  } else if (clientType === 'pg') {
    tables = await db('information_schema.columns')
      .select('table_name', 'column_name', 'data_type')
      .where({ table_schema: 'public' });
  } else if (clientType === 'mysql2') {
    tables = await db('information_schema.columns')
      .select('table_name', 'column_name', 'data_type')
      .where({ table_schema: db.client.database() });
  }

  return JSON.stringify(tables);
};
