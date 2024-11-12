DROP TABLE IF EXISTS customers;
CREATE TABLE customers ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,               
    email TEXT NOT NULL UNIQUE,           
    password TEXT NOT NULL             
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    productName TEXT NOT NULL,            
    imgsrc TEXT
);
