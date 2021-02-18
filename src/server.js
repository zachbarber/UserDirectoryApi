import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';


global.__dirname = path.resolve('./');


const app = express();


const PORT = process.env.PORT || 3000;


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employeedirectory'
});


app.use(cors());

app.use(express.static(path.join(__dirname, '../../employee-directory-web/build')));

app.use(bodyParser.json());


app.get('/api/companies', (req, res) => {
  if (req.query.id) {
    (await () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employees WHERE id = ?', [req.id], (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  } else {
    (await () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employees', (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  }
});

app.get('/api/users', (req, res) => {

});

app.post('/api/users', async (req, res) => {

});

app.put('/api/users', (req, res) => {

});


app.listen(PORT, () => {
  console.log(`listening on ${PORT}..`);
});