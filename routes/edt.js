const express = require( 'express' );
const router = express.Router();
// const fetch = require( 'node-fetch' );

// API Request -- Levels
router.get( '/', ( req, res ) => {

	const levels = require( '../data/levels.json' );

	res.json( levels );
} );

// API Request -- Sublevels by Level
router.get( '/:level', ( req, res ) => {

	const levels = require( '../data/levels.json' );

	let { params: { level } } = req;

	level = level.toUpperCase();

	res.json( levels[level] );

} );

// API Request -- Details from Sublevel by Level / Sublevel
router.get( '/:level/:sublevel', ( req, res ) => {

	const levels = require( '../data/levels.json' );

	let { params: { level, sublevel } } = req;

	level = level.toUpperCase();
	sublevel = sublevel.toUpperCase();

	res.json( levels[level][sublevel] );

} );

// API Request -- Edt by Level / Sublevel / Week / Year
router.get( '/:level/:sublevel/:week/:year', ( req, res ) => {

	const levels = require( '../data/levels.json' );

	const { params } = req;

	let { level, sublevel } = params;
	const { week, year } = params;

	level = level.toUpperCase();
	sublevel = sublevel.toUpperCase();

	const { code: student, name } = levels[level][sublevel];

	const url = 'https://edt.univ-evry.fr/vue_etudiant_horizontale.php';
	const query = `current_year=${year}&current_student=${student}&current_week=${week}&lar=1920&hau=1080`;

	res.json( {
		level: level,
		sublevel: name,
		week: week,
		year: year,
		url: `${url}?${query}`
	} );

	// fetch( `${url}?${query}`, {
	// 	compress: true,
	// 	keepalive: true,
	// 	method: 'GET'
	// } )
	// 	.then( response => response.buffer() )
	// 	.then( buffer => {
	// 		res.json( {
	// 			level: level,
	// 			sublevel: name,
	// 			week: week,
	// 			year: year,
	// 			data: `data:image/png;base64,${buffer.toString( 'base64' )}`
	// 		} );
	// 	} );
} );

function getWeekNumber( date = new Date() ) {
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

// API Request -- Edt by Level / Sublevel / Day / Month / Year
router.get( '/:level/:sublevel/:day/:month/:year', ( req, res ) => {

	const levels = require( '../data/levels.json' );

	const { params } = req;

	let { level, sublevel } = params;
	const { day, month, year } = params;

	level = level.toUpperCase();
	sublevel = sublevel.toUpperCase();

	const week = getWeekNumber( new Date( year, month - 1, day ) );

	const { code: student, name } = levels[level][sublevel];

	const url = 'https://edt.univ-evry.fr/vue_etudiant_horizontale.php';
	const query = `current_year=${year}&current_student=${student}&current_week=${week}&lar=1920&hau=1080`;

	res.json( {
		level: level,
		sublevel: name,
		week: week,
		year: year,
		url: `${url}?${query}`
	} );

	// fetch( `${url}?${query}`, {
	// 	compress: true,
	// 	keepalive: true,
	// 	method: 'GET'
	// } )
	// 	.then( response => response.buffer() )
	// 	.then( buffer => {
	// 		res.json( {
	// 			level: level,
	// 			sublevel: name,
	// 			week: week,
	// 			year: year,
	// 			data: `data:image/png;base64,${buffer.toString( 'base64' )}`
	// 		} );
	// 	} );
} );

module.exports = router;