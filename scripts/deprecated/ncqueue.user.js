// ==UserScript==
// @name           Noncombat Queue Tracker
// @namespace      kolmafia
// @description    Adds information to the sidepane indicating your last five non-combat encounters.
//
// @include        *kingdomofloathing.com/charpane.php
// @include        *127.0.0.1:600*/charpane.php
// @include        *kingdomofloathing.com/adventure.php*
// @include        *127.0.0.1:600*/adventure.php*
// @include        *kingdomofloathing.com/choice.php*
// @include        *127.0.0.1:600*/choice.php*
// @include        *kingdomofloathing.com/fight.php
// @include        *127.0.0.1:600*/fight.php
// ==/UserScript==


function ensureQueueExists( player )
{
	// If the encounter queue variables are undefined, initialize them
	// all to empty values.

	if ( !GM_getValue( player + "encounterQueue1" ) )
	{
		GM_setValue( player + "registerChoices", true );
		GM_setValue( player + "encounterQueue1", "Location 1" );
		GM_setValue( player + "encounterQueue2", "Location 2" );
		GM_setValue( player + "encounterQueue3", "Location 3" );
		GM_setValue( player + "encounterQueue4", "Location 4" );
		GM_setValue( player + "encounterQueue5", "Location 5" );
	}
}

function updateQueue()
{
	var player = GM_getValue( "currentPlayer" ) + "_";
	ensureQueueExists( player );

	// SomeStranger and bigfreak point out that MonsterStats
	// injects itself into the fight page in an inline fashion,
	// so checking body text isn't safe.  Scan paragraph tags
	// instead to avoid this problem.

	var tags = document.getElementsByTagName( "b" );
	var encounter = null;

	if ( document.location.href.indexOf( "/choice.php" ) != -1 )
	{
		encounter = tags[0].innerHTML;

		if ( encounter.indexOf( "Results" ) != -1 )
		{
			GM_setValue( player + "registerChoices", true );
			return true;
		}

		if ( !GM_getValue( player + "registerChoices" ) )
			return true;

		GM_setValue( player + "registerChoices", false );
	}
	else
		encounter = tags[1].innerHTML;

	// MoxFulder indicates that there are various noncombats
	// that do not count against the noncombat queue.

	var testName = encounter.toLowerCase();

	var nonAdventures = new Array(
		"screwdriver, wider than a mile", "the manor in which you are accustomed",
		"rock-a-bye larva", "that's your cue", "cobb's knob lab key", "the three arrrs" );

	if ( nonAdventures.indexOf( testName ) != -1 )
		return true;

	// Shorten the name of the noncombat encounter so that it
	// doesn't break the character pane.

	if ( encounter.length > 20 )
		encounter = encounter.substring( 0, 17 ) + "...";

	// Shift all of the elements in the encounter queue down and
	// add the new element to the top of the queue.

	for ( var i = 5; i > 1; --i )
		GM_setValue( player + "encounterQueue" + i, GM_getValue( player + "encounterQueue" + (i-1) ) );

	GM_setValue( player + "encounterQueue1", encounter );

	// Also, force a refresh of the sidepane so that the
	// player knows the queue has updated.

	var forceRefresh = true;
	var scripts = document.getElementsByTagName( "script" );

	for ( var i = 0; i < scripts.length; ++i )
		forceRefresh &= scripts[i].innerHTML.indexOf( "charpane.php" ) == -1;

	if ( forceRefresh )
		unsafeWindow.top.charpane.refresh();

	return true;
}

function renderQueue()
{
	// Find the current player name.

	var links = document.getElementsByTagName( "a" );
	for ( var i = 0; i < links.length; ++i )
	{
		if ( links[i].href.indexOf( "charsheet.php" ) != -1 && links[i].innerHTML.indexOf( "<img" ) == -1 )
		{
			var name = links[i].innerHTML;
			if ( name.indexOf( "<b>" ) == 0 )
				name = name.substring( 3, name.length - 4 );

			GM_setValue( "currentPlayer", name );
		}
	}

	var player = GM_getValue( "currentPlayer" ) + "_";
	ensureQueueExists( player );

	// Store what you'll be adding to the page in a temporary
	// variable for use later.

	var bodyElement = document.getElementsByTagName( "body" )[0];

	if ( bodyElement.innerHTML.indexOf( "Mysticality:" ) == -1 )
	{
		// Thanks to OneTonTomato's help, this no longer breaks
		// event listeners on a page, because it appends a node
		// to the body rather than breaking the body's innerHTML.

		var hr = document.createElement( "hr" );
		hr.width = "50%";

		var center = document.createElement( "center" );
		center.innerHTML = "<nobr>" + GM_getValue( player + "encounterQueue1" ) +
			"</nobr><br><nobr>" + GM_getValue( player + "encounterQueue2" ) + "</nobr><br><nobr>" + GM_getValue( player + "encounterQueue3" ) +
			"</nobr><br><nobr>" + GM_getValue( player + "encounterQueue4" ) + "</nobr><br><nobr>" + GM_getValue( player + "encounterQueue5" ) + "</nobr>";

		bodyElement.appendChild( hr );
		bodyElement.appendChild( center );

		return true;
	}

	var queueData = GM_getValue( player + "encounterQueue1" ) +
		" // " + GM_getValue( player + "encounterQueue2" ) + " // " + GM_getValue( player + "encounterQueue3" ) +
		" // " + GM_getValue( player + "encounterQueue4" ) + " // " + GM_getValue( player + "encounterQueue5" );

	// Search for the table containing the last adventure link
	// and insert a row containing the queue information.

	var tables = document.getElementsByTagName( "table" );
	for ( var i = 0; i < tables.length; ++i )
	{
		if ( tables[i].rows.length == 1 && tables[i].innerHTML.indexOf( "adventure.php" ) != -1 )
		{
			var oldHTML = tables[i].rows[0].cells[0].innerHTML;
			tables[i].rows[0].cells[0].innerHTML = "<center>" + oldHTML +
				"<br><font size=2><b>NonCom Queue:</b><br>" + queueData + "</font></center>";

			return true;
		}
	}

	return false;
}

// If you're on the fight page, then update the monster queue if
// you're currently in the first round.

if ( document.location.pathname == "/charpane.php" )
	renderQueue();
else if ( document.location.pathname == "/fight.php" )
	GM_setValue( GM_getValue( "currentPlayer" ) + "_registerChoices", true );
else
	updateQueue();
