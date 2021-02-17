import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';

global.__dirname = path.resolve('./');

const app = express();

const PORT = process.env.PORT || 35565;

const connection = mysql.createConnection({
  host: `localhost/${PORT}`,
});

app.use(cors());


app.get('/api/companies', (req, res) => {

});

app.get('/api/users', (req, res) => {

});

app.post('/api/users', async (req, res) => {

});

app.put('/api/users', (req, res) => {

});


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});