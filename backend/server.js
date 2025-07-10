// server.js
const express = require('express');
const db = require('./db');  // Import the database connection
const cors = require('cors'); ///allow corss origin
const app = express();
const rateLimit = require('express-rate-limit');
const argon2 = require('argon2');

app.use(express.json());
app.set('trust proxy', 1); // ✅ Trust only the first proxy 

// Apply rate limiting middleware. Limits per client. Basic DDOS protection
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later."
}); 
app.use(limiter);


app.use(cors());  //enlabed cors

//basic post request to send data for certain condition
app.post('/add-data', (req, res) => {
    const { user_id, idx, data_type, char_type} = req.body; //get the assumed json body
    const query = `INSERT INTO flashcards (user_id, deck_id, idx, data_type, char_type) VALUES (?, ?, ?, ?);`;
    db.query(query, [`${user_id}`,`${idx}`,`${data_type}`,`${char_type}`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item inserted successfully'});
    });
});
//basic get request
app.get('/get-all-data', (req, res) => {
    const {user_id} = req.body;
    //format the query
    const query = `
        SELECT *
        FROM flashcards
        WHERE user_id=${user_id}
    `;
    db.query(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        } 
        res.json(results);
    });
});
//delete path for a deck
app.get('/delete-deck', (req, res) => {
    const { user_id, deck_id} = req.body; 
    //format the query
    const query = `
        DELETE
        FROM flashcards
        WHERE user_id=${user_id} AND deck_id=${deck_id}
    `;
    db.query(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        } 
        res.json(results);
    });
});

//delete path for a single card
app.get('/delete-card', (req, res) => {
    const { user_id, deck_id, idx, data_type, char_type} = req.body; 
    //format the query
    const query = `
        DELETE
        FROM flashcards
        WHERE user_id=${user_id} AND deck_id=${deck_id} AND idx=${idx} AND data_type=${data_type} AND char_type=${char_type}
    `;
    db.query(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        } 
        res.json(results);
    });
});



// Start server on port 2001
const PORT = 2008;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
