// ==UserScript==
// @name           Familiar Unsorter
// @namespace      kolmafia
// @description    Sorts your familiars by experience, then by database id.
//
// @include        *kingdomofloathing.com/familiar.php*
// @include        *127.0.0.1:600*/familiar.php*
// ==/UserScript==


function sortFamiliars()
{
	var allTables = document.getElementsByTagName( "table" );
	var familiarTable = allTables[ allTables.length - 1 ];
	var existingRows = familiarTable.childNodes[0].childNodes;

	var idPattern = /onClick=\"fam\((\d+)\)\">.*<b>.*<\/b>, the \d+-pound .* \(([\d,]+) exp, [\d,]+ kills?\) <\/td>/i;

	// Store a bunch of data in parallel arrays. Sure, there are
	// more elegant ways to do it, but there's maybe 50-60 elements,
	// so there's no benefit to using them.

	var familiarData = new Array();
	familiarData[0] = new Array();
	familiarData[1] = new Array();
	familiarData[2] = new Array();

	for ( var i = existingRows.length - 1; i >= 0; --i )
	{
		// If you found a row in the table, then put it in your
		// array of nodes to re-add, and remove it from the actual
		// table so you can play around some more.

		var idMatcher = idPattern.exec( existingRows[i].innerHTML );

		familiarData[0].push( existingRows[i] );
		familiarData[1].push( parseInt( idMatcher[1] ) );
		familiarData[2].push( parseInt( idMatcher[2].replace( /,/g, "" ) ) );
		familiarTable.deleteRow(i);
	}

	// Because there are maybe 50 familiars, using an intelligent
	// data structure is overkill. So, we just scan for the minimum
	// one by one until all rows are empty.

	var maximumRow = 0;

	while ( familiarData[0].length > 0 )
	{
		// Find out what the maximum experience of all familiars might be,
		// then the maximum kills of equivalent experience familiars, and
		// then by name if all else is equal.

		for ( var i = 1; i < familiarData[1].length; ++i )
		{
			if ( familiarData[2][i] > familiarData[2][maximumRow] )
				maximumRow = i;
			else if ( familiarData[2][i] == familiarData[2][maximumRow] && familiarData[1][i] < familiarData[1][maximumRow] )
				maximumRow = i;
		}

		// Remove the element you just added from the arrays and
		// reset the maximum row for the next pass of the search.

		familiarTable.appendChild( familiarData[0][maximumRow] );

		familiarData[0].splice( maximumRow, 1 );
		familiarData[1].splice( maximumRow, 1 );
		familiarData[2].splice( maximumRow, 1 );
		maximumRow = 0;
	}
}

sortFamiliars();
