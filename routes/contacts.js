const { Worker } = require( 'worker_threads' );
const express = require( 'express' );
const router = express.Router();

// API Request -- Contact
router.get( '/', ( req, res ) => {

	const contacts = require( '../data/contacts.json' );

	res.json( contacts );
} );


const getContact = async ( ...args ) => new Promise( ( resolve, reject ) => {
	console.log( args );
	const worker = new Worker( './workers/contact-walker.js', { workerData: args } );
	worker.on( 'message', resolve );
	worker.on( 'message', reject );
	worker.on( 'exit', code => {
		if ( code !== 0 ) {
			reject( new Error( `Worker stopped with exit code ${code}` ) );
		}
	} );
} );

router.get( '/:data', async ( req, res ) => {

	const { params } = req;

	const { data } = params;

	const parsedData = (decodeURIComponent( data )).split( /,/gu ).filter( e => e.length > 0);

	res.json( ( await getContact( ...parsedData ) ) );
} );

module.exports = router;