import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeDatabase, pool } from './db.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: path.join(projectRoot, '.env') });

const app = express();
const port = Number(process.env.PORT || 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

app.use(express.json({ limit: '16kb' }));

app.get('/api/health', async (_request, response, next) => {
  try {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (_request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         price_cents AS "priceCents",
         old_price_cents AS "oldPriceCents",
         image_url AS image,
         rating::double precision AS rating,
         tag
       FROM products
       ORDER BY CASE id
         WHEN 'dark-brown-leather-biker-jacket' THEN 1
         WHEN 'rust-corduroy-baseball-cap' THEN 2
         WHEN 'beige-linen-shirt' THEN 3
         WHEN 'tobacco-suede-chelsea-boots' THEN 4
         ELSE 5
       END, name`,
    );
    response.json({ products: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post('/api/newsletter', async (request, response, next) => {
  const email = request.body?.email;

  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    response.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING email',
      [normalizedEmail],
    );
    response.status(result.rowCount === 1 ? 201 : 200).json({ subscribed: true });
  } catch (error) {
    next(error);
  }
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use(express.static(path.join(projectRoot, 'dist')));
app.get('*', (_request, response) => {
  response.sendFile(path.join(projectRoot, 'dist', 'index.html'));
});

app.use((error, _request, response, _next) => {
  console.error('Request failed:', error.message);
  response.status(500).json({ error: 'The request could not be completed.' });
});

try {
  await initializeDatabase();
  app.listen(port, '127.0.0.1', () => {
    console.log(`Store API listening on http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error('Could not initialize PostgreSQL or start the server:', error.message);
  await pool.end();
  process.exitCode = 1;
}
