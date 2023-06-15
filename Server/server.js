const { Client } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const client = new Client({
  user: 'postgres',
  host: 'host.docker.internal',
  database: 'DB-Mail',
  password: 't0ps3cr3t',
  port: 5432, // default PostgreSQL port
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/messages', (req, res) => {
  client.query('SELECT * FROM messages', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(result.rows);
    }
  });
});

// app.post('/users', (req, res) => {
//   const { name, email } = req.body;

//   client.query(
//     'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//     [name, email],
//     (err, result) => {
//       if (err) {
//         console.error('Error executing query', err);
//         res.status(500).json({ error: 'Internal server error' });
//       } else {
//         res.json(result.rows[0]);
//       }
//     }
//   );
// });

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });