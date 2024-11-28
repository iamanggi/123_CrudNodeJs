const express = require('express');
const router = express.Router(); // Membuat router baru menggunakan Express
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    // Query untuk mengambil semua data dari tabel 'todos'
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error'); // Mengembalikan status 500 jika ada error
        res.json(results); // Mengembalikan hasil query dalam format JSON
    });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    // Query untuk mengambil data berdasarkan ID tertentu
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan'); // Status 404 jika tidak ada data ditemukan
        res.json(results[0]); // Mengembalikan hasil pertama dalam format JSON
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { task } = req.body; // Mengambil data 'task' dari body request
    if (!task || task.trim() === '') {
        return res.status(400).send('Tugas tidak boleh kosong'); // Validasi jika tugas kosong
    }

    // Query untuk menyisipkan data baru ke tabel 'todos'
    db.query('INSERT INTO todos (task) VALUES (?)', [task.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error'); // Mengembalikan status 500 jika ada error
        // Menyiapkan data tugas baru untuk dikembalikan
        const newTodo = { id: results.insertId, task: task.trim(), completed: false }; 
        res.status(201).json(newTodo); // Mengembalikan data tugas baru dengan status 201 (Created)
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { task, completed } = req.body; // Mengambil data 'task' dan 'completed' dari body request

    // Query untuk memperbarui data berdasarkan ID
    db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error'); // Mengembalikan status 500 jika ada error
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan'); // Status 404 jika tidak ada data yang diubah
        res.json({ id: req.params.id, task, completed }); // Mengembalikan data yang diperbarui
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    // Query untuk menghapus data berdasarkan ID
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error'); // Mengembalikan status 500 jika ada error
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan'); // Status 404 jika tidak ada data yang dihapus
        res.status(204).send(); // Status 204 (No Content) untuk mengindikasikan penghapusan berhasil tanpa respon tambahan
    });
});

module.exports = router; // Mengekspor router agar bisa digunakan di file utama aplikasi