const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const versionApi = '/api/v1';

// Data
const levels = require('./data/levels.json');

// API Request
app.get(`${versionApi}/edt/:level/:sublevel/:week/:year`, (req, res) => {
    let level = req.params.level;
    level = level.toUpperCase();
    let sublevel = req.params.sublevel;
    sublevel = sublevel.toUpperCase();
    const week = req.params.week;
    const year = req.params.year;
    
    const student = levels[level][sublevel]['code'];
    const name = levels[level][sublevel]['name'];

    res.json({
        level, level,
        sublevel: name,
        week: week,
        year: year,
        url: `https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${student}&current_week=${week}&lar=1920&hau=1080`
    });
});

// Docs
app.get(`${versionApi}/docs`, function (req, res) {
    res.sendFile(path.join(__dirname + '/docs.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});