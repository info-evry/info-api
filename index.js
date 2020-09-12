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

// API Request -- Levels
app.get( `${versionApi}/edt`, ( req, res ) =>
{
    res.json( {
        levels: levels
    } );
} );

// API Request -- Sublevels by Level
app.get( `${versionApi}/edt/:level`, ( req, res ) =>
{
    let { params: { level } } = req;

    level = level.toUpperCase();

    res.json( {
        [level]: levels[level]
    } );

} );

// API Request -- Details from Sublevel by Level / Sublevel
app.get( `${versionApi}/edt/:level/:sublevel`, ( req, res ) =>
{
    let { params: { level, sublevel } } = req;

    level = level.toUpperCase();
    sublevel = sublevel.toUpperCase();

    res.json( {
        [level]: {
            [sublevel]: levels[level][sublevel]
        }
    } );
    
} );

// API Request -- Edt by Level / Sublevel / Week / Year
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


function getWeekNumber( date = new Date() )
{
    const t = new Date( date.valueOf() );
    const d = ( date.getDay() + 6 ) % 7;
    t.setDate( t.getDate() - d + 3 );
    const f = t.valueOf();
    t.setMonth( 0, 1 );
    if ( t.getDay() !== 4 ) {
        t.setMonth( 0, 1 + ( 4 - t.getDay() + 7 ) % 7 );
    }
    return 1 + Math.ceil( ( f - t ) / 604800000 );
}


// API Request -- Edt by Level / Sublevel / Week / Year
app.get( `${versionApi}/edt/:level/:sublevel/:day/:month/:year`, ( req, res ) =>
{

    const { params } = req;

    let { level, sublevel } = params;
    const { day, month, year } = params;

    level = level.toUpperCase();
    sublevel = sublevel.toUpperCase();

    const week = getWeekNumber( new Date( year, month, day ) );

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