import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';


global.__dirname = path.resolve('./');


const app = express();


const PORT = process.env.PORT || 35565;


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees'
});


app.use(cors());

app.use(express.static(path.join(__dirname, '../../employee-directory-web/build')));

app.use(bodyParser.json());


app.get('/api/companies', (req, res) => {


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