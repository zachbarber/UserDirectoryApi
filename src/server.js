import express from 'express';
import path, { parse } from 'path';
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

    const employeeId = parseInt(req.query.id);

    if (isNaN(employeeId)) {

      return res.status(400).send(
        {
          errorType: 'Validation',
          field: 'id',
          error: 'must be number'
        }
      );
    } else {

      res.send(await sqlService.query('SELECT * FROM employees WHERE id = ?', [employeeId]));

    }
  } else {

    res.send(await sqlService.query('SELECT * FROM employees'));
  }
}
);


app.post('/api/employees', async (req, res) => {

  const employeeValidationErrors = validateEmployee(req.body, false);

  if (!employeeValidationErrors) {

    const employeeData = req.body;

  } else {

    return res.status(500).json({

      errorCount: employeeValidationErrors.length,
      errors: employeeValidationErrors

    });
  }
});

app.put('/api/employees', async (req, res) => {

});

app.delete('/api/employees', async (req, res) => {

});



const validateEmployee = (employeeData, requireId) => {

  const { name, role, company } = employeeData;

  const employeeDataErrorFields = [];

  switch (!'string') {
    case typeof name:
      employeeDataErrorFields.push(
        {
          errorType: 'Validation',
          field: 'name',
          error: 'must be supplied as string'
        }
      );
    case typeof role:
      employeeDataErrorFields.push(
        {
          errorType: 'Validation',
          field: 'role',
          error: 'must be supplied as string'
        }
      );
    case typeof company:
      employeeDataErrorFields.push(
        {
          errorType: 'Validation',
          field: 'company',
          error: 'must be supplied as string'
        }
      );
  }

  return employeeDataErrorFields;
};



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`listening on ${PORT}..`);
});