CREATE DATABASE employeeDirectory;
USE employeeDirectory;

CREATE TABLE employees (id INT NOT NULL AUTO_INCREMENT, name CHAR(50) NOT NULL, role CHAR(50) NOT NULL, department CHAR(50) NOT NULL, is_supervisor boolean DEFAULT false, supervisor CHAR(50), created_at datetime NOT NULL, deleted_at DATE, PRIMARY KEY (id));
CREATE TABLE departments (id INT NOT NULL AUTO_INCREMENT, name CHAR(50) NOT NULL, supervisor CHAR(50) NOT NULL, created_at datetime NOT NULL, deleted_at DATE, PRIMARY KEY (id));

INSERT INTO employees (name, role, department, supervisor, created_at)
VALUES ('John Smith', 'Salesperson', 'Sales', 'Michael Bolton', NOW());

INSERT INTO employees (name, role, department, supervisor, created_at)
VALUES ('Mary Barber', 'Salesperson', 'Sales', 'Michael Bolton', NOW());

INSERT INTO employees (name, role, department, is_supervisor, supervisor, created_at)
VALUES ('Michael Bolton', 'Manager', 'Sales', TRUE, 'Jerry Brown', NOW());

INSERT INTO employees (name, role, department, is_supervisor, supervisor, created_at)
VALUES ('Jerry Brown', 'Director', 'Operations', TRUE, 'Casey Chirite', NOW());

INSERT INTO employees (name, role, department, is_supervisor, created_at)
VALUES ('Casey Chirite', 'CEO', 'Operations', TRUE, NOW());


INSERT INTO departments (name, supervisor, created_at)
VALUES ('Sales', 'Michael Bolton', NOW());

INSERT INTO departments (name, supervisor, created_at)
VALUES ('Operations', 'Casey Chirite', NOW());

