CREATE DATABASE employeeDirectory;
USE employeeDirectory;

CREATE TABLE employees (id INT NOT NULL AUTO_INCREMENT, name CHAR(50) NOT NULL, role CHAR(50) NOT NULL, company CHAR(50) NOT NULL, created_at datetime NOT NULL, deleted_at DATE, PRIMARY KEY (id));
CREATE TABLE companies (id INT NOT NULL AUTO_INCREMENT, name CHAR(50) NOT NULL, industry CHAR(50) NOT NULL, annual_revenue BIGINT NOT NULL, created_at datetime NOT NULL, deleted_at DATE, PRIMARY KEY (id));

INSERT INTO employees (name, role, company, created_at)
VALUES ('testName1', 'testRole1', 'testCompany1', NOW());

INSERT INTO employees (name, role, company, created_at)
VALUES ('testName2', 'testRole2', 'testCompany2', NOW());

INSERT INTO employees (name, role, company, created_at)
VALUES ('testName3', 'testRole3', 'testCompany3', NOW());


INSERT INTO companies (name, industry, annual_revenue, created_at)
VALUES ('testName1', 'testIndustry1', 100, NOW());

INSERT INTO companies (name, industry, annual_revenue, created_at)
VALUES ('testName2', 'testIndustry2', 100, NOW());

INSERT INTO companies (name, industry, annual_revenue, created_at)
VALUES ('testName3', 'testIndustry3', 100, NOW());