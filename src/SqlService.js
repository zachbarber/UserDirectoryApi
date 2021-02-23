import mysql from 'mysql';

export default class SqlService {
  constructor(config) {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employeedirectory'
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          throw new Error(`Error in query: ${sql}`);
        }

        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) {
          throw new Error('Error in closing SQL connection');
        }
      });
    });
  }
};