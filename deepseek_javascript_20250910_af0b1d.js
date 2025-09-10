const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('ggshop.db');

// API endpoints
app.get('/api/user/:id', (req, res) => {
    db.get('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products WHERE is_active = TRUE', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/listings', (req, res) => {
    const { seller_id, title, description, price, platform } = req.body;
    db.run(
        'INSERT INTO listings (seller_id, title, description, price, platform) VALUES (?, ?, ?, ?, ?)',
        [seller_id, title, description, price, platform],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});