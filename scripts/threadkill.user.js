// ==UserScript==
// @name           Thread Killer
// @namespace      kolmafia
// @description    Gives you the ability to add Gameplay forum threads to your ignore list
//
// @include        *forums.kingdomofloathing.com/viewforum.php?f=2*
// ==/UserScript==


// First make sure that the appropriate variables
// are initialized.  This includes the list of threads
// which should be killed along with a global pattern
// constant to speed up regular expressions.

if ( !GM_getValue( "threadIds" ) )
	GM_setValue( "threadIds", "" );

var killedThreads = GM_getValue( "threadIds" ).split( "," );
var topicPattern = new RegExp( "t=(\\d+)" );


// Utility method which kills the specified thread
// with the specified thread ID.

function destroyThread( row, threadId )
{
	if ( !confirm( "Are you sure you wish to ignore this thread?" ) )
		return;

	killedThreads.push( threadId );
	GM_setValue( "threadIds", killedThreads.join( "," ) );

	row.setAttribute( "style", "display:none" );
}


// Utility method which examines the given row and
// adds a thread-killing link in addition to killing
// off any rows which should be dead.

function examineRow( row )
{
	var threadId = topicPattern.exec( row.getElementsByTagName( "a" )[0].href )[1];

	var spacer = document.createElement( "br" );
	var killLink = document.createElement( "a" );

	killLink.innerHTML = "<img src='http://forums.kingdomofloathing.com/templates/subSilver/images/topic_delete.gif'>";
	killLink.addEventListener( "click", function() { destroyThread( row, threadId ) }, true );

	row.cells[4].appendChild( spacer );
	row.cells[4].appendChild( killLink );

	if ( killedThreads.indexOf( threadId ) != -1 )
		row.setAttribute( "style", "display:none" );
}


// Utility method which adds the thread destroying
// links to the given forum page.

function addDestroyLinks()
{
	var rows = document.getElementsByTagName( "tr" );

	for ( var i = 0; i < rows.length; ++i )
		if ( rows[i].cells.length == 6 )
			examineRow( rows[i] );
}

addDestroyLinks();