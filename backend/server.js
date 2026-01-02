import sql from 'mssql'
import express from "express";
import {poolPromise} from "./db.js"; // your exported pool
import cors from "cors";
import rateLimit from "express-rate-limit";
import argon2 from "argon2";

const app = express();
app.use(express.json());
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20,
  message: "Too many requests, please try again later."
});
app.use(limiter);

app.use(cors());

// --- ADD DATA ---
app.post("/add-data", async (req, res) => {
  const { user_id, idx, deck_name, data_type, char_type } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("user_id", sql.NVarChar, user_id)
      .input("deck_name", sql.NVarChar, deck_name)
      .input("idx", sql.Int, idx)
      .input("data_type", sql.NVarChar, data_type)
      .input("char_type", sql.NVarChar, char_type)
      .query(`
        INSERT INTO flashcards (user_id, deck_name, idx, data_type, char_type)
        VALUES (@user_id, @deck_name, @idx, @data_type, @char_type)
      `);

    res.status(200).json({ message: "Item inserted successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET ALL DATA ---
app.post("/get-all-data", async (req, res) => {
  const { user_id } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("user_id", sql.NVarChar, user_id)
      .query("SELECT * FROM flashcards WHERE user_id = @user_id");

    const flashcards = result.recordset || [];
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- DELETE DECK ---
app.post("/delete-deck", async (req, res) => {
  const { user_id, deck_name } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("user_id", sql.NVarChar, user_id)
      .input("deck_name", sql.NVarChar, deck_name)
      .query(`
        DELETE FROM flashcards
        WHERE user_id = @user_id AND deck_name = @deck_name
      `);

    res.status(200).json({ rowsAffected: result.rowsAffected[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- DELETE CARD ---
app.post("/delete-card", async (req, res) => {
  const { user_id, deck_name, idx, data_type, char_type } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("user_id", sql.NVarChar, user_id)
      .input("deck_name", sql.NVarChar, deck_name)
      .input("idx", sql.Int, idx)
      .input("data_type", sql.NVarChar, data_type)
      .input("char_type", sql.NVarChar, char_type)
      .query(`
        DELETE FROM flashcards
        WHERE user_id = @user_id AND deck_name = @deck_name
          AND idx = @idx AND data_type = @data_type AND char_type = @char_type
      `);

    res.status(200).json({ rowsAffected: result.rowsAffected[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- UPDATE DECK NAME ---
app.post("/update-deckname", async (req, res) => {
  const { user_id, deck_name, new_name } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("user_id", sql.NVarChar, user_id)
      .input("deck_name", sql.NVarChar, deck_name)
      .input("new_name", sql.NVarChar, new_name)
      .query(`
        UPDATE flashcards
        SET deck_name = @new_name
        WHERE user_id = @user_id AND deck_name = @deck_name
      `);

    res.status(200).json({ rowsAffected: result.rowsAffected[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- START SERVER ---
const PORT = 2008;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});