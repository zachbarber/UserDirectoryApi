import express from 'express';
import path, { parse } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import SqlService from './SqlService';


//Required for Babel module experimental ES6 & NodeJS compatibility
global.__dirname = path.resolve('./');


const app = express()
  .use(cors())
  .use(express.static(path.join(__dirname, '../../employee-directory-web/build')))
  .use(bodyParser.json());


const sqlService = new SqlService();


//Companie routes


app.get('/api/companies', async (req, res) => {

  if (req.query.id) {
    const companyId = parseInt(req.query.id);

    if (isNaN(companyId)) {
      return res.status(400).send(
        {
          errorType: 'Validation',
          field: 'id',
          error: 'must be number'
        }
      );
    } else {

      res.send(await sqlService.query('SELECT * FROM companies WHERE id = ? AND deleted_at IS NULL', [companyId]));

    }
  } else {

    res.send(await sqlService.query('SELECT * FROM companies WHERE deleted_at IS NULL'));
  }
}
);


app.post('/api/companies', async (req, res) => {

  const companyData = req.body;

  const companyValidationErrors = validateCompany(companyData);

  if (companyValidationErrors.length === 0) {

    res.send(await sqlService.query('INSERT INTO companies (name, industry, annual_revenue, created_at) VALUES (?, ?, ?, NOW())', [companyData.name, companyData.industry, companyData.annualRevenue]));

  } else {

    return res.status(500).json({

      errorCount: companyValidationErrors.length,
      errors: companyValidationErrors

    });
  }
});

app.put('/api/companies', async (req, res) => {

});

app.delete('/api/companies', async (req, res) => {

});


//Employee routes


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

  const employeeData = req.body;

  const employeeValidationErrors = validateEmployee(employeeData);

  if (employeeValidationErrors.length === 0) {

    res.send(await sqlService.query('INSERT INTO employees (name, role, company, created_at) VALUES (?, ?, ?, NOW())', [employeeData.name, employeeData.role, employeeData.company]));

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

        return res.status(404).send(
          {
            errorType: 'Resource not found',
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



const validateEmployee = (employeeData) => {

  const { name, role, company } = employeeData;

  const employeeDataErrorFields = [];

  if (typeof name !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'name',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof role !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'role',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof company !== 'string') {

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


const validateCompany = (companyData) => {

  const { name, industry, annualRevenue } = companyData;

  const companyDataErrorFields = [];

  if (typeof name !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'name',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof industry !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'industry',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof annualRevenue !== 'number') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'annual revenue',
        error: 'must be supplied as number'
      }
    );
  }

  return companyDataErrorFields;
};


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`listening on ${PORT}..`);
});