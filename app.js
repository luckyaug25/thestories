// app.js
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Database Connection - Replace these with your Neon database credentials
const pool = new Pool({
    host: 'ep-shiny-flower-a5rb6lvr.us-east-2.aws.neon.tech',
    user: 'neondb_owner',
    password: 'Ej1Itmne9KMf',
    database: 'neondb',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Ensures SSL is used
    },
});

// Route to display all stories
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stories ORDER BY created_at DESC');
        res.render('home', { stories: result.rows });
    } catch (err) {
        console.error(err);
        res.send('Error retrieving stories.');
    }
});

// Route to view a full story
app.get('/story/:id', async (req, res) => {
    const storyId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM stories WHERE id = $1', [storyId]);
        res.render('story', { story: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.send('Error retrieving the story.');
    }
});

// Route to display the upload form
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Route to handle uploading a new story
app.post('/upload', async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query('INSERT INTO stories (title, content) VALUES ($1, $2)', [title, content]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error uploading the story.');
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
