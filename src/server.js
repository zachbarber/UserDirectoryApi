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

      res.send(await sqlService.query('SELECT * FROM employees WHERE id = ? AND deleted_at IS NULL', [employeeId]));

    }
  } else {

    res.send(await sqlService.query('SELECT * FROM employees WHERE deleted_at IS NULL'));
  }
}
);


app.post('/api/employees', async (req, res) => {

  const employeeValidationErrors = validateEmployee(req.body, false);

  if (!employeeValidationErrors) {

    const employeeData = req.body;

    await sqlService.query('INSERT INTO employees (name, role, company, created_at) VALUES (?, ?, ?, NOW())', [employeeData.name, employeeData.role, employeeData.company]);

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

  const employeeData = req.body;

  if (employeeData.id) {

    const employeeId = parseInt(employeeData.id);

    if (isNaN(employeeId)) {

      return res.status(400).send(
        {
          errorType: 'Validation',
          field: 'id',
          error: 'must be provided as a number'
        }
      );
    } else {

      const employeeFound = await sqlService.query('SELECT * FROM employees WHERE id = ? AND deleted_at IS NULL', [employeeId]);

      if (employeeFound.length > 0) {

        res.send(await sqlService.query(`UPDATE employees SET deleted_at = NOW() WHERE id = ${employeeId}`));
      } else {

        return res.status(400).send(
          {
            errorType: 'Validation',
            field: 'id',
            error: 'employee not found'
          }
        );
      }
    };

  } else {

    return res.status(400).send(
      {
        errorType: 'Validation',
        field: 'id',
        error: 'id not provided'
      }
    );
  }
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