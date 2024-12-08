const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Deepak@2002',
    database: 'story_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Routes

// Home Page - Display Stories
app.get('/', (req, res) => {
    const query = 'SELECT * FROM stories ORDER BY updated_at DESC'; // Sort by updated_at to get the latest updated story first
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('home', { stories: results });
    });
});

// Story Page - Read Full Story
app.get('/story/:id', (req, res) => {
    const storyId = req.params.id;
    const query = 'SELECT * FROM stories WHERE id = ?';
    db.query(query, [storyId], (err, result) => {
        if (err) throw err;
        res.render('story', { story: result[0] });
    });
});

// Upload Page - Form to Add Story
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Post New Story
app.post('/upload', (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO stories (title, content) VALUES (?, ?)';
    db.query(query, [title, content], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Edit Page - Form to Edit Existing Story
app.get('/story/edit/:id', (req, res) => {
    const storyId = req.params.id;
    const query = 'SELECT * FROM stories WHERE id = ?';
    db.query(query, [storyId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('edit', { story: result[0] });
        } else {
            res.status(404).send('Story not found');
        }
    });
});

// Update Story
app.post('/story/edit/:id', (req, res) => {
    const storyId = req.params.id;
    const { title, content } = req.body;
    const query = 'UPDATE stories SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, storyId], err => {
        if (err) throw err;
        res.redirect('/'); // After update, redirect to the home page to see the updated story at the top
    });
});



// Start the Server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
