import express from 'express';
import connection from './db.js'; // Add .js if it's a local module
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import argon2 from 'argon2';

const app = express();

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
app.post('/add-data', async(req, res) => {
    const { user_id, idx, deck_name, data_type, char_type} = req.body; //get the assumed json body
    const query = `INSERT INTO flashcards (user_id, deck_name, idx, data_type, char_type) VALUES (?, ?, ?, ?, ?);`;
    await connection.query(query, [user_id,deck_name, idx,data_type,char_type], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item inserted successfully'});
    });
});
//basic get request
app.post('/get-all-data', async(req, res) => {
    const {user_id} = req.body;
    //format the query
    const query = `
        SELECT *
        FROM flashcards
        WHERE user_id= ?
    `;
    try {
        const [results] = await connection.query(query, [user_id])
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({message: "internal server"})
    }
    
});
//delete path for a deck
app.post('/delete-deck', async(req, res) => {
    const { user_id, deck_name} = req.body; 
    //format the query
    const query = `
        DELETE
        FROM flashcards
        WHERE user_id=? AND deck_name=?
    `;
    try {
        const [results] = await connection.query(query, [user_id, deck_name])
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({message: "internal server"})
    }
});

//delete path for a single card
app.post('/delete-card', async(req, res) => {
    const { user_id, deck_name, idx, data_type, char_type} = req.body; 
    //format the query
    const query = `
        DELETE
        FROM flashcards
        WHERE user_id=? AND deck_name=? AND idx=? AND data_type=? AND char_type=?
    `;
    try {
        const [results] = await connection.query(query, [user_id, deck_name, idx, data_type, char_type])
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({message: "internal server"})
    }
});
//update flashcards name for a single card
app.post('/update-deckname', async(req, res) => {
    const { user_id, deck_name, new_name} = req.body; 
    //format the query
    const query = `
        UPDATE flashcards
        SET deck_name=?
        WHERE user_id=? AND deck_name=?;
    `;
    try {
        const [results] = await connection.query(query, [new_name, user_id,deck_name])
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({message: "internal server"})
    }
});

// Start server on port 2001
const PORT = 2008;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
