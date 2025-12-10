const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mental_health.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
        process.exit(1);
    }
});

db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        throw err;
    }
    if (rows.length === 0) {
        console.log("No users found in the database.");
    } else {
        console.table(rows);
    }
    db.close();
});
