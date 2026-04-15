const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Define the location of our database file
// 'todos.db' is the single file where everything will be saved.
const dbPath = path.resolve(__dirname, 'todos.db');

// 2. Connect to the database
// If 'todos.db' doesn't exist, SQLite will automatically create it for us.
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// 3. Create our Data Table
// Think of a database as an Excel workbook, and tables as the sheets inside it.
// We write raw SQL commands inside db.run() to create this table.
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Todos table is ready!");
        }
    });
});

// 4. Export this configured database object so other files (our API) can use it
module.exports = db;
