DROP DATABASE IF EXISTS db_eksamen_Adam_Maltsagov;

CREATE DATABASE IF NOT EXISTS db_eksamen_Adam_Maltsagov;

USE db_eksamen_Adam_Maltsagov;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rolename VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roleId INT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS orderStatuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerName VARCHAR(50) NOT NULL,
  totalAmount DECIMAL(10, 2) NOT NULL,
  orderStatusId INT NOT NULL,
  FOREIGN KEY (orderStatusId) REFERENCES orderStatuses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO roles (rolename) VALUES 
("admin"), 
("employee");

INSERT INTO orderStatuses (status) VALUES 
("pending"), 
("completed");

INSERT INTO users (username, password, roleId) VALUES
("admin", "$2a$10$sKAPGWnVBl4NrPO83mpq0e88cp.KATJ53RcnCBGCPtFF88mwp4vti", 1),
("employee", "$2a$10$57W9QY8wrxNl5awkBPWhEebLQ.Bo7Kp5OoJaOhzUd/IRLv0lPqj5e", 2);

INSERT INTO products (name, description, price, stock) VALUES
('lilly', "vakre blomster", 70.80, 100),
('lilly', "vakre blomster", 70.80, 100),
('lilly', "vakre blomster", 70.80, 100);

INSERT INTO orders (customerName, totalAmount, orderStatusId) VALUES
('Test Testson', "708", 1),
('Test Testson', "708", 2),
('Test Testson', "708", 1);

INSERT INTO orderItems (orderId, productId, quantity) VALUES
(1, 1, 10),
(2, 1, 10),
(3, 1, 10);





/* 
Get-Content .\setup.sql | mysql -u student -p"K2y5L9d8T1"
 */