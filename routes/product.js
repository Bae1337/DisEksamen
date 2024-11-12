const express = require("express");
const productRoutes = express.Router();
const cookieParser = require("cookie-parser");
productRoutes.use(cookieParser());
const db = require("../db");

let userFavorites = {};

function authenticateUser(req, res, next) {
    const authCookie = req.cookies.userAuth;
  
    if (!authCookie) {
      return res.status(401).send("Ingen authentication cookie.");
    }
  
    const query = "SELECT * FROM customers WHERE username = ?";
    db.get(query, [authCookie], (err, customer) => {
        if (err) {
            return res.status(500).send("Database error.");
        }
        if (!customer) {
            return res.status(401).send("Ugyldig cookie.");
        }

        console.log("User Authenticated");
        next();
    });
}

// Get all products
productRoutes.get('/getProducts', authenticateUser, async (req, res) => {
    try {
        db.all("SELECT productName, imgsrc FROM products", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching products" });
            }
            res.status(200).json(rows);
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

productRoutes.get('/getFavorites/:userName', (req, res) => {
    const userName = req.params.userName;
    const favorites = userFavorites[userName] || [];

    res.status(200).json(favorites);
});

productRoutes.post('/toggleFavorite', authenticateUser, (req, res) => {
    const { username, productName } = req.body;
    
    if (!userFavorites[username]) {
        userFavorites[username] = [];
    }

    const favoriteIndex = userFavorites[username].indexOf(productName);
    
    if (favoriteIndex > -1) {
        userFavorites[username].splice(favoriteIndex, 1); 
    } else {
        userFavorites[username].push(productName); 
    }

    res.status(200).json({ favorites: userFavorites[username] });
});




module.exports = productRoutes