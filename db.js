const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('db/sqlite.db');

const runSQLScript = (filename) => {
    const script = fs.readFileSync(filename, 'utf8');
    db.exec(script, (err) => {
        if (err) {
            console.log("erroer exec script: ", err);
        } else {
            console.log(`SQL script ${filename} run successfully`);
        }
    });
};

db.serialize(() => {
    // Kør schema.sql for at oprette tabeller
    runSQLScript('scripts/schema.sql');

    // Tjek, om der allerede er data i tabellen 'products'
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error("Error checking products table:", err);
        } else if (row.count === 0) {
            // Kun kør dump.sql, hvis tabellen er tom
            console.log("Products table is empty. Running dump.sql...");
            runSQLScript('scripts/dump.sql');
        } else {
            console.log("Products table already has data. Skipping dump.sql.");
        }
    });
});


module.exports = db;