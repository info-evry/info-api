const compression = require( 'compression' );
const express = require( 'express' );
const app = express();
const path = require( 'path' );
const fetch = require( 'node-fetch' );
const port = 3000;

const versionApi = '/api/v1';

// Data
const levels = require( './data/levels.json' );

app.use( compression( { level: 1 } ) );

// API Request
app.get( `${versionApi}/edt/:level/:sublevel/:week/:year`, ( req, res ) =>
{

    const { params } = req;

    let { level, sublevel } = params;
    const { week, year } = params;

    level = level.toUpperCase();
    sublevel = sublevel.toUpperCase();

    const { code: student, name } = levels[level][sublevel];

    const url = `https://edt.univ-evry.fr/vue_etudiant_horizontale.php`;
    const query = `current_year=${year}&current_student=${student}&current_week=${week}&lar=1920&hau=1080`;

    fetch( `${url}?${query}`, {
        compress: true,
        keepalive: true,
        method: 'GET'
    } )
        .then( response => response.buffer() )
        .then( buffer =>
        {
            res.json( {
                level: level,
                sublevel: name,
                week: week,
                year: year,
                data: `data:image/png;base64,${buffer.toString('base64')}`
            } );
        } );


} );

// Docs
app.get( `${versionApi}/docs`, function ( req, res )
{
    res.sendFile( path.join( __dirname + '/docs.html' ) );
} );

app.listen( port, () =>
{
    console.log( `Server listening at http://localhost:${port}` );
} );