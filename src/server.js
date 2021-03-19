import express from 'express';
import path from 'path';
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



//Department routes


app.get('/api/departments', async (req, res) => {

  if (req.query.id) {

    const departmentId = parseInt(req.query.id);

    if (isNaN(departmentId)) {
      return res.status(400).send(
        {
          errorType: 'Validation',
          field: 'id',
          error: 'must be number'
        }
      );
    } else {

      res.send(await sqlService.query('SELECT * FROM departments WHERE id = ? AND deleted_at IS NULL', [departmentId]));
    }
  } else {

    res.send(await sqlService.query('SELECT * FROM departments WHERE deleted_at IS NULL'));
  }
}
);


app.post('/api/departments', async (req, res) => {

  const departmentData = req.body;

  const departmentValidationErrors = validateDepartment(departmentData);

  if (departmentValidationErrors.length === 0) {

    res.send(await sqlService.query('INSERT INTO departments (name, supervisor, created_at) VALUES (?, ?, NOW())', [departmentData.name, departmentData.supervisor]));

  } else {

    return res.status(500).json({

      errorCount: departmentValidationErrors.length,
      errors: departmentValidationErrors

    });
  }
});


app.put('/api/departments', async (req, res) => {

});


app.delete('/api/departments', async (req, res) => {

  const departmentId = parseInt(req.body.id);

  if (!isNan(departmentId)) {

    const departmentFound = await sqlService.query('SELECT * FROM departments WHERE id = ? AND deleted_at IS NULL', [departmentId]);

    if (departmentFound.length > 0) {

      res.send(await sqlService.query(`UPDATE departments SET deleted_at = NOW() WHERE id = ${departmentId}`));
    } else {

      return res.status(404).send(
        {
          errorType: 'Resource not found',
          field: 'id',
          error: 'department not found'
        }
      );
    }
  } else {

    return res.status(400).send(
      {
        errorType: 'Validation',
        field: 'id',
        error: 'must be provided as a number'
      }
    );
  }
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

    res.send(await sqlService.query('INSERT INTO employees (name, role, department, is_supervisor, supervisor, created_at) VALUES (?, ?, ?, ?, ?, NOW())', [employeeData.name, employeeData.role, employeeData.department, employeeData.is_supervisor, employeeData.supervisor]));

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

  const employeeId = req.body.id;

  if (!isNaN(employeeData.id)) {

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
  } else {

    return res.status(400).send(
      {
        errorType: 'Validation',
        field: 'id',
        error: 'must be provided as a number'
      }
    );
  }
});


//Catchall react handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../employee-directory-web/build'));
});


const validateEmployee = (employeeData) => {

  const { name, role, department, is_supervisor, supervisor } = employeeData;

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

  if (typeof department !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'department',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof is_supervisor !== 'boolean') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'is_supervisor',
        error: 'must be supplied as boolean'
      }
    );
  }

  if (typeof supervisor !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'supervisor',
        error: 'must be supplied as string'
      }
    );
  }

  return employeeDataErrorFields;
};


const validateDepartment = (departmentData) => {

  const { name, supervisor } = departmentData;

  const departmentDataErrorFields = [];

  if (typeof name !== 'string') {

    departmentDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'name',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof supervisor !== 'string') {

    departmentDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'supervisor',
        error: 'must be supplied as string'
      }
    );
  }

  return departmentDataErrorFields;
};


const PORT = process.env.PORT || 35565;

app.listen(PORT, () => {

  console.log(`listening on ${PORT}..`);
});