const express = require('express');
const cors = require('cors');

// Import our database configuration from the file we just created!
const db = require('./database');

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
// CORS allows our frontend to communicate with this backend without browser security throwing errors.
app.use(cors());
// Express.json() tells the server to read any incoming data formatted as JSON.
app.use(express.json());

// --- API ROUTES ---
// Think of routes like different phone numbers on a switchboard. 
// When the frontend "calls" a specific route, the server performs a specific action.

// 1. GET (Read Data): Responds with all the todos from our database table
app.get('/api/todos', (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ todos: rows });
    });
});

// 2. POST (Create Data): Receives a new task from the user, saves it to the database
app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    
    // We check if the task is empty
    if (!task) {
        return res.status(400).json({ error: "Task cannot be empty" });
    }

    // We use a "?" to securely insert the task into the database. 
    db.run("INSERT INTO todos (task) VALUES (?)", [task], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Respond with the newly created task including its new automatically generated ID
        res.json({ id: this.lastID, task, completed: 0 });
    });
});

// 3. DELETE (Remove Data): the ":id" is a variable. Based on the ID sent, we delete that row from the database.
app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Deleted successfully" });
    });
});

// --- START THE SERVER ---
// We tell our Express app to constantly listen for incoming requests on PORT 3000
app.listen(PORT, () => {
    console.log(`Server is running! API is now listening at http://localhost:${PORT}`);
});
