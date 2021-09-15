// ==UserScript==
// @name           Flower Hunter
// @namespace      kolmafia
// @description    Adds the ability to automatically hit players from the PvP search page
//
// @include        *kingdomofloathing.com/pvp.php*
// @include        *127.0.0.1:600*/pvp.php*
// @include        *kingdomofloathing.com/searchplayer.php*
// @include        *127.0.0.1:600*/searchplayer.php*
// ==/UserScript==


function loadDefaultSearch()
{
	// Hitting hitting down by 40 rank or more results in only an
	// increase in rank of 1, so add in a default rank search.

	var inputs = document.getElementsByTagName( "input" );

	// Now we auto-replace all the different search parameters
	// with the defaults.

	for ( var i = 0; i < inputs.length; ++i )
	{
		if ( inputs[i].name == "pvponly" )
			inputs[i].checked = "checked";

		else if ( inputs[i].name == "hardcoreonly" && inputs[i].value == 1 )
			inputs[i].checked = "checked";
	}
}


function sortSearchResults()
{
	var table = document.getElementsByTagName( "table" )[0];
	var existingRows = table.childNodes[0].childNodes;

	// Store a bunch of data in parallel arrays. Sure, there are
	// more elegant ways to do it, but there's maybe 100 elements,
	// so there's no benefit to using them.

	var searchData = new Array();
	searchData[0] = new Array();
	searchData[1] = new Array();
	searchData[2] = new Array();
	searchData[3] = new Array();

	for ( var i = existingRows.length - 1; i >= 1; --i )
	{
		searchData[0].push( existingRows[i] );

		searchData[1].push( parseInt( existingRows[i].cells[2].innerHTML ) );
		searchData[2].push( existingRows[i].cells[3].innerHTML );
		searchData[3].push( parseInt( existingRows[i].cells[4].innerHTML ) );

		table.deleteRow(i);
	}

	// Because there are maybe 100 results, using an intelligent
	// data structure is overkill. So, we just scan for the minimum
	// one by one until all rows are empty.

	var maximumRow = 0;

	while ( searchData[0].length > 0 )
	{
		// Find out what the maximum rank, then the maximum level,
		// and then the player class.

		for ( var i = 1; i < searchData[1].length; ++i )
		{
			if ( searchData[3][i] > searchData[3][maximumRow] )
				maximumRow = i;
			else if ( searchData[3][i] == searchData[3][maximumRow] && searchData[1][i] > searchData[1][maximumRow] )
				maximumRow = i;
			else if ( searchData[3][i] == searchData[3][maximumRow] && searchData[1][i] == searchData[1][maximumRow] && searchData[2][i] < searchData[2][maximumRow] )
				maximumRow = i;
		}

		// Remove the element you just added from the arrays and
		// reset the maximum row for the next pass of the search.

		table.appendChild( searchData[0][maximumRow] );

		searchData[0].splice( maximumRow, 1 );
		searchData[1].splice( maximumRow, 1 );
		searchData[2].splice( maximumRow, 1 );
		searchData[3].splice( maximumRow, 1 );
		maximumRow = 0;
	}
}


function createPvPLinks()
{
	// Okay, scan each row, and for every single applicable row,
	// add in an asterisk link which links to the PvP page.

	var rows = document.getElementsByTagName( "tr" );

	for ( var i = 0; i < rows.length; ++i )
	{
		if ( rows[i].cells.length == 5 && rows[i].cells[4].innerHTML.indexOf( "<u>" ) == -1 )
		{
			var link = document.createElement( "font" );
			link.setAttribute( "size", "+1" );

			link.innerHTML = "<a target=mainpane href=\"pvp.php?who=" + rows[i].cells[1].innerHTML + "&autohit=yes\">*</a>";
			rows[i].cells[4].appendChild( link );
		}
	}
}


function stealFlowers()
{
	// Automatically switch to the flowers checkbox before
	// submitting the PvP hit attempt.

	var inputs = document.getElementsByTagName( "input" );

	for ( var i = 0; i < inputs.length; ++i )
		if ( inputs[i].value == "flowers" )
			inputs[i].checked = "checked";

	document.forms[0].submit();
}

// Now, decide what to do based on the page you're seeing.
// Search pages get links, pvp pages linked from the modified
// search page equate to an auto-hit.

if ( document.location.pathname.indexOf( "/searchplayer.php" ) != -1 )
{
	loadDefaultSearch();
	sortSearchResults();
	createPvPLinks();
}
else if ( document.location.href.indexOf( "autohit=yes" ) != -1 )
{
	stealFlowers();
}
