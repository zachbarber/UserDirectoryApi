CREATE TABLE departments (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, createDate datetime NOT NULL, deleteDate datetime, PRIMARY KEY (id));
CREATE TABLE employees (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, role VARCHAR(50) NOT NULL, phoneNumber VARCHAR(20), emailAddress VARCHAR(50), departmentId INT, isSupervisor boolean DEFAULT false, hireDate DATE NOT NULL, createDate datetime NOT NULL, deleteDate datetime, PRIMARY KEY (id));

INSERT INTO departments (name, createDate)
VALUES ('Operations', NOW());

INSERT INTO departments (name, createDate)
VALUES ('Sales', NOW());

INSERT INTO departments (name, createDate)
VALUES ('Marketing', NOW());


INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('Casey Chirite', 'CEO', '555-555-5555', 'testemail@email.com', 1, TRUE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('Michael Bolton', 'Manager', '555-555-5555', 'testemail@email.com', 2, TRUE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('Peter Gibbon', 'Manager', '555-555-5555', 'testemail@email.com', 3, TRUE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('John Smith', 'Salesperson', '555-555-5555', 'testemail@email.com', 2, FALSE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('Mary Barber', 'Salesperson', '555-555-5555', 'testemail@email.com', 2, FALSE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('Jerry Brown', 'Project Manager', '555-555-5555', 'testemail@email.com', 2, FALSE, '2021-03-20', NOW());

INSERT INTO employees (name, role, phoneNumber, emailAddress, departmentId, isSupervisor, hireDate, createDate)
VALUES ('John Bilunes', 'Marketer', '555-555-5555', 'testemail@email.com', 3, FALSE, '2021-03-20', NOW());

ALTER TABLE employees
ADD FOREIGN KEY (departmentId) REFERENCES departments(id);