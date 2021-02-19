import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import SqlService from './SqlService';


global.__dirname = path.resolve('./');


const app = express()
  .use(cors())
  .use(express.static(path.join(__dirname, '../../employee-directory-web/build')))
  .use(bodyParser.json());


const sqlService = new SqlService();

//Companies

app.get('/api/companies', async (req, res) => {

});

app.post('/api/companies', async (req, res) => {

});

app.put('/api/companies', async (req, res) => {

});

app.delete('/api/companies', async (req, res) => {

});

//Employees

app.get('/api/employees', async (req, res) => {
  if (req.query.id) {
    SqlService.query('SELECT * FROM employees')
  }
});

app.post('/api/employees', async (req, res) => {

});

app.put('/api/employees', async (req, res) => {

});

app.delete('/api/employees', async (req, res) => {

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}..`);
});