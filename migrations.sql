CREATE DATABASE employeeDirectory
USE employeeDirectory
CREATE TABLE blogs (id INT NOT NULL AUTO_INCREMENT, name CHAR(50) NOT NULL, role CHAR(50) NOT NULL, company CHAR(50) NOT NULL, created_at DATE NOT NULL, deleted_at DATE, PRIMARY KEY (id))