// ==UserScript==
// @name           Equipment Scroller
// @namespace      kolmafia
// @description    Changes equipment slot names into links to equipment sections
//
// @include        *kingdomofloathing.com/inventory.php?which=2*
// @include        *127.0.0.1:600*/inventory.php?which=2*
// ==/UserScript==


function insertLink( cell, name, link )
{
	if ( cell.innerHTML != name + ":" )
		return;

	cell.innerHTML = "<a href=\"#" + link + "_section\">" + name + "</a>:";
}


function insertLinks( rows )
{
	for ( var i = 0; i < rows.length; ++i )
	{
		insertLink( rows[i].cells[0], "Hat", "hats" );
		insertLink( rows[i].cells[0], "Weapon", "weapons" );
		insertLink( rows[i].cells[0], "Off-Hand", "offhands" );
		insertLink( rows[i].cells[0], "Shirt", "shirts" );
		insertLink( rows[i].cells[0], "Pants", "pants" );
		insertLink( rows[i].cells[0], "Accessory", "accessories" );
		insertLink( rows[i].cells[0], "Familiar", "familiar" );
	}
}


function insertAnchor( link, section )
{
	if ( section == "Off-Hand Items" )
		link.setAttribute( "name", "offhands_section" );
	else if ( section == "Familiar Equipment" )
		link.setAttribute( "name", "familiar_section" );
	else
		link.setAttribute( "name", section.toLowerCase() + "_section" );
}


function insertAnchors()
{
	var tables = document.getElementsByTagName( "table" );
	for ( var i = 0; i < tables.length; ++i )
		if ( tables[i].rows[0].cells[0].innerHTML == "<b>Current Equipment:</b>" )
			insertLinks( tables[i].getElementsByTagName( "table" )[1].rows );


	var links = document.getElementsByTagName( "a" );
	for ( var i = 0; i < links.length; ++i )
		if ( links[i].href.indexOf( "javascript:toggle(" ) == 0 )
			insertAnchor( links[i], links[i].href.substring( 19, links[i].href.indexOf( "')" ) ) );
}


insertAnchors();
