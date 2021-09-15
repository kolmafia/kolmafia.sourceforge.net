// ==UserScript==
// @name           Combat Queue Tracker
// @namespace      kolmafia
// @description    Adds information to the sidepane indicating your last five combat encounters.
//
// @include        *kingdomofloathing.com/charpane.php
// @include        *127.0.0.1:600*/charpane.php
// @include        *kingdomofloathing.com/fight.php
// @include        *127.0.0.1:600*/fight.php
// @include        *kingdomofloathing.com/choice.php*
// @include        *127.0.0.1:600*/choice.php*
// ==/UserScript==


function ensureQueueExists( player )
{
	// If the monster queue variables are undefined, initialize them
	// all to empty values.

	if ( !GM_getValue( player + "monsterQueue1" ) )
	{
		GM_setValue( player + "recentChoice", false );
		GM_setValue( player + "lastRound", 0 );
		GM_setValue( player + "monsterQueue1", "Jick" );
		GM_setValue( player + "monsterQueue2", "Mr. Skullhead" );
		GM_setValue( player + "monsterQueue3", "Riff" );
		GM_setValue( player + "monsterQueue4", "HotStuff" );
		GM_setValue( player + "monsterQueue5", "Xenophobe" );
	}
}

function updateQueue()
{
	var player = GM_getValue( "currentPlayer" ) + "_";
	ensureQueueExists( player );

	if ( document.location.href.indexOf( "/choice.php" ) != -1 )
	{
		encounter = document.getElementsByTagName( "b" )[0].innerHTML;

		if ( encounter.indexOf( "Results" ) != -1 )
		{
			GM_setValue( player + "recentChoice", false );
			return true;
		}

		GM_setValue( player + "recentChoice", true );
		return true;
	}

	// SomeStranger and bigfreak point out that MonsterStats
	// injects itself into the fight page in an inline fashion,
	// so checking body text isn't safe.  Scan paragraph tags
	// instead to avoid this problem.

	var paragraphs = document.getElementsByTagName( "p" );
	GM_setValue( player + "lastRound", GM_getValue( player + "lastRound" ) + 1 );

	// If this isn't the first round of combat, then there is
	// no need to update the monster queue.

	for ( var i = 0; i < paragraphs.length; ++i )
		if ( paragraphs[i].innerHTML.indexOf( "You get the jump" ) != -1 || paragraphs[i].innerHTML.indexOf( "They get the jump" ) != -1 || paragraphs[i].innerHTML.indexOf( "gets the jump" ) != -1 )
			GM_setValue( player + "lastRound", 1 );

	if ( GM_getValue( player + "lastRound" ) != 1 )
		return true;

	if ( GM_getValue( player + "recentChoice" ) )
	{
		GM_setValue( player + "recentChoice", false );
		return true;
	}

	// Certain monsters appear on a page that's not 'adventure.php'
	// and thus theoretically do not appear in the queue.

	var monster = document.getElementById( "monname" ).innerHTML;
	var testName = monster.toLowerCase();

	if ( testName.indexOf( "a " ) == 0 )
	{
		testName = testName.substring(2);
		monster = monster.substring(2);
	}
	else if ( testName.indexOf( "an " ) == 0 )
	{
		testName = testName.substring(3);
		monster = monster.substring(3);
	}
	else if ( testName.indexOf( "the " ) == 0 )
	{
		testName = testName.substring(4);
		monster = monster.substring(4);
	}

	// Based on Orangeperson's list of monsters that do not use 'adventure.php'
	// where the queue is believed to trigger.  Also added the bonerdagon
	// (cyrpt.php), the knob goblin king (knob.php), topiary golems (lair3.php),
	// and the tower monsters (lair4.php and lair5.php).

	var nonAdventures = new Array(
		"apathetic lizardman", "dairy ooze", "dodecapede", "giant giant moth",
		"mayonnaise wasp", "pencil golem", "sabre-toothed lime", "tonic water elemental",
		"vampire clam", "mimic", "drunken rat", "baron von ratsworth", "bonerdagon",
		"knob goblin king", "topiary golem", "beer batter", "big meat golem", "bowling cricket",
		"electron submarine", "enraged cow", "fickle finger of f8", "flaming samurai",
		"giant desktop globe", "ice cube", "pretty fly", "tyrannosaurus tex", "vicious easel" );

	if ( nonAdventures.indexOf( testName ) != -1 )
		return true;

	// Also exclude the shadow fight, and the sorceress in a
	// convenient manner, since they're on 'lair6.php'.

	if ( testName.indexOf( "shadow" ) == 0 )
		return true;
	if ( testName.indexOf( "naughty sorceress" ) == 0 )
		return true;

	// Shift all of the elements in the monster queue down and
	// add the new element to the top of the queue.

	for ( var i = 5; i > 1; --i )
		GM_setValue( player + "monsterQueue" + i, GM_getValue( player + "monsterQueue" + (i-1) ) );

	// Also, there are some monster names that are really
	// long that don't need to be -- shorten them.

	if ( monster.indexOf( "Knob Goblin" ) == 0 )
		monster = monster.substring(12);

	GM_setValue( player + "monsterQueue1", monster );

	// Also, force a refresh of the sidepane so that the
	// player knows the queue has updated.

	var forceRefresh = true;
	var scripts = document.getElementsByTagName( "script" );

	for ( var i = 0; i < scripts.length; ++i )
		forceRefresh &= scripts[i].innerHTML.indexOf( "charpane.php" ) == -1;

	if ( forceRefresh && unsafeWindow.top.charpane )
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
		center.innerHTML = "<nobr>" + GM_getValue( player + "monsterQueue1" ) +
			"</nobr><br><nobr>" + GM_getValue( player + "monsterQueue2" ) + "</nobr><br><nobr>" + GM_getValue( player + "monsterQueue3" ) +
			"</nobr><br><nobr>" + GM_getValue( player + "monsterQueue4" ) + "</nobr><br><nobr>" + GM_getValue( player + "monsterQueue5" ) + "</nobr>";

		bodyElement.appendChild( hr );
		bodyElement.appendChild( center );

		return true;
	}

	var queueData = GM_getValue( player + "monsterQueue1" ) +
		", " + GM_getValue( player + "monsterQueue2" ) + ", " + GM_getValue( player + "monsterQueue3" ) +
		", " + GM_getValue( player + "monsterQueue4" ) + ", " + GM_getValue( player + "monsterQueue5" );

	// Search for the table containing the last adventure link
	// and insert a row containing the queue information.

	var tables = document.getElementsByTagName( "table" );
	for ( var i = 0; i < tables.length; ++i )
	{
		if ( tables[i].rows.length == 1 && tables[i].innerHTML.indexOf( "adventure.php" ) != -1 )
		{
			var oldHTML = tables[i].rows[0].cells[0].innerHTML;
			tables[i].rows[0].cells[0].innerHTML = "<center>" + oldHTML +
				"<br><font size=2><b>Monster Queue:</b><br>" + queueData + "</font></center>";

			return true;
		}
	}

	return false;
}

// If you're on the fight page, then update the monster queue if
// you're currently in the first round.

if ( document.location.pathname == "/charpane.php" )
	renderQueue();
else
	updateQueue();