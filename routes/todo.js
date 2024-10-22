const express = require('express');
const router = express.Router();

let todos = [
    {
    id: 1, task:'Belajar node.js', completed:false
    },
    {
    id: 2, task:'membuat API', completed:false
    }
];

// endpoint untuk mendapatkan data Todos
router.get('/', (req, res) => {res.json(todos); });

module.exports = router;