// ==UserScript==
// @name           Overdrink Protection
// @namespace      kolmafia
// @description    Helps protect you from overdrinking by giving you an alert if you're about to go over.
//
// @include        http://*kingdomofloathing.com/inventory.php*
// @include        http://127.0.0.1:600*/inventory.php*
// ==/UserScript==


var currentInebriety = 0;
var rows = top.charpane.getElementsByTagName( "tr" );
for ( var i = 0; i < rows.length; ++i )
{
	if ( rows[i].cells.length != 2 )
		continue;

	// Search for a string indicating the player is inebriated.
	// These strings include Drunkenness, Tipsiness, Inebriety,
	// or Temulency.  Make sure it's compact-mode compatible.

	if ( rows[i].cells[0].innerHTML.indexOf( "Drunk" ) != -1 || rows[i].cells[0].innerHTML.indexOf( "Tipsi" ) != -1 ||
		rows[i].cells[0].innerHTML.indexOf( "Ineb" ) != -1 || rows[i].cells[0].innerHTML.indexOf( "Temul" ) != -1 )
	{
		currentInebriety = parseInt( rows[i].cells[1].childNodes[0].innerHTML );
	}
}

// Now we initialize some relevant variables to figure out
// if we can skip this entire process.

var maximumInebriety = 15;

var inebrietyLimit = new Array();

// I should probably use GM_setValue on all of these values,
// but this is a mostly incomplete script that somoene will
// improve on eventually.  Item ID to drunkenness conversion
// based off of the booze by inebriety table on the KoL Wiki.


inebrietyLimit[41] = 1;      // ice-cold Sir Schlitz
inebrietyLimit[81] = 1;      // ice-cold Willer
inebrietyLimit[180] = 3;     // ice-cold fotie
inebrietyLimit[237] = 3;     // bottle of gin
inebrietyLimit[238] = 3;     // bottle of vodka
inebrietyLimit[248] = 3;     // salty dog
inebrietyLimit[249] = 3;     // bloody mary
inebrietyLimit[250] = 3;     // screwdriver
inebrietyLimit[251] = 3;     // martini
inebrietyLimit[252] = 1;     // bloody beer
inebrietyLimit[253] = 1;     // shot of orange schnapps
inebrietyLimit[254] = 1;     // shot of grapefruit schnapps
inebrietyLimit[255] = 1;     // fine wine
inebrietyLimit[256] = 1;     // shot of tomato schnapps
inebrietyLimit[257] = 3;     // extra-spicy bloody mary
inebrietyLimit[266] = 3;     // white lightning
inebrietyLimit[328] = 3;     // bottle of whiskey
inebrietyLimit[331] = 3;     // white Canadian
inebrietyLimit[456] = 3;     // dry martini
inebrietyLimit[470] = 1;     // Imp Ale
inebrietyLimit[524] = 3;     // papaya sling
inebrietyLimit[557] = 3;     // whiskey and cola
inebrietyLimit[564] = 3;     // Mad Train wine
inebrietyLimit[673] = 3;     // vodka and cranberry
inebrietyLimit[674] = 3;     // whiskey sour
inebrietyLimit[679] = 4;     // roll in the hay
inebrietyLimit[680] = 4;     // slap and tickle
inebrietyLimit[681] = 4;     // slip 'n' slide
inebrietyLimit[682] = 4;     // a little sump'm sump'm
inebrietyLimit[683] = 4;     // horizontal tango
inebrietyLimit[684] = 4;     // pink pony
inebrietyLimit[762] = 4;     // especially salty dog
inebrietyLimit[784] = 1;     // Acqua Del Piatto Merlot
inebrietyLimit[787] = 3;     // bottle of rum
inebrietyLimit[788] = 3;     // strawberry daiquiri
inebrietyLimit[789] = 3;     // rum and cola
inebrietyLimit[790] = 3;     // grog
inebrietyLimit[795] = 1;     // Acque Luride Grezze Cabernet
inebrietyLimit[797] = 4;     // rockin' wagon
inebrietyLimit[798] = 4;     // ocean motion
inebrietyLimit[799] = 4;     // fuzzbump
inebrietyLimit[837] = 1;     // Uovo Marcio Shiraz
inebrietyLimit[839] = 1;     // Maiali Sifilitici Pinot Noir
inebrietyLimit[841] = 3;     // tomato daiquiri
inebrietyLimit[842] = 3;     // beertini
inebrietyLimit[843] = 3;     // salty slug
inebrietyLimit[844] = 3;     // papaya slung
inebrietyLimit[893] = 3;     // lumbering jack
inebrietyLimit[903] = 1;     // Spasmi Dolorosi Del Rene Champagne
inebrietyLimit[927] = 1;     // Ferita Del Petto Zinfandel
inebrietyLimit[931] = 3;     // spiced rum
inebrietyLimit[932] = 3;     // eggnog
inebrietyLimit[948] = 6;     // dirty martini
inebrietyLimit[949] = 6;     // grogtini
inebrietyLimit[950] = 6;     // cherry bomb
inebrietyLimit[1004] = 3;    // bottle of tequila
inebrietyLimit[1005] = 3;    // boxed wine
inebrietyLimit[1009] = 3;    // vodka martini
inebrietyLimit[1010] = 3;    // whiskey and soda
inebrietyLimit[1011] = 3;    // monkey wrench
inebrietyLimit[1012] = 3;    // tequila sunrise
inebrietyLimit[1013] = 3;    // margarita
inebrietyLimit[1014] = 3;    // strawberry wine
inebrietyLimit[1015] = 3;    // wine spritzer
inebrietyLimit[1016] = 4;    // perpendicular hula
inebrietyLimit[1017] = 4;    // ducha de oro
inebrietyLimit[1018] = 4;    // calle de miel
inebrietyLimit[1019] = 3;    // dry vodka martini
inebrietyLimit[1020] = 3;    // old-fashioned
inebrietyLimit[1021] = 3;    // tequila with training wheels
inebrietyLimit[1022] = 3;    // sangria
inebrietyLimit[1023] = 6;    // vesper
inebrietyLimit[1024] = 6;    // bodyslam
inebrietyLimit[1025] = 6;    // sangria del diablo
inebrietyLimit[1041] = 1;    // green beer
inebrietyLimit[1139] = 3;    // flaming mushroom wine
inebrietyLimit[1140] = 3;    // icy mushroom wine
inebrietyLimit[1141] = 3;    // stinky mushroom wine
inebrietyLimit[1142] = 3;    // pointy mushroom wine
inebrietyLimit[1143] = 3;    // flat mushroom wine
inebrietyLimit[1144] = 3;    // cool mushroom wine
inebrietyLimit[1145] = 3;    // knob mushroom wine
inebrietyLimit[1146] = 3;    // knoll mushroom wine
inebrietyLimit[1147] = 3;    // spooky mushroom wine
inebrietyLimit[1148] = 1;    // shot of flower schnapps
inebrietyLimit[1150] = 3;    // bottle of single-barrel whiskey
inebrietyLimit[1352] = 3;    // redrum
inebrietyLimit[1357] = 2;    // Mt. Noob Pale Ale
inebrietyLimit[1496] = 3;    // gloomy mushroom wine
inebrietyLimit[1497] = 3;    // oily mushroom wine
inebrietyLimit[1551] = 3;    // bottle of Domesticated Turkey
inebrietyLimit[1552] = 3;    // bottle of Definit
inebrietyLimit[1553] = 3;    // bottle of Calcutta Emerald
inebrietyLimit[1554] = 3;    // bottle of Lieutenant Freeman
inebrietyLimit[1555] = 3;    // bottle of Jorge Sinsonte
inebrietyLimit[1556] = 3;    // boxed champagne
inebrietyLimit[1563] = 3;    // whiskey bittersweet
inebrietyLimit[1564] = 3;    // mimosette
inebrietyLimit[1565] = 3;    // tequila sunset
inebrietyLimit[1566] = 3;    // zmobie
inebrietyLimit[1567] = 3;    // gin and tonic
inebrietyLimit[1568] = 3;    // vodka and tonic
inebrietyLimit[1569] = 3;    // vodka gibson
inebrietyLimit[1570] = 3;    // gibson
inebrietyLimit[1571] = 3;    // parisian cathouse
inebrietyLimit[1572] = 3;    // rabbit punch
inebrietyLimit[1573] = 3;    // caipifruta
inebrietyLimit[1574] = 3;    // teqiwila
inebrietyLimit[1575] = 4;    // Divine
inebrietyLimit[1576] = 4;    // Gordon Bennett
inebrietyLimit[1577] = 4;    // tangarita
inebrietyLimit[1578] = 4;    // mandarina colada
inebrietyLimit[1579] = 4;    // gimlet
inebrietyLimit[1580] = 4;    // yellow brick road
inebrietyLimit[1581] = 4;    // vodka stratocaster
inebrietyLimit[1582] = 4;    // neuromancer
inebrietyLimit[1583] = 4;    // prussian cathouse
inebrietyLimit[1584] = 4;    // Mae West
inebrietyLimit[1585] = 4;    // Mon Tiki
inebrietyLimit[1586] = 4;    // teqiwila slammer
inebrietyLimit[1634] = 4;    // around the world
inebrietyLimit[1642] = 1;    // Grimacite Bock
inebrietyLimit[1774] = 2;    // bottle of popskull
inebrietyLimit[1790] = 1;    // Ram's Face Lager
inebrietyLimit[1951] = 2;    // bottle of Pinot Renoir
inebrietyLimit[1953] = 2;    // flute of flat champagne
inebrietyLimit[1956] = 2;    // snifter of thoroughly aged brandy
inebrietyLimit[2194] = 3;    // spooky eggnog


// Now we methodically replace all of the links present
// in the document that link to booze, if and only if
// the end result is us exceeding the drunk limit.

var links = document.getElementsByTagName( "a" );
var pattern = new RegExp( "whichitem=(\\d+)" );

var inebrietyNames = new Array();

inebrietyNames.push( "drunkenness" );
inebrietyNames.push( "tipsiness" );
inebrietyNames.push( "inebriety" );
inebrietyNames.push( "temulency" );

var inebrietyTotal;

for ( var i = 0; i < links.length; ++i )
{
	if ( links[i].href.indexOf( "inv_booze.php" ) == -1 )
		continue;

	var matcher = pattern.exec( links[i].href );
	if ( matcher == null )
		continue;

	inebrietyTotal = currentInebriety + inebrietyLimit[ parseInt( matcher[1] ) ];

	if ( inebrietyTotal >= maximumInebriety )
	{
		links[i].href = "javascript: if ( confirm( 'Are you sure you want to drink this?\\nIt will bring your " +
			inebrietyNames[ parseInt( Math.random() * inebrietyNames.length ) ] +
			" to " + (inebrietyTotal) + ", which is " + (inebrietyTotal - maximumInebriety) + " over the limit.' ) ) " +
			"document.location.href = '" + links[i].href + "'; void(0);";
	}
}
