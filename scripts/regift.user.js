// ==UserScript==
// @name           Resend as Package
// @namespace      kolmafia
// @description    When sending a kmail message fails, refills the fields when you visit the gift page
//
// @include        http://*kingdomofloathing.com/sendmessage.php*
// @include        http://127.0.0.1:600*/sendmessage.php*
// @include        http://*kingdomofloathing.com/town_sendgift.php*
// @include        http://127.0.0.1:600*/town_sendgift.php*
// ==/UserScript==


function cacheSubmit(event)
{
	var target = event.target;

	// Reset all the old values so that when everything
	// gets reloaded on the gift page, no stale values.

	for ( var i = 1; i <= 11; ++i )
	{
		GM_setValue( "howmany" + i, "" );
		GM_setValue( "whichitem" + i, "" );
	}

	// Retrieve all the applicable input fields from the
	// submission form.

	var inputs = document.forms.namedItem( "messagesend" ).elements;
	GM_setValue( "towho", inputs.namedItem( "towho" ).value );
	GM_setValue( "contact", inputs.namedItem( "contact" ).value );
	GM_setValue( "note", inputs.namedItem( "message" ).value );
	GM_setValue( "insidenote", inputs.namedItem( "message" ).value );
	GM_setValue( "sendmeat", inputs.namedItem( "sendmeat" ).value );

	for ( var i = 1; i <= 11; ++i )
	{
		if ( inputs.namedItem( "whichitem" + i ) )
		{
			GM_setValue( "whichitem" + i, inputs.namedItem( "whichitem" + i ).value );
			GM_setValue( "howmany" + i, inputs.namedItem( "howmany" + i ).value );
		}
	}

	// Now that all the data values have been cached as Firefox
	// preferences, submit the form to see what happens.

	target.submit();
}

function initializeGift(event)
{
	// Add however many input fields are needed to handle the full
	// item list from the previous message.

	for ( var i = 1; i <= 10; ++i )
		if ( GM_getValue( "whichitem" + (i+1) ) != "" )
			document.location.href = "javascript:addRow('1');";

	// Now, load all the input fields with the data cached from the
	// last green message send request.

	var inputs = document.forms.namedItem( "giftsend" );

	for ( var i = 0; i < inputs.length; ++i )
		if ( GM_getValue( inputs[i].name ) && GM_getValue( inputs[i].name ) != "" )
			inputs[i].value = GM_getValue( inputs[i].name );
}

function resetCachedSubmit(event)
{
	// This is called whenever a gift message is sent to the server.
	// Since you can't clean up formally, just reset the flag indicating
	// whether or not this data should be used.

	GM_setValue( "regift", false );
}

if ( document.location.pathname == "/sendmessage.php" )
{
	// Whenever sending a message fails, you get a link to the gift
	// shop in town.  If you find this link, replace it to the gift
	// sending page and set the "message has failed" flag.  Otherwise,
	// set the flag to off so that the gift page doesn't load it.

	var links = document.getElementsByTagName( "a" );
	var failure = "http://" + document.location.host + "/town_giftshop.php";

	var detected = false;

	for ( var i = 0; i < links.length && !detected; ++i )
	{
		if ( links[i].href == failure )
		{
			links[i].href = "http://" + document.location.host + "/town_sendgift.php";
			detected = true;
		}
	}

	GM_setValue( "regift", detected );

	// Add an event listener for whenever the page submits so that you
	// can cache the values.

	window.addEventListener( "submit", cacheSubmit, true );
}
else
{
	// If the last time you sent a green message failed, reload the gift
	// submission page, and add a listener to clear the cached data when
	// the gift form is submitted.

	if ( GM_getValue( "regift" ) )
	{
		window.addEventListener( "load", initializeGift, true );
		window.addEventListener( "submit", resetCachedSubmit, true );
	}
}
