// ==UserScript==
// @name           Ascension Gap Filler
// @namespace      kolmafia
// @description    Converts the blank space when there's an unknown familiar in your ascension history to a confused effect image
//
// @include        http://*kingdomofloathing.com/ascensionhistory.php*
// @include        http://127.0.0.1:600*/ascensionhistory.php*
// ==/UserScript==

function replaceUnknownFamiliars()
{
	var table = document.getElementsByTagName('table')[2];
	var rowCount = table.rows.length;

	for ( var i = 1; i < rowCount; ++i )
	{
		if ( table.rows[i].cells.length > 2 )
		{
			cell = table.rows[i].cells[7];
			if ( cell.innerHTML == "" )
				cell.innerHTML = '<img src="http://images.kingdomofloathing.com/itemimages/confused.gif" title="No Data" alt="No Data" height="30" width="30">';
		}
		else
		{
			table.rows[i].style.display = "none";
		}
	}
}

replaceUnknownFamiliars();
