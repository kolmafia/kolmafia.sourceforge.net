// ==UserScript==
// @name           Drawn Onward
// @namespace      kolmafia
// @description    Auto-selects the correct choices in the dropdowns for the Drawn Onward adventure.
//
// @include        *kingdomofloathing.com/palinshelves.php
// ==/UserScript==


function changeSelection( selectToChange, desiredValue )
{
	for ( var i = 0; i < selectToChange.options.length; ++i )
		if ( selectToChange.options[i].value == desiredValue )
			selectToChange.selectedIndex = i;
}

var selectors = document.getElementsByTagName( "select" );

for ( var i = 0; i < selectors.length; ++i )
{
	if ( selectors[i].name == "whichitem1" )
		changeSelection( selectors[i], 2259 );
	else if ( selectors[i].name == "whichitem2" )
		changeSelection( selectors[i], 2260 );
	else if ( selectors[i].name == "whichitem3" )
		changeSelection( selectors[i], 493 );
	else if ( selectors[i].name == "whichitem4" )
		changeSelection( selectors[i], 2261 );
}