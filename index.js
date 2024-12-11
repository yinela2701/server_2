const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post("/create", (req, res) => {
    const { nombre, director, descripcion, anio } = req.body;

    db.query('INSERT INTO peliculas (nombre, director, descripcion, anio) VALUES (?,?,?,?)', [nombre, director, descripcion, anio], 
    (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.send(result);
    });
});

app.get("/peliculas", (req, res) => {
    db.query('SELECT * FROM peliculas', (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.send(result);
    });
});

app.put("/update", (req, res) => {
    const { id, nombre, director, descripcion, anio } = req.body;

    db.query('UPDATE peliculas SET nombre=?, director=?, descripcion=?, anio=? WHERE id=?', [nombre, director, descripcion, anio, id], 
    (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.send(result);
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM peliculas WHERE id=?', id, 
    (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.send(result);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});