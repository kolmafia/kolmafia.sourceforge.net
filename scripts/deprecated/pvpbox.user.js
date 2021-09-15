// ==UserScript==
// @name           PvP Inbox
// @namespace      kolmafia
// @description    Moves your PvP messages into a virtual "PvP" inbox and makes "You have been attacked" chat messages point to it.
//
// @include        *kingdomofloathing.com/messages.php*
// @include        *127.0.0.1:600*/messages.php*
// @include        *kingdomofloathing.com/lchat.php
// @include        *127.0.0.1:600*/lchat.php
// @include        *127.0.0.1:600*/chat.html
// ==/UserScript==


var isPvpBox, isEmpty, hasPages, hasResults, messageTable, messages, topHeader;
var isChatPage = document.location.href.indexOf( "chat" ) != -1;

if ( !isChatPage )
{
	isPvpBox = document.location.href.indexOf( "PvP" ) != -1;
	isEmpty = document.body.innerHTML.indexOf( "<td>There are no messages in this mailbox.</td>" ) != -1;

	hasPages = document.body.innerHTML.indexOf( "Jump to page: <" ) != -1;
	hasResults = document.body.innerHTML.indexOf( "<b>Results:</b>" ) != -1;

	messageTable = isEmpty && hasResults ? document.getElementsByTagName( "table" )[3] : isEmpty ? document.getElementsByTagName( "table" )[1] :
		hasResults ? document.getElementsByTagName( "table" )[4] : document.getElementsByTagName( "table" )[2];

	messages = messageTable.rows;
	topHeader = document.getElementsByTagName( "b" )[ hasResults ? 1 : 0 ];
}

// Changes the 'toggle all' link in the browser to
// one which only checks the currently visible inputs.

function adjustToggleLink()
{
	var links = document.getElementsByTagName( "a" );
	for ( var i = 0; i < links.length; ++i )
	{
		if ( links[i].href.indexOf( "javascript:toggle" ) != -1 )
		{
			links[i].href = "javascript: " +
				"var newval = !document.messageform[3].checked; " +
				"for ( var i = 0; i < document.messageform.length; ++i ) { " +
					"if ( document.messageform[i].type == 'checkbox' ) { " +
						"document.messageform[i].checked = newval && (document.messageform[i].getAttribute( 'shouldToggle' ) == 'true'); " +
					"} " +
				"} void(0); ";
		}
	}
}


// Simple utility function which contructs a node of
// the given type with the specified innerHTML.

function constructNode( type, text )
{
	var link = document.createElement( type );
	link.innerHTML = "[" + text + "]";

	if ( type == "a" )
		link.href = "messages.php?box=" + text;

	return link;
}


// Utility method which inserts the PvP box link and
// adjusts the other links as needed.

function insertPvpLinks()
{
	var header = messages[0].getElementsByTagName( "table" )[0];

	// Construct a node which points to all your PvP messages.
	// Also ocate the parent nested inside of the first row.

	var padding = document.createTextNode( " \u00a0" );
	var rowIndex = hasPages ? 1 : 0;

	var bolds = header.rows[rowIndex].getElementsByTagName( "b" );
	var links = header.rows[rowIndex].getElementsByTagName( "a" );

	// If the first link isn't to the inbox, then you're in
	// the inbox -- add a link after the first bold tag.

	if ( links[0].href.indexOf( "Inbox" ) == -1 )
	{
		if ( !isEmpty )
			adjustToggleLink();

		if ( isPvpBox )
		{
			var pvpBold = constructNode( "b", "PvP" );
			header.rows[rowIndex].cells[0].insertBefore( pvpBold, bolds[0].nextSibling );
			header.rows[rowIndex].cells[0].insertBefore( padding, pvpBold );

			var inboxLink = constructNode( "a", "Inbox" );
			header.rows[rowIndex].cells[0].insertBefore( inboxLink, bolds[0] );
			header.rows[rowIndex].cells[0].removeChild( bolds[0] );
		}
		else
		{
			var pvpLink = constructNode( "a", "PvP" );
			header.rows[rowIndex].cells[0].insertBefore( pvpLink, bolds[0].nextSibling );
			header.rows[rowIndex].cells[0].insertBefore( padding, pvpLink );
		}
	}

	// The first link is to the inbox.  Then you're in one
	// of the other boxes, so you can add a link after the
	// first link tag.

	else
	{
		var pvpLink = constructNode( "a", "PvP" );
		header.rows[rowIndex].cells[0].insertBefore( pvpLink, links[0].nextSibling );
		header.rows[rowIndex].cells[0].insertBefore( padding, pvpLink );
	}

	// Finally, all the jump pages need to be changed if you
	// are currently in the PvP box.

	if ( isPvpBox )
	{
		var separatorIndex;
		var links = document.getElementsByTagName( "a" );

		for ( var i = 0; i < links.length; ++i )
		{
			separatorIndex = links[i].href.indexOf( "&begin=" );
			if ( separatorIndex != -1 )
				links[i].href = "messages.php?box=PvP" + links[i].href.substring( separatorIndex );
		}
	}
}


// Utility method which toggles the visibility of the given
// row and the enabled state of the inputs inside that row.

function toggleVisibility( currentRow, isVisible )
{
	var inputs = currentRow.getElementsByTagName( "input" );
	for ( var i = 0; i < inputs.length; ++i )
		inputs[i].setAttribute( "shouldToggle", isVisible );

	if ( !isVisible )
		currentRow.style.display = "none";
}


// Main method which separates the inbox into its component
// pieces.  Should only be called on the inbox and the virtual
// PvP box.

function separateTables()
{
	var inbox = 0;
	var pvpbox = 0;

	var stop = hasPages ? messages.length - 2 : messages.length - 1;

	for ( var i = 2; i < stop; ++i )
	{
		if ( messages[i].innerHTML.indexOf( "how it went down:<p>" ) == -1 )
		{
			++inbox;
			toggleVisibility( messages[i], !isPvpBox );
		}
		else
		{
			++pvpbox;
			toggleVisibility( messages[i], isPvpBox );
		}
	}

	// If the box we're looking at is empty, and it wasn't empty
	// when we started, make sure to add the appropriate message.

	if ( (inbox == 0 && !isPvpBox) || (pvpbox == 0 && isPvpBox) )
	{
		for ( var i = stop; i >= 2; --i )
			messageTable.deleteRow(i);

		if ( !hasPages )
		{
			messages[0].getElementsByTagName( "table" )[0].rows[0].deleteCell(1);
			messages[1].innerHTML = "There are no messages in this mailbox.";
		}
		else
		{
			messages[1].innerHTML = "<br />There are no applicable messages on this page.<br /><br />";
		}
	}


	// Now, adjust the top data area where it shows you what page
	// you are on and how many messages are available.

	if ( isPvpBox )
	{
		topHeader.innerHTML = topHeader.innerHTML.substring( 0, topHeader.innerHTML.indexOf( "Inbox" ) ) + "PvP" +
			topHeader.innerHTML.substring( topHeader.innerHTML.indexOf( "," ) );
	}

	if ( !hasPages )
	{
		var available = isPvpBox ? pvpbox : inbox;
		if ( available == 0 )
			available = "no";

		topHeader.innerHTML = topHeader.innerHTML.substring( 0, topHeader.innerHTML.indexOf( "(" ) + 1 ) +
			available + " messages)";
	}
}


// Special function which updates all the chat links to point
// to the PvP inbox as needed.  Should only fire if there is
// a relatively decent-sized chat update.

var attackPattern = /\"><font color=green>You have been attacked by/g;

function triggerChatUpdate( id, oldValue, newValue )
{	return newValue.replace( attackPattern, "?box=PvP\"><font color=green>You have been attacked by" );
}


if ( isChatPage )
{
	var chatpane = document.getElementById( "ChatWindow" );
	(chatpane.wrappedJSObject || chatpane).watch( "innerHTML", triggerChatUpdate );
}
else
{
	// Whew, all those extra methods.  Now what we do is actually
	// do the reorganization of the messages page.

	insertPvpLinks();

	if ( !isEmpty && document.body.innerHTML.indexOf( "<b>[Saved]</b>" ) == -1 && document.body.innerHTML.indexOf( "<b>[Outbox]</b>" ) == -1 )
		separateTables();

	if ( topHeader.innerHTML.indexOf( "(1 messages)" ) != -1 )
		topHeader.innerHTML = topHeader.innerHTML.substring( 0, topHeader.innerHTML.indexOf( "(" ) + 1 ) + "1 message)";
}