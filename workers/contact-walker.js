const { workerData, parentPort } = require( 'worker_threads' );

let __contacts__;

function flat( depth, array ) {
	const targetDepth = depth === Infinity ? Infinity : depth - 1;
	const targetArray = [];
	for ( let i = 0, l = array.length; i < l; i += 1 ) {
		if ( typeof array[i] !== 'undefined' || l >= i + 1 ) {
			if ( array[i] instanceof Array && depth !== 0 ) {
				targetArray.push( ...flat( targetDepth, array[i] ) );
			} else {
				targetArray.push( array[i] );
			}
		}
	}
	return targetArray;
}

function includes( target, array ) {
	for ( const item of array ) {
		if ( item.includes( target ) ) {
			return true;
		}
	}
}


async function test( args, index, prop ) {
	let bool = false;
	let occu = 0;
	let contact = __contacts__[index];
	let contactProp = contact[prop];
	const isFilled = contactProp.length > 0;
	if ( isFilled ) {
		if ( contactProp instanceof Array ) {
			contactProp = flat( Infinity, contactProp );
			contactProp = contactProp.map( s => typeof s === 'string' ? s.toLowerCase().split( /\s/gu ) : s );
		} else {
			contactProp = contactProp.toLowerCase().split( /\s/gu );
		}
		if ( contactProp.length > 0 ) {
			for ( const arg of args ) {
				if ( includes( arg, contactProp ) ) {
					bool = true;
					occu += 1;
				}
			}
		}
	}

	return { bool: bool, occu: occu, index: index };

}

async function testContact( args, index ) {
	const responses = await Promise.all( [
		test( args, index, 'firstName' ),
		test( args, index, 'lastName' ),
		test( args, index, 'courses' ),
		test( args, index, 'responsibilities' )
	] );

	return responses.reduce( ( acc, { bool, occu, index } ) => {
		const { bool: b, occu: o } = acc;
		return { bool: b || bool, occu: o + occu, index: index };
	}, { bool: false, occu: 0, index: index } );

}


async function search( args ) {
	if ( args instanceof Array && args.length > 0 ) {
		__contacts__ = require( '../data/contacts.json' );

		const testerArgs = args.map( s => typeof s === 'string' ? s.toLowerCase() : s );

		let find = ( await Promise.all( __contacts__.map( ( _, index ) => ( async () => await testContact( testerArgs, index ) )() ) ) )
			.filter( ( { bool } ) => bool )
			.sort( ( { occu: a }, { occu: b } ) => b - a );

		if ( find.some( ( { occu } ) => occu === testerArgs.length ) ) {
			find = find.filter( ( { occu } ) => occu === testerArgs.length );
		}

		parentPort.postMessage( find.map( ( { index } ) => __contacts__[index] ) );
	} else {
		parentPort.postMessage( {} );
	}

}

search( workerData );