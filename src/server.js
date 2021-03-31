import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import SqlService from './SqlService';


//Required for Babel module experimental ES6 & NodeJS compatibility
global.__dirname = path.resolve('./');


const app = express()
  .use(cors())
  .use(express.static(path.join(__dirname, '/build')))
  .use(bodyParser.json());



const sqlService = new SqlService();


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/build'));
});


//Department routes

app.get('/api/departmentNameIds', async (req, res) => {
  res.send(await sqlService.query('SELECT id, name FROM departments WHERE deleteDate IS NULL'));
});

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

      res.send(await sqlService.query(
        `SELECT 
        employees.id AS employeeId, 
        employees.name AS employeeName,
        employees.isSupervisor AS isSupervisor, 
        departments.* 
        FROM employees 
        INNER JOIN departments ON employees.departmentId = departments.id 
        WHERE departments.id = ?`,
        [departmentId]
      )
      );
    }
  } else {

    res.send(await sqlService.query('SELECT * FROM departments WHERE deleteDate IS NULL'));
  }
}
);


app.post('/api/departments', async (req, res) => {

  const departmentData = req.body;

  const departmentValidationErrors = validateDepartment(departmentData);

  if (departmentValidationErrors.length === 0) {

    res.send(await sqlService.query('INSERT INTO departments (name, supervisorId, createDate) VALUES (?, ?, NOW())', [departmentData.name, departmentData.supervisorId]));

  } else {

    return res.status(500).json({

      errorCount: departmentValidationErrors.length,
      errors: departmentValidationErrors

    });
  }
});


app.put('/api/departments', async (req, res) => {

  const departmentId = parseInt(req.body.id);

  if (!isNaN(departmentId)) {

    const departmentToUpdate = await SqlService.query('SELECT * FROM departments WHERE id = ? AND deleteDate IS NULL', [departmentId]);

    if (departmentToUpdate.length > 0) {

      res.send(await sqlService.query('UPDATE departments SET name = ?, supervisorId = ? WHERE id = ?', [req.body.name, req.body.supervisorId, departmentId]));
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


app.delete('/api/departments', async (req, res) => {

  const departmentId = parseInt(req.body.id);

  if (!isNaN(departmentId)) {

    const departmentFound = await sqlService.query('SELECT * FROM departments WHERE id = ? AND deleteDate IS NULL', [departmentId]);

    if (departmentFound.length > 0) {

      res.send(await sqlService.query(`UPDATE departments SET deleteDate = NOW() WHERE id = ${departmentId}`));
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

      res.send(await sqlService.query(
        `SELECT 
      employees.*,
      departments.name AS departmentName 
      FROM employees 
      INNER JOIN departments ON departments.id = employees.departmentId 
      WHERE employees.id = ? AND employees.deleteDate IS NULL`,
        [employeeId]
      )
      );
    }
  } else {

    res.send(await sqlService.query('SELECT * FROM employees WHERE deleteDate IS NULL'));
  }
}
);


app.post('/api/employees', async (req, res) => {

  const employeeData = req.body;

  const employeeValidationErrors = validateEmployee(employeeData);

  if (employeeValidationErrors.length === 0) {

    res.send(await sqlService.query(
      `INSERT INTO employees 
    (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [employeeData.name, employeeData.role, employeeData.phoneNumber, employeeData.emailAddress, employeeData.department, employeeData.isSupervisor, employeeData.hireDate]
    )
    );

  } else {

    return res.status(500).json({

      errorCount: employeeValidationErrors.length,
      errors: employeeValidationErrors

    });
  }
});


app.put('/api/employees', async (req, res) => {

  const employeeId = parseInt(req.body.id);

  if (!isNaN(employeeId)) {

    const employeeToUpdate = await SqlService.query('SELECT * FROM employees WHERE id = ? AND deleteDate IS NULL', [employeeId]);

    if (employeeToUpdate.length > 0) {

      res.send(await sqlService.query(
        `UPDATE employees 
        SET name = ?, 
        role = ?,
        phoneNumber = ?,
        emailAddress = ?, 
        departmentId = ?, 
        isSupervisor = ?, 
        hireDate = ? 
        WHERE id = ?`,
        [req.body.name, req.body.role, req.body.phoneNumber, req.body.emailAddress, req.body.departmentId, req.body.isSupervisor, req.body.hireDate, employeeId]));
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


app.delete('/api/employees', async (req, res) => {

  const employeeId = req.body.id;

  if (!isNaN(employeeData.id)) {

    const employeeFound = await sqlService.query('SELECT * FROM employees WHERE id = ? AND deleteDate IS NULL', [employeeId]);

    if (employeeFound.length > 0) {

      res.send(await sqlService.query(`UPDATE employees SET deleteDate = NOW() WHERE id = ${employeeId}`));
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


const validateEmployee = (employeeData) => {

  const { name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate } = employeeData;

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

  if (typeof phoneNumber !== 'string') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'phone number',
        error: 'must be supplied as string'
      }
    );
  }

  if (typeof emailAddress !== 'string' || emailAddress.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) === null) {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'email address',
        error: 'must be supplied as string and in format: \x27name@emailprovider.com\x27'
      }
    );
  }

  if (typeof departmentId !== 'number') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'department',
        error: 'must be supplied as number'
      }
    );
  }

  if (typeof isSupervisor !== 'boolean') {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'isSupervisor',
        error: 'must be supplied as boolean'
      }
    );
  }

  if (typeof hireDate !== 'string' || hireDate.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) === null) {

    employeeDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'hire date',
        error: 'must be supplied as string and in format: \x27YY-MM-DDDD\x27'
      }
    );
  }

  return employeeDataErrorFields;
};


const validateDepartment = (departmentData) => {

  const { name, supervisorId } = departmentData;

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

  if (typeof supervisorId !== 'number') {

    departmentDataErrorFields.push(
      {
        errorType: 'Validation',
        field: 'name',
        error: 'must be supplied as number'
      }
    );
  }

  return departmentDataErrorFields;
};


const PORT = process.env.PORT || 35565;

app.listen(PORT, () => {

  console.log(`listening on ${PORT}..`);
});