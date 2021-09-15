// ==UserScript==
// @name           Clan War Egg Timer
// @namespace      kolmafia
// @description    Adds an egg timer to chat to remind you to do your next clan attack
//
// @include        *kingdomofloathing.com/lchat.php
// @include        *127.0.0.1:600*/lchat.php
// ==/UserScript==


var minutesLeft = 0;

function initializeTimer()
{
	var httpObject = new XMLHttpRequest();
	httpObject.onreadystatechange = function()
	{
		if ( httpObject.readyState != 4 )
			return true;

		var lastAttackString = httpObject.responseText;
		if ( lastAttackString.indexOf( "already attacked" ) != -1 )
		{
			minutesLeft = 0;
			var lastAttackData = lastAttackString.substring( lastAttackString.indexOf( "<br>" ) );
			if ( lastAttackData.indexOf( "2 hours" ) != -1 )
				minutesLeft += 120;
			else if ( lastAttackData.indexOf( "1 hour" ) != -1 )
				minutesLeft += 60;

			for ( var i = 59; i > 1; --i )
			{
				if ( lastAttackData.indexOf( i + " minutes" ) != -1 )
				{
					minutesLeft += i;
					break;
				}
			}

			if ( minutesLeft % 60 == 0 && lastAttackData.indexOf( "1 minute" ) != -1 )
				++minutesLeft;

			postMinutesLeft();
			return true;
		}
	};

	httpObject.open( "GET", "http://" + window.location.host + "/clan_war.php" );
	httpObject.send( null );
	return true;
}

function postMinutesLeft()
{
	if ( minutesLeft == 0 )
		return true;

	var message = "";

	if ( minutesLeft == 1 )
		message = "<a href=\"/clan_war.php\" target=\"mainpane\" style=\"color:red\">[war]</a> <font color=red>Less than 1 minute left!</font><br>";
	else
		message = "<a href=\"/clan_war.php\" target=\"mainpane\" style=\"color:blue\">[war]</a> <font color=green>" + minutesLeft + " minutes until next attack.</font><br>";

	document.getElementById( "ChatWindow" ).innerHTML += message;
	document.getElementById( "ChatWindow" ).scrollTop += 400;

	if ( minutesLeft == 1 )
	{
		setTimeout( initializeTimer, 10000 );
		return true;
	}

	var milliseconds = 1000;

	if ( minutesLeft <= 5 )
		milliseconds = 60000;
	else if ( minutesLeft % 5 != 0 )
		milliseconds = (minutesLeft % 5) * 60000;
	else if ( minutesLeft > 30 )
		milliseconds = 10 * 60000;
	else
		milliseconds = 5 * 60000;

	setTimeout( postMinutesLeft, milliseconds );
	minutesLeft -= milliseconds / 60000;
	return true;
}

initializeTimer();
