CREATE DATABASE IF NOT EXISTS `catalogo`;
USE `catalogo`;
CREATE TABLE IF NOT EXISTS Categoria (
    Codigo INT PRIMARY KEY AUTO_INCREMENT,  
    Nome VARCHAR(100) NOT NULL              
);

INSERT INTO Categoria (Nome) VALUES
('Casa'),
('Fashion');

CREATE TABLE IF NOT EXISTS Produto (
    Codigo INT PRIMARY KEY AUTO_INCREMENT,  
    Nome VARCHAR(100) NOT NULL,           
    Preco DECIMAL(10, 2) NOT NULL,         
    CategoriaID INT,                  
    FOREIGN KEY (CategoriaID) REFERENCES Categoria(Codigo) ON DELETE SET NULL
);

INSERT INTO Produto (Nome, Preco, CategoriaID) VALUES
('Air-Fryer', 100.00, 1),
('Tenis', 50.00, 2),
('Camisa', 20.00, 2);
