DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(4) NOT NULL,
	product_name VARCHAR(100) NOT NULL,
    sub_department_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (item_id,  product_name,  sub_department_name, department_name, price, stock_quantity) 
VALUES (001, "football", "sporting equipment", "sports", 19.99, 10),
	   (002, "yEaSt", "baking", "food", 999.99, 18),
	   (003, "The Tiger King VHS", "movies and shows", "entertainment", 29.99, 19),
	   (004, "bamazon hand sanitizer", "first aid", "health", 9.99, 8),
	   (005, "bamazon head wrap", "first aid", "health", 29.99, 14),
	   (006, "shin guards", "sporting equipment", "sports", 24.99, 19),
	   (007, "pureee hand sanitizer", "first aid", "health", 11.99, 12),
	   (008, "yankees no brim hat", "sporting apparal", "sports", 69.99, 10),
	   (009, "baseball cleats", "sporting equipment", "sports", 19.99, 10),
	   (010, "barbell", "gym equipment", "sports", 319.99, 1)