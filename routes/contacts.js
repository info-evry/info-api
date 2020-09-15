const express = require( 'express' );
const router = express.Router();

// API Request -- Contact
router.get( `/`, ( req, res ) => {

	const contacts = require( '../data/contacts.json' );

	res.json( {
		contacts: contacts
	} );
} );

module.exports = router;