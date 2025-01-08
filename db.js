// Importér nødvendige moduler
const sqlite3 = require('sqlite3').verbose(); // SQLite3-database-driver
const fs = require('fs'); // Modul til filsystem-operationer
const db = new sqlite3.Database('db/sqlite.db'); // Opret forbindelse til SQLite-databasen

// Funktion til at køre et SQL-script fra en fil
const runSQLScript = (filename) => {
    const script = fs.readFileSync(filename, 'utf8'); // Læs SQL-scriptet fra filen
    db.exec(script, (err) => { // Udfør SQL-scriptet på databasen
        if (err) {
            console.log("Fejl ved udførelse af script: ", err); // Log fejl, hvis der opstår en
        } else {
            console.log(`SQL-script ${filename} blev kørt succesfuldt`); // Bekræft succesfuld udførelse
        }
    });
};

// Brug `serialize` til at sikre, at databaseoperationer udføres sekventielt
db.serialize(() => {
    // Kør schema.sql for at oprette nødvendige tabeller
    runSQLScript('scripts/schema.sql');

    // Tjek, om tabellen 'products' allerede indeholder data
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error("Fejl ved tjek af 'products'-tabellen:", err); // Log fejl, hvis forespørgslen fejler
        } else if (row.count === 0) {
            // Hvis 'products'-tabellen er tom, kør dump.sql for at indsætte data
            console.log("Products-tabellen er tom. Kører dump.sql...");
            runSQLScript('scripts/dump.sql');
        } else {
            // Hvis 'products'-tabellen allerede indeholder data, spring over dump.sql
            console.log("Products-tabellen indeholder allerede data. Springer over dump.sql.");
        }
    });
});

// Eksportér databaseobjektet, så det kan bruges i andre filer
module.exports = db;