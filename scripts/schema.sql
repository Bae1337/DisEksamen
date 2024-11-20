CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,                
    email TEXT NOT NULL UNIQUE,           
    password TEXT NOT NULL             
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    productName TEXT NOT NULL,            
    imgsrc TEXT
);