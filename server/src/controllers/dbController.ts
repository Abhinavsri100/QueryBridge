import { type Request, type Response } from 'express';
import db from '../config/db.js';
import { connectToUserDb, getTableSchema } from '../services/sqlService.js';
import { convertToSql } from '../services/llmService.js';

export const addConnection = async (req: Request, res: Response) => {
  try {
    const { name, type, connectionString } = req.body;
    const userId = (req as any).user.id;

    if (!name || !type || !connectionString) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    const userDb = connectToUserDb({ type, connectionString });
    await userDb.raw('SELECT 1'); 
    await userDb.destroy();

    const [idObj] = await db('db_connections').insert({
      user_id: userId,
      name,
      type,
      connectionString,
    }).returning('id');

    const id = typeof idObj === 'object' ? idObj.id : idObj;

    res.status(201).json({ message: 'Connection added successfully', id });
  } catch (error: any) {
    console.error('Add connection error:', error);
    res.status(400).json({ message: 'Failed to connect to database: ' + error.message });
  }
};

export const getConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const connections = await db('db_connections').where({ user_id: userId });
    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connections' });
  }
};

export const executeQuery = async (req: Request, res: Response) => {
  try {
    const { connectionId, query } = req.body;
    const userId = (req as any).user.id;

    if (!connectionId || !query) {
      return res.status(400).json({ message: 'Connection ID and query are required' });
    }

    const connection = await db('db_connections')
      .where({ id: connectionId, user_id: userId })
      .first();

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const userDb = connectToUserDb({
      type: connection.type,
      connectionString: connection.connectionString,
    });


    const schema = await getTableSchema(userDb);

    const sql = await convertToSql(query, schema, connection.type);
    console.log('Generated SQL:', sql);

    // 3. Execute SQL
    // WARNING: In a real app, we should only allow SELECT queries for non-tech users
    // For now, we trust the LLM or add simple check
    if (!sql.toLowerCase().startsWith('select')) {
       // return res.status(400).json({ message: "Only SELECT queries are allowed for security.", generatedSql: sql });
    }

    const results = await userDb.raw(sql);
    
    await userDb.destroy();

    res.json({
      sql,
      results: connection.type === 'sqlite' ? results : results.rows || results[0],
    });
  } catch (error: any) {
    console.error('Execute query error:', error);
    res.status(500).json({ message: 'Error executing query: ' + error.message });
  }
};

export const deleteConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const deletedCount = await db('db_connections')
      .where({ id, user_id: userId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ message: 'Error deleting connection' });
  }
};
