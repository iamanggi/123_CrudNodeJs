const express = require('express');
const todoRoutes = require('./routes/tododb.js')
const app = express();

//untuk mengimport dotenv 
require('dotenv').config();
const port = process.env.PORT;

// pertemuan ke 7
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');


const expressLayout = require('express-ejs-layouts')
const db = require('./database/db');

app.use(expressLayout);
app.use(express.json());
app.use('/todos', todoRoutes);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);

app.get('/',isAuthenticated, (req,res) => {
    res.render('index',{
        layout: 'layouts/main_layouts'
    });
});


app.get('/contact',isAuthenticated, (req,res) => {
    res.render('contact', {
        layout: 'layouts/main_layouts'
    });
});

app.get('/todo-view',isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main_layouts',
            todos: todos
        });
    });
});

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}/`);
});