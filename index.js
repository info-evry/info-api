const express = require( 'express' );
const compression = require( 'compression' );
const helmet = require( 'helmet' );
const path = require( 'path' );

// Config
const port = 3000;
const versionApi = '/api/v1';

// Instanciate
const app = express();

app.use( helmet() );
app.use( compression( { level: 9 } ) );

// Routes
const edtRouter = require('./routes/edt');
const contactsRouter = require('./routes/contacts');

app.use(`${versionApi}/edt`, edtRouter);
app.use(`${versionApi}/contacts`, contactsRouter);

// Docs
app.get( `/docs`, function ( req, res ) {
	res.sendFile( path.join( __dirname + '/docs.html' ) );
} );

// Error page not found
app.use( ( req, res, next ) => {
	res.status( 404 );
	res.json( { error: '404' } );
} );

app.listen( port, () => {
	console.log( `Server listening at http://localhost:${port}` );
} );
