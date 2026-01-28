import express from 'express';
import cors from 'cors';
import pool, { createTables } from './db';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the eDoc Admin Panel backend!');
});

app.get('/api/apps', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM apps');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const result = await pool.query(
      'UPDATE apps SET active = $1 WHERE id = $2 RETURNING *',
      [active, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const startServer = async () => {
  await createTables();
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

startServer();
