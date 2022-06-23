const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.json(`GET route`));
app.post('/', (req, res) => res.json(`POST route`));

app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`);
});  