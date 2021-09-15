// Mr. Script v1.3.3
//
// --------------------------------------------------------------------
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.3 or later: http://greasemonkey.mozdev.org/
// To uninstall, go to Tools/Manage User Scripts,
// select "Mr. Script", and click Uninstall.
// Released under the GPL license: http://www.gnu.org/copyleft/gpl.html
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Mr. Script
// @namespace     http://www.noblesse-oblige.org/lukifer/scripts/
// @description	  Version 1.3.3
// @include       http://*kingdomofloathing.com/*
// @include		  http://*127.0.0.1:60*
// @exclude       http://images.kingdomofloathing.com/*
// @exclude       http://forums.kingdomofloathing.com/*
// ==/UserScript==


const VERSION = 133;
const MAXLIMIT = 999;
const ENABLE_QS_REFRESH = 1;
const DISABLE_ITEM_DB = 0;
const ITEMDB_URL = "kol.cmeister2.co.uk/items/?mode=json2";
//const ITEMDB_URL = "noblesse-oblige.org/lukifer/scripts/tempdb.txt";

var thePath = document.location.pathname;
var itemDB = null;


// -----------------------------------------------------------------------------------
// GET/SETPREF: Don't ask why I bothered to write wrapper functions. I just did, okay?
// -----------------------------------------------------------------------------------
function GetDomain()
{	return document.location.host;	}
function SetPref(which, value)
{	GM_setValue("pref." + which, value);}
function GetPref(which)
{	return GM_getValue("pref." + which);}
function SetData(which, value)
{	var server = GetDomain();
	GM_setValue(server.charAt(server.indexOf('.') - 1) + which, value);}
function GetData(which)
{	var server = GetDomain();
	return GM_getValue(server.charAt(server.indexOf('.') - 1) + which);}
function GetPwd()
{	return GM_getValue('hash.' + GetDomain().split('.')[0]);}
function SetPwd(hash)
{	GM_setValue('hash.' + GetDomain().split('.')[0], hash);}
function FindHash()
{	GM_get(GetDomain() + '/store.php?whichstore=m',
	function(blah)
	{	var hashIndex = blah.indexOf("name=phash");
		var hash = blah.substring(hashIndex+18, hashIndex+50);
		SetPwd(hash); });
}
function UpdateItemDB(version)
{	var url = ITEMDB_URL;
	if (version > 0) url += "&version=" + version;
	GM_get(url,function(result)
		{	if (result == "") return;
			SetPref("itemdb",result);
			var addHere = document.getElementsByTagName('table')[0];
			var span = document.createElement('span');
			itemDB = eval('('+result+')');
			span.innerHTML = "<br>Mr. Script: Updated Item Database To Version " + itemDB.version + "<br><br>";
			span.setAttribute("style","font-size:10px;");
			addHere.parentNode.insertBefore(span, addHere);
		});
}
function GetItemDB(force)
{	if (itemDB != null && force == null) return;
	if (DISABLE_ITEM_DB > 0) {itemDB = []; return;}
	var idb = GetPref("itemdb");
	if (idb == undefined || idb == null || idb == "") UpdateItemDB(0);
	else itemDB = eval('('+idb+')');
}


// -----------------------------------------------------------
// FINDMAXQUANTITY: Figure out how many MP restoratives to use
// -----------------------------------------------------------
function FindMaxQuantity(item, howMany, deefault, safeLevel)
{
	var min, max, avg, result;
	var hp = 0;

	switch(parseInt(item))
	{
		case 344: // Knob Goblin Seltzer
			min = 8; max = 12; break;
		case 345: // Knob Goblin Superseltzer
			min = 25; max = 29; break;
		case 347: // Dyspepsi-Cola
			min = 10; max = 14; break;
		case 357: // Mountain Stream Soda
			min = 6; max = 9; break;
		case 465: // Blue Pixel Potion
			min = 55; max = 79; break;
		case 466: // Green Pixel Potion
			min = 31; max = 40; break;
		case 518: // Magical Mystery Juice
			min = 4 + (1.5 * GetData("level")); max = min + 2; break;
		case 593: // Phonics Down
			min = 46; max = 50; break;
		case 592: // Tiny House
			min = 20; max = 24; break;
		case 882: // Blatantly Canadian
			min = 20; max = 25; break;
		case 1003: // Soda Water
			min = 3; max = 5; break;
		case 1334: // Cloaca-Cola
			min = 10; max = 14; break;
		case 1559: // Tonic Water
			min = 30; max = 50; break;
		case 1658: case 1659: case 1660: // Cloaca Cola
			min = 7; max = 9; break;
		case 1788: // Unrefined Mountain Stream Syrup
			min = 50; max = 60; break;
		case 1950: // Tussin
			min = 100; max = 100; break;
		case 1965: // Monsieur Bubble
			min = 45; max = 64; break;
		case 2616: // Magi-Wipes
			min = 50; max = 60; break;
		case 2600: // Lily
			min = 60; max = 69; break;
		case 2576: // Locust
			min = 34; max = 38; break;
		case 2389: case 2437: // Soy! Soy!
			min = 70; max = 80; break;
		case 2639: // Black Cherry
			min = 9; max = 11; break;
		case 2035: // Soda
			min = 30; max = 40; break;
		case 2370: // Sooooooda
			min = 82; max = 120; break;

		case 231: // Doc G's Pungent Unguent
			min = 3; max = 5; hp = 1; break;
		case 232: // Doc G's Ailment Ointment
			min = 8; max = 10; hp = 1; break;
		case 233: // Doc G's Restorative Balm
			min = 13; max = 15; hp = 1; break;
		case 234: // Doc G's Homeopathic Elixir
			min = 18; max = 20; hp = 1; break;
		case 474: // Cast
			min = 15; max = 20; hp = 1; break;
		case 869: // Forest Tears
			min = 5; max = 10; hp = 1; break;
		case 1450: case 1451: case 1452: // Wads
		case 1453: case 1454: case 1455:
			if (howMany > 15) return 15;
			else return howMany; break;
		case 1154: case 1261: // Air, Hatorade
			if (howMany > 3) return 3;
			else return howMany; break;
		case 226: case 2096: // Minotaur, Bee Pollen
			if (howMany > 5) return 5;
			else return howMany; break;

		default:
			if (deefault == 1)
			{	if (howMany > MAXLIMIT) return MAXLIMIT;
				else return howMany;
			} else return 0;
	}

	switch(safeLevel)
	{ 	case 0: avg = (min+max)/2.0; break;
		case 1: avg = ((max*2)+min)/3.0; break;
		case 2: avg = max; break;
	}
	if (hp == 1) result = parseInt(GetData("maxHP")-GetData("currentHP"));
	else		 result = parseInt(GetData("maxMP")-GetData("currentMP"));
	if (result == 0) return 0;
	result = result / avg;
	if (result > howMany) result = howMany;
	if (result > 0)	return parseInt(result);
	else		return 1;
}


// -------------------------------------------------------------------------
// HASITEM: Parse HTML and determine if item is present and return quantity.
// -------------------------------------------------------------------------
function HasItem(itemName, text)
{	var index = text.indexOf(itemName);
	if (index == -1) return 0;
	var quantityText = text.substr(index+itemName.length+4, 12);
	if (quantityText.indexOf('(') != -1)
	{	quantityText = quantityText.split('<')[0];
		quantityText = quantityText.split(')')[0];
		quantityText = quantityText.split('(')[1];
		if (parseInt(quantityText)) return parseInt(quantityText);
		else return 1;
	} else return 1;
}


// ----------------------------------------------------
// GM_GET: Stolen gleefully from OneTonTomato. Tee-hee!
// ----------------------------------------------------
function GM_get(dest, callback)
{	GM_xmlhttpRequest({
	  method: 'GET',
	  url: 'http://' + dest,
	  	//onerror:function(error) { GM_log("GM_get Error: " + error); },
		onload:function(details) {
			if( typeof(callback)=='function' ){
				callback(details.responseText);
}	}	});	}


// ---------------------------------------------------------------
// DESCTOITEM: Convert description ID to item entry from database.
// ---------------------------------------------------------------
function DescToItem(zeedesc)
{	GetItemDB();
	if (zeedesc.indexOf(":") != -1) zeedesc = zeedesc.split(":")[1];
	var sub = zeedesc.substring(9,zeedesc.length-1);
	return itemDB.items[sub];
}


// --------------------------------------------------
// APPENDLINK: Create link and return pointer to span
// --------------------------------------------------
function AppendLink(linkString, linkURL)
{	var fontElement = document.createElement('font');
	fontElement.innerHTML = ' ' + linkString;
	fontElement.setAttribute('size','1');
	var link = document.createElement('a');
	link.setAttribute('href', linkURL);
	link.setAttribute('target', 'mainpane');
	link.appendChild(fontElement);
	var spanElement = document.createElement('span');
	with(spanElement)
	{	innerHTML += ' ';
		appendChild(link);}
	return spanElement;
}


// ---------------------------------------
// APPENDUSEBOX: Attach use multiple form.
// ---------------------------------------
function AppendUseBox(itemNumber, skillsForm, maxButton, appendHere)
{
	var htmlString, form;
	var max = FindMaxQuantity(itemNumber, 999, 0, GetPref('safemax'));

	var form = document.createElement('form');
	form.setAttribute('method','post');

	var action = document.createElement('input');
	action.setAttribute('type','hidden');
	action.setAttribute('name','action');
	action.setAttribute('value','useitem');

	var pwd = document.createElement('input');
	pwd.setAttribute('type','hidden');
	pwd.setAttribute('name','pwd');
	pwd.setAttribute('value',GetPwd());

	var which = document.createElement('input');
	which.setAttribute('type','hidden');
	which.setAttribute('name','whichitem');
	which.setAttribute('value',itemNumber);

	var text = document.createElement('input');
	text.setAttribute('type','text');
	text.setAttribute('class','text');
	text.setAttribute('value','1');
	text.setAttribute('size','2');

	if (autoclear > 0) AddAutoClear(text, autoclear);

	var submit = document.createElement('input');
	submit.setAttribute('type','submit');
	submit.setAttribute('class','button');
	submit.setAttribute('value','Use');

	form.appendChild(action);
	form.appendChild(pwd);
	form.appendChild(which);
	form.appendChild(text);
	form.appendChild(document.createTextNode(' '));
	form.appendChild(submit);

	if (skillsForm == 0)
	{	form.setAttribute('action','multiuse.php');
		text.setAttribute('name','quantity');
		if (maxButton != 0) MakeMaxButton(text, function(event)
		{	var box = document.getElementsByName('quantity')[0];
			box.value = FindMaxQuantity(itemNumber, 999, 0, GetPref('safemax'));
		});
	} else
	{	form.setAttribute('action','skills.php');
		text.setAttribute('name','itemquantity');
		if (maxButton != 0) MakeMaxButton(text, function(event)
		{	var box = document.getElementsByName('itemquantity')[0];
			box.value = FindMaxQuantity(itemNumber, 999, 0, GetPref('safemax'));
		});
	}
	text.addEventListener('keyup', function(event)
	{	if (event.which == 77 || event.which == 88) // 77 = 'm', 88 = 'x'
		{	var whichItem = document.getElementsByName('whichitem')[0];
			this.value = FindMaxQuantity(whichItem.value, 999, 0, GetPref('safemax'));
	}	},false);

	appendHere.appendChild(form);
}


// ---------------------------------------------
// APPENDBUYBOX: Return HTML for buying an item.
// ---------------------------------------------
function AppendBuyBox(itemNumber, whichStore, buttonText, noQuantityBox)
{	var eventString = ""; var htmlString = ""; var quantityString;
	if (noQuantityBox == 1) quantityString = "hidden";
	else quantityString = "text";
	if (autoclear == 2) eventString = " onFocus='this.select();'" +
		"onClick='this.select();' OnDblClick='this.select();'";
	else if (autoclear == 1) eventString = " onFocus=\"javascript:if(this.value==1) this.value='';\" " +
			"onClick=\"javascript:if(this.value==1) this.value='';\" onBlur=\"javascript:if(this.value=='') this.value=1;\" ";

	htmlString =
		"<center><form action=store.php method=post>" +
		"<input type=hidden name=whichstore value=" + whichStore +
		"'><input type=hidden name=buying value='Yep.'>" +
		"<input type=hidden name=phash value='" + GetPwd() +
		"'><input type=" + quantityString + " class=text size=2 value=1 name=howmany" + eventString +
		"> <input type=hidden name=whichitem value=" + itemNumber +
		"><input type=submit class=button value='" + buttonText + "'></form></center>";

	return(htmlString);
}


// ----------------------------------------------------
// NUMBERLINK: Fine, you think of a good function name.
// ----------------------------------------------------
function NumberLink(b)
{	var num = b.textContent.split(' ')[0];
	while(num.indexOf(',') != -1) num = num.split(',')[0] + num.split(',')[1];
	num = parseInt(num);
	if (num < 26)
	{	var txt = b.textContent.substring(b.textContent.indexOf(' '),b.textContent.length);
		var func = "var q = document.getElementsByName(\"quantity\");" +
			"q[0].value=" + num + "; return false;";
		b.innerHTML = "<a href='#' onclick='" + func + "'>" + num + "</a>" + txt;
}	}


// ------------------------------------------------------
// APPENDOUTFITSWAP: Aren't unified interfaces just keen?
// ------------------------------------------------------
function AppendOutfitSwap(outfitNumber, text)
{
	var span = document.createElement('span');
	var button1 = 0; var hidden;

	button1 = document.createElement('input');
	hidden = document.createElement('input');
	button1.setAttribute('type','submit');
	button1.setAttribute('class','button');
	button1.setAttribute('value',text);
	hidden.setAttribute('name','swap');
	hidden.setAttribute('type','hidden');
	hidden.setAttribute('value',outfitNumber);
	button1.addEventListener('click',function(event)
	{	this.setAttribute('disabled','disabled');
		var backup = GetPref('backup');
		var which = document.getElementsByName('swap')[0].getAttribute('value');
		if (which <= 0 || backup == "")
		{	parent.frames[2].location = 'http://' + GetDomain() +
				'/inv_equip.php?action=outfit&which=2&whichoutfit=' + which;
		} else
		{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' + backup,
			function(response)
			{	var which = document.getElementsByName('swap')[0].getAttribute('value');
				parent.frames[2].location = 'http://' + GetDomain() +
					'/inv_equip.php?action=outfit&which=2&whichoutfit=' + which;
			});
		} event.stopPropagation(); event.preventDefault();
	}, true);
	span.appendChild(button1);
	span.appendChild(hidden);

	// Revert to backup
	if (outfitNumber == 0)
	{	GM_get(GetDomain() + "/account_manageoutfits.php", function(response)
		{	var swap = document.getElementsByName('swap')[0];
			var val; var index2; var backup = GetPref('backup');
			var index = response.indexOf(' value="' + backup + '"');
			if (index != -1) index = response.indexOf('name=delete',index) + 11;
			if (index != -1) index2 = response.indexOf('>',index);
			if (index != -1 && index2 != -1)
			{	val = '-' + response.substring(index,index2);
				swap.setAttribute('value',val);
			} else
			{	swap.parentNode.firstChild.setAttribute('disabled','disabled');
				swap.parentNode.firstChild.setAttribute('value','Backup Outfit Unavailable');
			}
		});
	} return span;
}


// -------------------------------------------------------------------------------------------
// ADDINVCHECK: Display extra links and such for items, independently of where they're displayed.
// -------------------------------------------------------------------------------------------
function AddInvCheck(img)
{	// Special thanks to CMeister for the item database and much of this code
	if (img != undefined && img.getAttribute("onclick").indexOf("desc") != -1)
	{	img.addEventListener('contextmenu', function(event)
		{	if (this.getAttribute("done")) return;
			GetItemDB(); if (itemDB == null) return;
			item = DescToItem(this.getAttribute("onclick"));
			var add = "<br><span class='tiny' id='span" + item['itemid'] + "'></span>";
			this.parentNode.nextSibling.innerHTML += add;
			var invpage = item['invpage'];
			if (item['itemid'] == 518) invpage = 1; // Mmm, hacky

			GM_xmlhttpRequest({method: 'GET',
				url: 'http://' + GetDomain() + '/inventory.php?which='+invpage,
				item: item,
				onload:function(details) {
					var quant = HasItem(item['name'],details.responseText);
					var itemid = item['itemid'];
					var addText = "";

					if (itemid == 1605)
					{	var reagents = HasItem("scrumptious reagent", details.responseText);
						var solutions = HasItem("scrumdiddlyumptious solution", details.responseText);
						addText = "(" + reagents + " reagent"; if (reagents != 1) addText += "s";
						addText += ", " + quant + " catalyst"; if (quant != 1) addText += "s";
						addText += " and " + solutions + " scrummie"; if (solutions != 1) addText += "s";
						addText += " in inventory)";
					}
					else if (itemid == 1549)
					{	var noodles = HasItem("dry noodles", details.responseText);
						addText = "(" + noodles + " noodle"; if (noodles != 1) addText += "s";
						addText += " and " + quant + " MSG"; if (quant != 1) addText += "s";
						addText += " in inventory)";
					}
					else addText = '('+quant+' in inventory)';

					document.getElementById('span'+item['itemid']).innerHTML += addText;
				}
			}); this.setAttribute("done","done"); event.stopPropagation(); event.preventDefault();
		}, false);
}	}


// ----------------------------------------------------------
// ADDTOPLINK: Much easier for a function to do all the work.
// ----------------------------------------------------------
function AddTopLink(putWhere, target, href, html, space)
{
	if (href == "") return;
	var a = document.createElement('a');
	if (target != 0) a.setAttribute('target', target);
	a.setAttribute('href', href);
	a.innerHTML = html;
	putWhere.appendChild(a);
	if (space) putWhere.appendChild(document.createTextNode(" "));
}


// -------------------------------------------------------------------------------------------
// ADDLINKS: Display extra links and such for items, independently of where they're displayed.
// -------------------------------------------------------------------------------------------
function AddLinks(descId, theItem, formWhere, path)
{
	// Special thanks to CMeister for the item database and much of this code
	itemNum = DescToItem(descId)['itemid'];
	AddInvCheck(theItem.firstChild.firstChild);

	doWhat = 0; addWhere = theItem.childNodes[1];
	switch(parseInt(itemNum))
	{
		case 518: case 344: case 2639:
		case 1658: case 1659: case 1660:
			doWhat = 'skill'; break;

		case 1605: case 687: case 744: case 2595:
		case 14: case 15: case 16: case 1261:
		case 341: case 340: case 343: case 1512: case 1513: case 1514: case 1515:
		case 196: case 1290:
			doWhat = 'use'; break;

		case 634: case 21: case 59: case 33: case 20: case 22: case 71:
		case 1465: case 1466: case 1467: case 1468: case 1469: case 1470:
		case 1471: case 1472: case 1473: case 1474: case 1475: case 1476:
		case 1477: case 1478: case 1479: case 1480: case 1481: case 1482:
		case 1483: case 1484: case 2302:
			doWhat = 'equip'; break;

		case 1916: case 486:
			doWhat = 'equipacc'; break;

		case 1650: case 69: case 829: case 1274: case 2660:
		case 2258: case 1794: case 678: case 146: case 440: case 438:
		case 2344: case 2345: case 2346:
			doWhat = 'oneuse'; break;

		case 55:
			doWhat = 'cook'; break;

		case 247:
			doWhat = 'cocktail'; break;

		case 1445: case 1446: case 1447: case 1448: case 1449:
			addWhere.appendChild(AppendLink('[cook]','cook.php'));
		case 1438: case 1439: case 1440: case 1441: case 1442: case 1443: case 1444:
			doWhat = 'malus'; break;

		case 727: // Hedge
			addWhere.appendChild(AppendLink('[maze]', 'hedgepuzzle.php')); break;
		case 2267: // Mega Gem
			addWhere.appendChild(AppendLink('[equip]', 'inv_equip.php?pwd='+
				GetPwd() + '&which=2&action=equip&whichitem=2267&slot=2')); break;
		case 2052: // Blackbird
			addWhere.appendChild(AppendLink('[fly]', 'inv_familiar.php?pwd=' +
				GetPwd() + '&whichitem=2052')); break;
		case 1549: // MSG
			addWhere.appendChild(AppendLink('[bam!]', 'guild.php?place=wok')); break;
		case 23: // gum
			if (document.referrer.indexOf('sewer') != -1 && path == "/store.php")
				parent.frames[2].location = 'http://' + GetDomain() + '/sewer.php';
			else addWhere.appendChild(AppendLink('[sewer]', 'sewer.php')); break;
		case 42: // permit
			if (document.referrer.indexOf('hermit') != -1 && path == "/store.php")
				parent.frames[2].location = 'http://' + GetDomain() + '/hermit.php';
			else addWhere.appendChild(AppendLink('[hermit]', 'hermit.php')); break;
		case 1003: // soda
			addWhere.appendChild(AppendLink('[mix]', 'cocktail.php'));
			addWhere.appendChild(AppendLink('[still]', 'guild.php?place=still')); break;
		case 40: // casino
			if (document.referrer.indexOf('casino') != -1 && path == "/store.php")
				parent.frames[2].location = 'http://' + GetDomain() + '/casino.php';
			else addWhere.appendChild(AppendLink('[casino]', 'casino.php')); break;
		case 236: // cocktail
			if (document.referrer.indexOf('cocktail') != -1 && path == "/store.php")
				parent.frames[2].location = 'http://' + GetDomain() + '/cocktail.php';
			else doWhat = 'cocktail'; break;
		case 157: // E-Z
			if (document.referrer.indexOf('cook') != -1 && path == "/store.php")
				parent.frames[2].location = 'http://' + GetDomain() + '/cook.php';
			else doWhat = 'cook'; break;
		case 530: // spray paint
			addWhere.appendChild(AppendLink('[the wall]', 'town_grafwall.php')); break;
		case 24: // Clover
			addWhere.appendChild(AppendLink('[disassemble]', 'multiuse.php?pwd=' +
			GetPwd() + '&action=useitem&quantity=1&whichitem=24')); break;
		case 140: // Planks
			addWhere.appendChild(AppendLink('[boat]', 'inv_use.php?pwd=' +
			GetPwd() + '&which=3&whichitem=146')); break;
		case 47: // Roll
			addWhere.appendChild(AppendLink('[casino]','casino.php'));
			addWhere.appendChild(AppendLink('[rock+roll]',
			'combine.php?action=combine&item1=47&item2=30&pwd=' +
			GetPwd() + '&quantity=1')); GoGoGadgetPlunger(); break;
		case 52: // Strings
			addWhere.appendChild(AppendLink('[twang]',
			'combine.php?action=combine&item1=52&item2=30&pwd=' +
			GetPwd() + '&quantity=1')); GoGoGadgetPlunger(); break;
		case 135: // Rims
			addWhere.appendChild(AppendLink('[wheels]',
			'combine.php?action=combine&item1=135&item2=136&pwd=' +
			GetPwd() + '&quantity=1')); GoGoGadgetPlunger(); break;
		case 2044: // MacGuffin
			addWhere.appendChild(AppendLink('[read]',"diary.php?textversion=1")); break;
		case 485: // Talisman
			addWhere.appendChild(AppendLink('[man, o nam]',
			'combine.php?action=combine&item1=485&item2=485&pwd=' +
			GetPwd() + '&quantity=1')); GoGoGadgetPlunger(); break;
	}

	if (doWhat == 'equip')
		addWhere.appendChild(AppendLink('[equip]', 'inv_equip.php?pwd='+
			GetPwd() + '&which=2&action=equip&whichitem=' + itemNum));
	else if (doWhat == 'equipacc')
		addWhere.appendChild(AppendLink('[equip]', 'inv_equip.php?pwd='+
			GetPwd() + '&which=2&action=equip&whichitem=' + itemNum + "&slot=3"));
	else if (doWhat == 'oneuse')
	{	addWhere.appendChild(AppendLink('[use]','inv_use.php?pwd=' +
			GetPwd() + '&which=1&whichitem='+itemNum));
	} else if (doWhat == 'use')
	{	if (formWhere != null) AppendUseBox(itemNum, 0, 0, formWhere);
		else addWhere.appendChild(AppendLink('[use]', 'multiuse.php?pwd=' +
			GetPwd() + '&action=useitem&quantity=1&whichitem='+itemNum));
	} else if (doWhat == 'skill')
	{	if (formWhere != null) AppendUseBox(itemNum, 1, 1, formWhere);
		else addWhere.appendChild(AppendLink('[use]', 'skills.php?pwd=' +
			GetPwd() + '&action=useitem&quantity=1&whichitem='+itemNum));
	} else if (doWhat == 'malus')
	{	addWhere.appendChild(AppendLink('[malus]', 'guild.php?place=malus'));
	} else if (doWhat != 0)
		addWhere.appendChild(AppendLink('['+doWhat+']',doWhat+'.php'));

	return doWhat;
}


// -------------------------------------------------
// RIGHTCLICKMP: Fill up with standard restoratives.
// -------------------------------------------------
function RightClickMP(event)
{	json = GetData("mplist");
	if (json != undefined && json != "")
	{	var json
		var num = 0; var quant = 0; var list = eval('('+json+')');
			 if (list['518'])  num = "518";
		else if (list['344'])  num = "344";
		else if (list['2639']) num = "2639";
		else if (list['1658']) num = "1658";
		else if (list['1659']) num = "1659";
		else if (list['1660']) num = "1660";
		if (num > 0)
		{	quant = FindMaxQuantity(parseInt(num), list[num], 0, GetPref("safemax"));
			var url = GetDomain()+'/skills.php?action=useitem&whichitem='+num+"&itemquantity="+quant+'&pwd='+GetPwd();
			GM_get(url, function(result)
				{	document.location.reload(); });
	}	} event.stopPropagation(); event.preventDefault(); return false;
}




// ----------------------------------------------------------------------------
// PARSESELECTQUANTITY: Figure out how many of a given restorative are present.
// ----------------------------------------------------------------------------
function ParseSelectQuantity(selectItem, endToken)
{	var index = selectItem.selectedIndex;
	var howMany = 1;
	if (selectItem.options[index].textContent.indexOf("(") != -1)
	{	howMany = selectItem.options[index].textContent;
		if (howMany.charAt(0) == '(') return 999999;
		howMany = howMany.split("(")[1];
		howMany = howMany.split(endToken)[0];
	} return parseInt(howMany);
}


// ----------------------------------------------------------------------------------
// MAKEMAXBUTTON: Jesus, just how many functions am I going to create for this thing?
// ----------------------------------------------------------------------------------
function MakeMaxButton(textField, funktion)
{
	var img = document.createElement('img');
	var table = document.createElement('table');
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	var stizzyle = 'border: 1px solid black; border-left: 0px; padding: 0px;';

	img.setAttribute('src',
	'data:image/gif;base64,R0lGODlhCQAQAPAAMf%2F%2F%2FwAAACwAAAAACQAQAAACGgSCaGvB7d6KM1HJLHa3nZxg2%2FRwo2RmJFAAADs%3D');

	img.addEventListener('click', funktion, false);

	img.addEventListener('mousedown', function(event)
	{	this.parentNode.setAttribute('style', "background-color:#999999; " + stizzyle); },false);
	img.addEventListener('mouseup', function(event)
	{	this.parentNode.setAttribute('style', "background-color:#ffffff; " + stizzyle); },false);

	// I am a horrible, horrible hack. If anyone knows how to make it
	// impossible to drag the max image into the text box, I'm all ears.
	textField.addEventListener('mouseover', function(event)
	{	if (this.value.length > 5) this.value = "1"; },false);

	table.setAttribute('style','display: inline; vertical-align: bottom; border-spacing: 0px; padding: 0;');
	td1.setAttribute('style','border: 1px solid black; padding: 1px;');
	td2.setAttribute('style', stizzyle);
	table.appendChild(tr);
	tr.appendChild(td1);
	tr.appendChild(td2);
	textField.setAttribute('style','border: none;');
	textField.parentNode.insertBefore(table,textField);
	td1.appendChild(textField);
	td2.appendChild(img);
}


// ----------------------------------------------------------------------------------------
// SKILLUSELIMIT: I don't feel like putting a description here, so I'm not gonna. So there.
// ----------------------------------------------------------------------------------------
function SkillUseLimit(skillNum)
{	var limit = 999999; var min = 0; var max = 0;
	var safeLevel = GetPref('safemax');
	switch(parseInt(skillNum))
	{	case 16: case 17: case 30012: limit = 1; break;
		case 3006: case 4006: case 5014: limit = 5; break;
		case 3009: min=10; max=30; break;
		case 1007: min=10; max=20; break;
		case 1010: min=30; max=40; break;
		case 5011: min=40; max=40; break;
		case 5007: min=20; max=20; break;
	} if (max != 0)
	{	var hp = GetData("maxHP") - GetData("currentHP");
		switch(safeLevel)
		{ 	case 0: limit = parseInt(0.5+hp/((min+max)/2.0)); break;
			case 1: limit = parseInt(0.5+hp/(((max*2)+min)/3.0)); break;
			case 2: limit = parseInt(0.5+hp/max); break;
	}	} return limit;
}


// ---------------------------------------------
// ONFOCUS: Make text input boxes clear on focus
// ---------------------------------------------
function AddAutoClear(box, setting)
{	if (setting == 2)
	{	box.setAttribute('onFocus', 'this.select();');
		box.setAttribute('onClick', 'this.select();');
		box.setAttribute('OnDblClick', 'this.select();');
	} else if (setting == 1)
	{	box.setAttribute('onFocus', 'if(this.value==1) this.value="";');
		box.setAttribute('onClick', 'if(this.value==1) this.value="";');
		box.setAttribute('onBlur',  'if(this.value=="") this.value=1;');
}	}

var autoclear = GetPref('autoclear');
if (autoclear > 0)
{	var derp; var textBoxes = document.getElementsByTagName('input');
	for (var i=0, len=textBoxes.length; i<len; i++)
	{	derp = textBoxes[i];
		if (derp.type == "text" && derp.value == "1")
			AddAutoClear(derp, autoclear);
}	}


// -----------------------------------------------------------
// GOGOGADGETPLUNGER: Convert meat-paste links to The Plunger.
// -----------------------------------------------------------
function GoGoGadgetPlunger()
{	GM_get(GetDomain() + "/knoll.php",function(response)
	{	if (response != "")
		{	for (var i=0, len=document.links.length; i<len; i++)
			{	var temp = document.links[i].getAttribute('href');
				if (temp.indexOf("combine.php") != -1)
				{	if (temp.indexOf("?") == -1)
						document.links[i].setAttribute("href",
						temp.replace("combine.php","knoll.php?place=paster"));
					else
						document.links[i].setAttribute("href",
						temp.replace("combine.php","knoll.php"));
					break;
	}	}	}	});
}


// -----------------------------------------
// FIGHT: Add stuffy-stuff to dropped items.
// -----------------------------------------
if (thePath == "/fight.php" || thePath == "/choice.php" || thePath == "/shore.php" || thePath == "/adventure.php"
	|| thePath == "/cook.php" || thePath == "/mix.php" || thePath == "/combine.php" || thePath == "/knoll.php")
{	if (thePath == "/fight.php" && (document.links.length == 0 || document.images.length < 1)) return;
	for (i=0,len=document.images.length; i<len; i++)
	{	var img = document.images[i];
		var onclick = img.getAttribute("onclick");
		if (onclick != undefined && onclick.indexOf("desc") != -1)
			AddLinks(onclick, img.parentNode.parentNode, null, thePath);
	}
}
if (thePath == "/mallstore.php")
{	var img = document.images[0];
	var onclick = img.getAttribute("onclick");
	if (onclick != undefined && onclick.indexOf("desc") != -1)
		AddLinks(onclick, img.parentNode.parentNode, img.parentNode.parentNode.parentNode.parentNode.parentNode, thePath);

	for (i=1,len=document.images.length; i<len; i++)
	{	img = document.images[i];
		onclick = img.getAttribute("onclick");
		if (onclick != undefined && onclick.indexOf("desc") != -1)
			AddInvCheck(img);
	}
}


// -----------------------------------------------
// MAIN: Look for updates and post link if needed.
// -----------------------------------------------
if (thePath == "/main.php")
{	var lastUpdated = parseInt(GM_getValue('MrScriptLastUpdate', 0));
	var currentHours = parseInt(new Date().getTime()/3600000);
	GetItemDB();

	// If over 4 hours, check for updates
	if ((currentHours - lastUpdated) > 4)
	{
		GM_get("noblesse-oblige.org/lukifer/scripts/MrScript.version.txt", function(txt)
		{	var versionNumber = txt.split(',')[0].replace('.','').replace('.','');
			var txtSplit = txt.split(',');
			if (parseInt(versionNumber,10) <= VERSION)
			{	GM_setValue('MrScriptLastUpdate', parseInt(new Date().getTime()/3600000)); return;
			}
			// If we're still here, then we need an update link.
			var uLink = document.createElement('a');
			if (txtSplit[2] != undefined) uLink.innerHTML = txtSplit[2];
			else uLink.innerHTML = "Update";
			uLink.setAttribute('target', '_blank');
			uLink.setAttribute('href', txtSplit[1]);
			var span = document.createElement('span');
			span.setAttribute('style','font-size:12px;text-decoration:none');
			span.appendChild(document.createTextNode("Mr. Script v" + txtSplit[0] + " is available!"));
			span.appendChild(document.createElement('br')); span.appendChild(document.createElement('br'));
			span.appendChild(uLink);
			if (txtSplit[4] != "" && txtSplit[3] != undefined)
			{	var uLink2 = document.createElement('a');
				uLink2.innerHTML = txtSplit[4];
				uLink2.setAttribute('target', '_blank');
				uLink2.setAttribute('href', txtSplit[3]);
				span.appendChild(document.createTextNode(' - '));
				span.appendChild(uLink2);
			}
			span.appendChild(document.createElement('br'));
			span.appendChild(document.createElement('br'));
			addHere = document.getElementsByTagName('table')[0];
			addHere.parentNode.insertBefore(span, addHere);
		});

		// Update item database
		if (itemDB.version != undefined) UpdateItemDB(itemDB.version);
	}
}


// ---------------------------------------------------------
// MAIN.HTML: Resize top pane a bit and store password hash.
// ---------------------------------------------------------
if (thePath == "/main.html")
{	window.setTimeout("f=document.getElementsByTagName('frameset')[1]; f.setAttribute('rows','53,*');",50);
/*	var frames = document.getElementsByTagName('frameset')
	for (var i=0, len=frames.length; i<len; i++)
	{	if (frames[i].getAttribute('id') == 'menuset')
		{	frames[i].rows = "53,*";
			break;
	}	} */
}
if (thePath == "/main_c.html" || thePath == "/main.html")
{	FindHash();
	window.setTimeout("if (frames[0].location == 'about:blank') frames[0].location='topmenu.php';",1500);
}


// -----------------------------------------------------------------------------------------------
// LOGGEDOUT: Clear pashword hash for security. It should be useless already, but just to be safe.
// -----------------------------------------------------------------------------------------------
else if (thePath == "/loggedout.php")
{	SetPwd(0);}


// -------------------------------------------------------------------
// EQUIPUPDATE: This is silly, but the alternatives were even sillier.
// -------------------------------------------------------------------
function EquipUpdate(txt, itm)
{	var equipped = txt.indexOf("You equip");
	var zel = document.getElementsByTagName('select')[itm];
	var giftd = zel.parentNode.previousSibling;
	if (equipped != -1)
	{	while (txt.charAt(equipped) != ">") equipped++; equipped++;
		var start = txt.indexOf('img src')+9;
		var end = start+30; while (txt.charAt(end) != '"') end++;
		var zoik = txt.substring(start, end);
		var dscsplit = txt.split(zoik)[2];
		var dscstart = dscsplit.indexOf("descitem")+9;

		// New image
		if (giftd.childNodes.length > 0)
		{	giftd.firstChild.setAttribute('src',zoik);
			giftd.firstChild.setAttribute('onclick','descitem('+dscsplit.substring(dscstart,dscstart+9)+');');
		} /*else // No image. Garg.
		{	giftd.innerHTML += '<img src="'+zoik+'" class=hand onClick="descitem('+
				dscsplit.substring(dscstart,dscstart+9)+');">';
		}*/

		// Change power and add unequip
		var oontd = zel.parentNode; // still my favorite variable name
		var pwr = "";
		if (itm < 3 || item == 5)
		{	var pwrstart = dscsplit.indexOf("(Pow");
			var pwrend = pwrstart+6; while (dscsplit.charAt(pwrend) != ')') pwrend++; pwrend++;
			pwr = dscsplit.substring(pwrstart, pwrend);
			if (itm == 2)
			{	var oh = document.getElementsByTagName('select')[itm+1];
				if (pwr.indexOf("1h") != -1)
				{	//zel.setAttribute('hands','1');
					//oh.removeAttribute('disabled');
					if (oontd.childNodes.length > 3 && oontd.childNodes[3].innerHTML.indexOf("1h") == -1)
						top.frames[2].location.reload(); // Dammit.
				} else
				{	zel.setAttribute('hands','2');
					if (oh.firstChild.value != 0)
					{	oh.appendChild(document.createElement('option'));
						oh.firstChild.value = 0;
					} oh.selectedIndex = 0;
					oh.parentNode.previousSibling.innerHTML = "";
					oh.setAttribute('disabled','disabled');
			}	}
			if (oontd.childNodes.length > 3) oontd.childNodes[3].textContent = pwr;
		}
		if (oontd.childNodes.length < 3)
		{	var unq = ["hat","shirt","weapon","offhand","pants","acc1","acc2","acc3","familiarequip"];
			var sigh = document.createElement('font');
			sigh.setAttribute('size','1');
			if (pwr != "") pwr = " " + pwr;
			sigh.innerHTML = pwr+' <a href="inv_equip.php?pwd='+GetPwd()+'&which=2&action=unequip&type='+unq[itm]+'">[unequip]</a>';
			oontd.appendChild(sigh);
		}
	} else
	{	zel.setAttribute('value',zel.getAttribute('previtem'));
		var zoik = zel.getAttribute('previmg')
		if (zoik != 0) giftd.firstChild.setAttribute('src',zoik);
		else giftd.removeChild(giftd.firstChild);
}	}


// -----------------------------------------------
// INVENTORY: Add shortcuts when equipping outfits
// -----------------------------------------------
if (thePath == "/inventory.php")
{
	var firstTable = document.getElementsByTagName('table')[0];
	var backup = GetPref('backup');

	var gearpage = 0; // Man, this is annoying.
	if (document.location.search.indexOf("which=2") != -1) gearpage = 1;
	else if (document.links[0].search == "?which=1" && document.links[1].search == "?which=3") gearpage = 1;

	// Equipment page only
	if (gearpage == 1)
	{	var selecty = document.getElementsByTagName('select')[0];
		if (backup != '')
		{	for (var i=0, len=document.links.length; i<len; i++)
			{	var unlink;
				if (document.links[i].text == "[unequip all]" || document.links[i].text == "Manage your Custom Outfits")
				{
					var yetAnotherVariable = 1;
					if (document.links[i].text != "Manage your Custom Outfits") unlink = document.links[i];
					else
					{	yetAnotherVariable = 0;
						unlink = selecty.parentNode.previousSibling;
						unlink.firstChild.appendChild(document.createElement('tr'));
						unlink.firstChild.lastChild.appendChild(document.createElement('td'));
						unlink = unlink.firstChild.lastChild.lastChild;
						unlink.setAttribute('align','center');
						unlink.setAttribute('colspan','3');
						unlink.appendChild(document.createElement('font'));
						unlink = unlink.firstChild;
						unlink.setAttribute('size','1');
						unlink.appendChild(document.createTextNode(' '));
						unlink = unlink.lastChild;
					}
					if (yetAnotherVariable == 1)
					{	var newlink = document.createElement('a');
						newlink.innerHTML = "[backup]";
						newlink.href = "#";
						newlink.addEventListener('contextmenu',function(event)
						{	alert('pow!');}, false);
						newlink.addEventListener('click',function(event)
						{	this.innerHTML = "[backing up...]";
							GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' + GetPref('backup'),
							function(response)
							{	for (var i=0, len=document.links.length; i<len; i++)
								{	if (document.links[i].text.indexOf("...") != -1)
									{	if (response.indexOf("custom outfits") == -1)
											document.links[i].innerHTML = "[done]";
										else document.links[i].innerHTML = "[too many outfits]";
										break;
							}	}	}); event.stopPropagation(); event.preventDefault();
						}, false);
						unlink.parentNode.insertBefore(newlink,unlink);
						unlink.parentNode.insertBefore(document.createTextNode(" - "),unlink);
					}

					// Save contents of outfit menu
					var nunewlink; var opty; var backupName = "Custom: " + backup;
					for (var i=1, len=selecty.options.length; i<len; i++)
					{	opty = selecty.options[i];
						if (opty.text == backupName)
						{	nunewlink = document.createElement('a');
							nunewlink.innerHTML = "[revert to " + backup.toLowerCase() + "]";
							nunewlink.href = "inv_equip.php?action=outfit&which=2&whichoutfit=" + opty.value;
							nunewlink.addEventListener('contextmenu',function(event)
							{	alert('powee!');}, false);
					}	}

					if (nunewlink) unlink.parentNode.insertBefore(nunewlink,unlink);
					if (yetAnotherVariable == 1) unlink.parentNode.insertBefore(document.createTextNode(" - "),unlink);
					break;
		}	}	}

		var quickequip = GetPref("quickequip");
		var lnks = document.links; var shelf;

		var equipTypeToNum =
		{"hat":0,"shirt":1,"weapon":2,"offhand":3,"pants":4,
		"acc1":5,"acc2":6,"acc3":7,"familiarequip":8};

		var equipTypeToName =
		{"hat":"Hat:","shirt":"Shirt:","weapon":"Weapon:","offhand":"Off-Hand:","pants":"Pants:",
		"acc1":"Accessory&nbsp;1:","acc2":"Accessory&nbsp;2:","acc3":"Accessory&nbsp;3:","familiarequip":"Familiar&nbsp;Equipment:"};

		var shelfToNum =
		{"Hats:":0,"Shirts:":1,"Melee Weapons:":2,"Ranged Weapons:":2,"Mysticality Weapons:":2,
		"Weapons:":2,"Off-Hand Items:":3,"Pants:":4,"Accessories:":5,"Familiar Equipment:":8};

		var equips = []; var selects = []; var curgear = []; var curgearnum = []; var hands = 1;
		GetItemDB();

		// Get currently equipped items
		var nxt;
		var gearList = selecty.parentNode.previousSibling.firstChild;

		for (var i=0, len=gearList.childNodes.length; i<len; i++)
		{	var tr = gearList.childNodes[i];

			if (tr.childNodes.length < 2) break;
			if (tr.childNodes[0].innerHTML.length == 0) continue;

			var equiptype;
			var unequipNodes = tr.childNodes[2].getElementsByTagName('a');

			if (unequipNodes && unequipNodes.length > 0)
			{
				var unequiplink = unequipNodes[0].href;
				equiptype = unequiplink.substring(unequiplink.indexOf('type=')+5, unequiplink.length);
			}
			else
			{
				equiptype = nxt;
				nxt = "";
			}

			var equipnum = parseInt(equipTypeToNum[equiptype]);

			var jump = equipnum; // ...might as well
			if (jump > 5 && jump < 8) jump = 5;
			tr.firstChild.innerHTML = "<a class='nounder' href='#equipjump" + jump + "'>"+equipTypeToName[equiptype]+"</a>";

			if (quickequip < 1 || !tr.childNodes[1]) continue;

			// See if we're missing a slot
			if (equiptype == "hat") nxt = "shirt";
			else if (equiptype == "weapon") nxt = "offhand";
			else if (equiptype == "pants") nxt = "acc1";
			else if (equiptype == "acc1") nxt = "acc2";
			else if (equiptype == "acc2") nxt = "acc3";
			else nxt = "";

			// Store item number and name of currently equipped item.

			if (tr.childNodes[1].firstChild && tr.childNodes[1].firstChild.getAttribute('class') == 'hand')
			{	if (equipnum == 2 && tr.childNodes[2].textContent.indexOf("1h") == -1) hands = 2
				equips[equipnum] = tr.childNodes[2];
				var pic = tr.childNodes[1].firstChild;
				if (pic != undefined)
				{	var piclic = pic.getAttribute('onclick');
					if (piclic != undefined)
					{	curgear[equipnum] = DescToItem(piclic)['name'];
						curgearnum[equipnum] = DescToItem(piclic)['itemid'];
			}	}	}

			// Item slot is empty
			else
			{	curgear[equipnum] = "";
				curgearnum[equipnum] = 0;
				tr.insertBefore(document.createElement('td'), tr.childNodes[1]);
				equips[equipnum] = tr.childNodes[2];
				blank = 1;
			}

			// Create select menus
			var newsel = document.createElement('select');
			newsel.setAttribute('style',"width:250px;");
			newsel.setAttribute('name',equiptype);
			if (equipnum == 3 && hands == 2) newsel.setAttribute('disabled','disabled');
			if (curgearnum[equipnum] != 0) newsel.appendChild(document.createElement('option'));
			selects[equipnum] = newsel;

			// Add the next slot if it's missing
			if (nxt != "" && tr.nextSibling.innerHTML.indexOf(nxt) == -1)
			{	var newtr = document.createElement('tr');
				if (nxt == "shirt") {newtr.setAttribute('style','display:none;');}
				newtr.appendChild(document.createElement('td'));
				newtr.appendChild(document.createElement('td'));
				newtr.appendChild(document.createElement('td'));

				newtr.childNodes[0].setAttribute('align','right');
				newtr.childNodes[0].innerHTML = equipTypeToName[nxt];
				newtr.childNodes[1].setAttribute("height","30");
				newtr.childNodes[1].innerHTML = "<b> </b>";

				gearList.insertBefore(newtr, tr.nextSibling);
				len++; tr = gearList.childNodes[i];
			}
		}

		// Iterate through links
		for (var i=0, len=lnks.length; i<len; i++)
		{	var lnk = lnks[i];

			// Switch to new shelf, and add anchor
			if (lnk.href.charAt(0) == 'j')
			{	var newshelf = shelfToNum[lnk.text];
				//if (newshelf > shelf) selects[shelf].setAttribute('gearfound','gearfound');
				shelf = newshelf;
				lnk.parentNode.innerHTML += "<a name='equipjump"+newshelf+"'></a>";
			}
			if (quickequip < 1) continue;

			// Unequip inline
			if (lnk.text == "[unequip]")
			{	var url = lnk.href;
				lnk.addEventListener("click", function(event)
				{	var url = this.href;
					if (url.indexOf("http://") != -1) url = url.substring(7,url.length);
					GM_get(url, function(blah){});
					this.parentNode.firstChild.selectedIndex = 0;
					this.parentNode.previousSibling.innerHTML = ""; this.innerHTML = "";
					this.previousSibling.previousSibling.innerHTML = "";
					event.stopPropagation(); event.preventDefault(); return false;
				}, true);
			}

			// Add equippable item to drop-down of current shelf.
			else if (lnk.text == "[equip]" || lnk.text == "[offhand]")
			{	var theSel; var itemText = lnk.parentNode.parentNode.firstChild.innerHTML;

				// Three iterations for accessories.
				var limit = 1; if (shelf == 5) limit = 3;
				for (var j=0; j<limit; j++)
				{	var zshelf; if (lnk.text == "[offhand]") zshelf = 3;
					else zshelf = shelf+j;
					theSel = selects[zshelf];
					if (theSel == undefined) continue;

					// Create the select menu option
					var opt = document.createElement("option");
					opt.setAttribute("value",lnk.href.split("item=")[1]);
					opt.innerHTML = itemText;

					// Add the currently worn item to the menu, if necessary
					if (!theSel.getAttribute("gearfound"))
					{	var curText = curgear[zshelf].toLowerCase();
						var tstText = itemText.toLowerCase();
						if (tstText == curText) selects[zshelf].setAttribute('gearfound','gearfound');
						else if (tstText > curText || lnks[i+1] == undefined || lnks[i+1].href.indexOf(":t") != -1)
						{	var opt2 = document.createElement("option");
							opt2.setAttribute("value",curgearnum[zshelf]);
							opt2.innerHTML = curgear[zshelf];
							theSel.appendChild(opt2);
							theSel.setAttribute('gearfound','gearfound');
					}	 }

					theSel.appendChild(opt);
				}
			}
		}

		// Add the select menus to the DOM and select the currently worn item
		if (quickequip > 0)
		{	for (var i=0, len=equips.length; i<len; i++)
			{	var eq = equips[i]; if (eq == undefined || eq == 0) continue;
				var eqnum = equipTypeToNum[eq.parentNode.firstChild.innerHTML];
				var tempsel = selects[i]; var nuus = [];
				for (var j=0, len2=tempsel.childNodes.length; j<len2; j++)
				{
					if (tempsel.childNodes[j].value == curgearnum[i])
					{	tempsel.selectedIndex = j; break;
				}	}

				// Attach event handler that does the work
				tempsel.addEventListener('change',function(event)
				{	if (this.value == 0) return;
					var loading = "data:image/gif;base64,R0lGODlhEgASAJECAMDAwNvb2%2F%2F%2F%2FwAAACH%2FC05"+
"FVFNDQVBFMi4wAwEAAAAh%2BQQFCgACACwAAAAAEgASAAACMpSPqQmw39o7IYjo6qpacpt8iKhoITiiG0qWnNGepjCv7u3WMfxqO0%2Fr"+
"qVa1CdCIRBQAACH5BAUKAAIALAcAAQAIAAYAAAIOVCKZd2osAFhISmcnngUAIfkEBQoAAgAsCwADAAYACAAAAg5UInmnm4ZeAuBROq%2B"+
"tBQAh%2BQQFCgACACwLAAcABgAIAAACD5QTJojH2gQAak5jKdaiAAAh%2BQQFCgACACwHAAsACAAGAAACDpQdcZgKIFp4Lzq6RF0FACH5"+
"BAUKAAIALAMACwAIAAYAAAIOFCCZd2osQlhISmcnngUAIfkEBQoAAgAsAQAHAAYACAAAAg4UIHmnm4ZeCuFROq%2BtBQAh%2BQQFCgACA"+
"CwBAAMABgAIAAACD5QBJojH2kQIak5jKdaiAAA7";
					this.setAttribute('previtem',this.value);
					var imgtd = this.parentNode.previousSibling;
					if (imgtd.childNodes.length > 0)
					{	this.setAttribute('previmg',imgtd.firstChild.src);
						imgtd.firstChild.setAttribute("src",loading);
					} else
					{	this.setAttribute('previmg',0); imgtd.innerHTML = '<img src="'+loading+'" class=hand>';
					}
					var ztype = equipTypeToNum[this.getAttribute('name')];
					var action = "equip";
					if (ztype == 3) action = "dualwield";
					var url = GetDomain()+"/inv_equip.php?pwd="+GetPwd()+"&which=2&action="+action+"&whichitem="+this.value;
					if (ztype == 5) url += "&slot=1";
					else if (ztype == 6) url += "&slot=2";
					else if (ztype == 7) url += "&slot=3";
					switch(ztype)
					{	case 0: GM_get(url, function(t){EquipUpdate(t,0);}); break;
						case 1: GM_get(url, function(t){EquipUpdate(t,1);}); break;
						case 2: GM_get(url, function(t){EquipUpdate(t,2);}); break;
						case 3: GM_get(url, function(t){EquipUpdate(t,3);}); break;
						case 4: GM_get(url, function(t){EquipUpdate(t,4);}); break;
						case 5: GM_get(url, function(t){EquipUpdate(t,5);}); break;
						case 6: GM_get(url, function(t){EquipUpdate(t,6);}); break;
						case 7: GM_get(url, function(t){EquipUpdate(t,7);}); break;
						case 8: GM_get(url, function(t){EquipUpdate(t,8);}); break;
					}
				}, false);

				eq.insertBefore(tempsel, eq.firstChild);
				eq.childNodes[1].setAttribute("style","display:none;");
		}	}
	} // equippage


	if (GetPref('shortlinks') > 1 && firstTable.rows[0].textContent == "Results:")
	{	var resultsText = firstTable.rows[1].textContent;
		if (resultsText.indexOf("tumbling rocks") != -1 && document.referrer.indexOf('bathole.php') != -1)
			parent.frames[2].location = 'http://' + GetDomain() + '/bathole.php';
		else if (resultsText.indexOf("cheap ratchet") != -1 && document.referrer.indexOf('pyramid.php') != -1)
			parent.frames[2].location = 'http://' + GetDomain() + '/pyramid.php';
		else if (resultsText.indexOf("duck talk") != -1)
		{	bText = document.getElementsByTagName('b')[1];
			if (bText.textContent == "quantum egg")
			{	bText.parentNode.appendChild(AppendLink('[rowboat]',
				'combine.php?action=combine&item1=652&item2=609&pwd=' + GetPwd() + '&quantity=1'));
				GoGoGadgetPlunger();
		}	}

		/*else if (resultsText.indexOf("You acquire an effect") != -1)
		{
		}*/
		else if (resultsText.indexOf("You equip the") != -1)
		{	var item = resultsText.substring(14);
			var bText = document.getElementsByTagName('b')[1];

			if (item == "continuum transfunctioner.")
				bText.parentNode.appendChild(AppendLink('[8-bit]', 'adventure.php?snarfblat=73'));
			else if (item == "huge mirror shard.")
				bText.parentNode.appendChild(AppendLink('[chamber]', 'lair6.php?place=1'));
			else if (item == "makeshift SCUBA gear.")
				bText.parentNode.appendChild(AppendLink('[odor]', 'lair2.php?action=odor'));
			else if (item == "snorkel.")
				bText.parentNode.appendChild(AppendLink('[map]', 'inv_use.php?pwd='+
				GetPwd() + '&which=3&whichitem=26'));
			else if (item == "pool cue.")
				bText.parentNode.appendChild(AppendLink('[chalk]', 'inv_use.php?pwd='+
				GetPwd() + '&which=3&whichitem=1794'));
			else if (item == "Talisman o' Nam.")
               bText.parentNode.appendChild(AppendLink('[palindome]', 'adventure.php?snarfblat=119'));
			else if (item == "worm-riding hooks.")
               bText.parentNode.appendChild(AppendLink('[drum]', 'inv_use.php?pwd='+
               GetPwd() + '&which=3&whichitem=2328'));
			else if (item.indexOf("spectacles") != -1 && document.referrer.indexOf('manor3') != -1)
				parent.frames[2].location = 'http://' + GetDomain() + '/manor3.php';
		}
		else if (resultsText.indexOf("You put on an Outfit:") != -1)
		{
			var outfit = resultsText.split(": ")[1];
			var equipText = firstTable.rows[1].cells[0].firstChild.firstChild.firstChild.firstChild;
			equipText.setAttribute('valign', 'baseline');

			if (outfit == "Knob Goblin Harem Girl Disguise")
			{	equipText.appendChild(AppendLink('[perfume]', 'inv_use.php?pwd=' +
					GetPwd() + '&which=3&whichitem=307'));
				equipText.appendChild(AppendLink('[knob]', 'knob.php'));
			}
			else if (outfit == "Swashbuckling Getup")
			{	if (document.referrer.indexOf('council') == -1)
					equipText.appendChild(AppendLink('[council]', 'council.php'));
				equipText.appendChild(AppendLink('[island]', 'island.php'));
			}
			else if (outfit == "Filthy Hippy Disguise")
			{	if (document.referrer.indexOf('store.php') != -1)
					parent.frames[2].location = 'http://' + GetDomain() + '/store.php?whichstore=h';
				else equipText.appendChild(AppendLink('[fruit]', 'store.php?whichstore=h'));
			}
			else if (outfit == "Mining Gear")
				equipText.appendChild(AppendLink('[mine]', 'mining.php?mine=1'));
			else if (outfit == "Knob Goblin Elite Guard Uniform")
			{	if (document.referrer.indexOf('store.php') != -1)
					parent.frames[2].location = 'http://' + GetDomain() + '/store.php?whichstore=g';
				else equipText.appendChild(AppendLink('[lab]', 'store.php?whichstore=g'));
			}
			else if (outfit == "Bugbear Costume")
			{	if (document.referrer.indexOf('store.php') != -1)
					parent.frames[2].location = 'http://' + GetDomain() + '/store.php?whichstore=b';
				else equipText.appendChild(AppendLink('[bakery]', 'store.php?whichstore=b'));
			}
			else if (outfit == "eXtreme Cold-Weather Gear")
				equipText.appendChild(AppendLink('[trapz0r]', 'trapper.php'));
			else if (outfit == "Cloaca-Cola Uniform")
				equipText.appendChild(AppendLink('[battlefield]', 'adventure.php?snarfblat=85'));
			else if (outfit == "Dyspepsi-Cola Uniform")
				equipText.appendChild(AppendLink('[battlefield]', 'adventure.php?snarfblat=85'));
			else if (outfit == "Frat Warrior Fatigues" || outfit == "War Hippy Fatigues")
				equipText.appendChild(AppendLink('[island]', 'island.php'));
	}	}
}


// -----------------------------------
// GALAKTIK: Add use boxes when buying
// -----------------------------------
else if (thePath == "/galaktik.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	if (firstTable.rows[0].textContent == "Results:" &&
		firstTable.rows[1].textContent.indexOf("You acquire") != -1)
	{	var num = 1;
		if (firstTable.rows[1].textContent.indexOf("an item:") == -1)
			num = document.getElementsByTagName('b')[1].textContent.split(" ")[0];
		var acquireText = firstTable.rows[1].cells[0].firstChild;
		var txt = firstTable.rows[1].textContent;
		var docG = DescToItem(document.getElementsByTagName('img')[0].getAttribute('onclick'))['itemid'];

		if (GetPref('docuse') == 1 && docG < 233)
		{	var sanitycheck = FindMaxQuantity(docG, num, 0, 0) + 1;
			if (num > sanitycheck) num = sanitycheck;
			parent.frames[2].location = 'http://' + GetDomain() +
			'/multiuse.php?action=useitem&quantity=' + num +
			'&pwd=' + GetPwd() + '&whichitem=' + docG;
		} else
		{	AppendUseBox(docG, 0, 1, acquireText);
			if (num > 1) NumberLink(document.getElementsByTagName('b')[1]);
	}	}
	var howMany = document.getElementsByName('howmany')[0];
	var check = document.createElement('input');
	check.setAttribute("type","checkbox");
	check.setAttribute("name","usecheckbox");
	check.setAttribute("style","height:12px;width:12px;");
	if (GetPref('docuse') == 1) check.setAttribute("checked",true);
	check.addEventListener('change', function(event)
	{	var box = document.getElementsByName('usecheckbox')[0];
		if (box.checked == true) SetPref('docuse',1);
		else SetPref('docuse',0);
	}, true);
	var checkSpan = document.createElement('span');
	checkSpan.setAttribute("class","small");
	checkSpan.appendChild(document.createElement('br'));
	checkSpan.appendChild(document.createElement('br'));
	checkSpan.appendChild(check);
	checkSpan.appendChild(document.createTextNode("Auto-Use Unguents And Ointments"));
	howMany.parentNode.insertBefore(checkSpan,howMany.nextSibling);
}


// ---------------------------------------------
// STORE: Add use boxes and links as appropriate
// ---------------------------------------------
else if (thePath == "/store.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	var whichstore; var noform = 1; var insput = document.getElementsByName('whichstore');
	if (insput.length > 0)
	{	whichstore = insput[0].getAttribute('value'); noform = 0;
	} else if (document.location.search.indexOf("whichstore=") != -1)
		whichstore = document.location.search.charAt(12);

	// Refresh hash
	if (whichstore == 'm') SetPwd(document.getElementsByName("phash")[0].value);

	// Quantity checking
	for (i=0,len=document.images.length; i<len; i++)
	{	zoimg = document.images[i];
		onclick = zoimg.getAttribute("onclick");
		if (onclick != undefined && onclick.indexOf("desc") != -1)
			AddInvCheck(zoimg);
	}

	if (GetPref('shortlinks') > 1 && firstTable != undefined && firstTable.rows[0].textContent == "Market Results:" &&
		firstTable.rows[1].textContent.indexOf("You acquire") != -1)
	{	var storeText = firstTable.parentNode.childNodes[1].rows[0].textContent;
		var descId = document.getElementsByTagName('img')[0].getAttribute('onclick');
		var doWhat = '';
		var acquireString = firstTable.rows[1].textContent;
		var acquireText = firstTable.rows[1].cells[0].firstChild;
		var bText = document.getElementsByTagName('b')[1];
		bText.setAttribute('valign','baseline');

		switch(whichstore)
		{	case 'b':
				bText.parentNode.appendChild(AppendLink('[cook]', 'cook.php')); break;
			case 'j':
				bText.parentNode.appendChild(AppendLink('[ply]', 'jewelry.php')); break;
			case 's':
				if (document.referrer.indexOf('smith') != -1)
					parent.frames[2].location = 'http://' + GetDomain() + '/smith.php';
				else bText.parentNode.appendChild(AppendLink('[smith]', 'smith.php')); break;
			case 'h':
				bText.parentNode.appendChild(AppendLink('[cook]', 'cook.php'));
				bText.parentNode.appendChild(AppendLink('[mix]', 'cocktail.php'));
				bText.parentNode.appendChild(AppendLink('[still]', 'guild.php?place=still')); break;
		}

		if (descId != undefined)
		{	var whut = AddLinks(descId, bText.parentNode.parentNode, acquireText, thePath);
			if ((whut == 'skill' || whut == 'use') && firstTable.rows[1].textContent.indexOf("an item:") == -1)
				NumberLink(bText);
		}
	}

	if (GetPref('shortlinks') > 1)
	{
		if (whichstore == 'g') // Stupid Lab Key *sigh*
		{	if (document.body.textContent == "")
			{	GM_get(GetDomain()+'/knob2.php',function(knob2)
				{	if (knob2.indexOf('locked') != -1) document.firstChild.innerHTML = knob2;
				else {
			var style = document.createElement('style');
    		style.type = 'text/css';
    		style.innerHTML = "body {font-family: Arial, Helvetica, sans-serif; background-color: white; color: black;} " +
				"td {font-family: Arial, Helvetica, sans-serif;} input.button {border: 2px black solid; " +
				"font-family: Arial, Helvetica, sans-serif; font-size: 10pt; font-weight: bold; background-color: #FFFFFF;}";
			document.firstChild.firstChild.appendChild(style);
			var td; var tabl = document.createElement('table');
			tabl.setAttribute('width','95%'); tabl.setAttribute('style','font-family: Arial, Helvetica, sans-serif');
			tabl.setAttribute('cellspacing','0'); tabl.setAttribute('cellpadding','0');
			tabl.appendChild(document.createElement('tbody'));
			tabl.firstChild.appendChild(document.createElement('tr'));
			tabl.firstChild.appendChild(document.createElement('tr'));
			td = document.createElement('td'); td.setAttribute('bgcolor','blue');
			td.setAttribute('align','center'); td.setAttribute('style','color: white;');
			td.appendChild(document.createElement('b'));
			td.firstChild.innerHTML = "Knob Goblin Laboratory";
			tabl.firstChild.firstChild.appendChild(td);
			td = document.createElement('td');
			td.setAttribute('style','border: 1px solid blue; padding: 5px;');
			td.setAttribute('align','center');
			td.appendChild(document.createElement('p'));
			td.firstChild.innerHTML = '<img src="http://images.kingdomofloathing.com/otherimages/shopgoblin.gif" align=middle>'+
				"How did <i>you</i> get here? This store is for guards only!<br>";
			td.firstChild.appendChild(AppendOutfitSwap(5, "Get In Gear, Soldier!", 0));
			tabl.firstChild.childNodes[1].appendChild(td);
			var centre = document.createElement('center'); centre.appendChild(tabl);
			document.firstChild.childNodes[1].appendChild(centre);
			}});}
			else
			{	var p = document.getElementsByTagName('p')[0];
				p.appendChild(AppendOutfitSwap(0, "Return To Civilian Life", 0));
		}	}
		else if (whichstore == 'h')
		{	var p = document.getElementsByTagName('p')[0];
			if (noform == 1)
				p.appendChild(AppendOutfitSwap(2, "Like, Get Groovy, Man", 0));
			else p.appendChild(AppendOutfitSwap(0, "Whoa, Clear Your Head, Man", 0));
		} else if (whichstore == 'b')
		{	var p = document.getElementsByTagName('p')[0];
			if (noform == 1)
				p.appendChild(AppendOutfitSwap(1, "Wave Your Hand And Say \"But I Am A Bugbear.\"", 0));
			else p.appendChild(AppendOutfitSwap(0, "Sneak Away Before The Bugbear Catches On", 0));
		}
	}
}


// ---------------------------------
// CASINO: Add link for buying pass.
// ---------------------------------
else if (thePath == "/casino.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	if (GetPref('shortlinks') > 1)
	{	if (firstTable.rows[1].textContent.indexOf("Casino Pass") != -1)
		{	var p = document.getElementsByTagName('p')[0];
			p.innerHTML += AppendBuyBox(40, 'm', 'Buy Casino Pass', 1);
}	}	}


// ---------------------------------
// COOK: Add button for buying oven.
// ---------------------------------
else if (thePath == "/cook.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	var showInstall = 0;
	if (GetPref('shortlinks') > 1)
	{	if (firstTable.rows[1].textContent.indexOf("without an oven?") != -1)
		{	var p = document.getElementsByTagName('p')[0];
			p.innerHTML += AppendBuyBox(157, 'm', 'Buy Oven', 1);
			showInstall = 1;
		}
}	}


// ------------------------------------
// COCKTAIL: Add button for buying kit.
// ------------------------------------
else if (thePath == "/cocktail.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	var showInstall = 0;
	if (GetPref('shortlinks') > 1)
	{	if (firstTable.rows[1].textContent.indexOf("without a Cock") != -1) // *snicker*
		{	var p = document.getElementsByTagName('p')[0];
			p.innerHTML += AppendBuyBox(236, 'm', 'Buy Cocktailcrafting Kit', 1);
			showInstall = 1;
		}
}	}


// ------------------------------------
// SMITH: Add button for buying hammer.
// ------------------------------------
else if (thePath == "/smith.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	if (GetPref('shortlinks') > 1)
	{	if (firstTable.rows[1].textContent.indexOf("without a ham") != -1) // i wuv woo, bashy
		{	var p = document.getElementsByTagName('p')[0];
			p.innerHTML += AppendBuyBox(338, 's', 'Buy Hammer', 1);
		}
		else if (document.getElementsByName('pulverize')[0])
		{	document.getElementsByName('smashitem')[0].setAttribute('style','vertical-align:top;');
			var box = document.getElementsByName('quantity')[1];
			if (box.parentNode.name == "pulverize")
			{	MakeMaxButton(box, function(event)
				{	box.value = ParseSelectQuantity(document.getElementsByName('smashitem')[0]," ");
				}); var parTabl = box.parentNode.parentNode.parentNode;
				parTabl.setAttribute('style', parTabl.getAttribute('style') + ' vertical-align:middle;');
		}	}
		var b = document.getElementsByTagName('b');
		for (var i=0, len=b.length; i<len; i++)
		{	var temp = b[i];
			if (temp.textContent.indexOf("powder") != -1)
				temp.parentNode.appendChild(AppendLink('[malus]', 'guild.php?place=malus'));
			if (temp.textContent.indexOf("nugget") != -1)
			{	temp.parentNode.appendChild(AppendLink('[malus]', 'guild.php?place=malus'));
				if (temp.textContent.indexOf("twink") == -1)
					temp.parentNode.appendChild(AppendLink('[cook]', 'cook.php'));
}	}	}	}


// -------------------------------
// SEWER: Add form for buying gum.
// -------------------------------
else if (thePath == "/sewer.php")
{	var firstTable = document.getElementsByTagName('table')[0];
	if (GetPref('shortlinks') > 1 && firstTable.rows[0].textContent.indexOf("Results:") != 1)
	{	if (firstTable.rows[1].textContent.indexOf("extending") != -1)
		{	var p = document.getElementsByTagName('p')[0];
			p.innerHTML += '<br><br>' + AppendBuyBox(23, 'm', 'Buy Gum', 0);
		} else
		{	var b = document.getElementsByTagName('b');
			for (var i=0, len=b.length; i<len; i++)
			{	if (b[i].textContent.indexOf("worthless") != -1)
				{	b[i].parentNode.appendChild(AppendLink('[hermit]', 'hermit.php')); break;
				}
}	}	}	}


// ------------------------------------
// HERMIT: Add form for buying permits.
// ------------------------------------
else if (thePath == "/hermit.php")
{	if (GetPref('shortlinks') > 1)
	{	var p = document.getElementsByTagName('p')[0];
		var txt = p.textContent;
		if (txt.indexOf("not allowed") != -1)
			p.innerHTML += '<br><br>' + AppendBuyBox(42, 'm', 'Buy Permits', 0);
		else if (txt.indexOf("disappointed") != -1)
			p.innerHTML += '<br><br><center><a href="sewer.php">Visit Sewer</a></center>';

		var firstTable = document.getElementsByTagName('table')[0];
		if (firstTable.rows[0].textContent == "Results:" &&
			firstTable.rows[1].textContent.indexOf("You acquire") != -1)
		{	var descId = document.getElementsByTagName('img')[0].getAttribute('onclick');
			var bText = document.getElementsByTagName('b')[1];
			bText.setAttribute('valign','baseline');
			if (bText.textContent.indexOf("ten-leaf clovers") != -1)
			{	var num = parseInt(bText.textContent.split(" ten-leaf")[0]);
				bText.parentNode.appendChild(AppendLink('[disassemble]', 'multiuse.php?pwd=' +
				GetPwd() + '&action=useitem&quantity=' + num + '&whichitem=24'));
			}
			else AddLinks(descId, bText.parentNode.parentNode, p, thePath);
		}
}	}


// ------------------------------
// COMBINE: Auto-make meat paste.
// ------------------------------
else if (thePath == "/combine.php" && document.location.search != "")
{	var txt = document.body.textContent;
	if (txt.indexOf("have any meat paste") != -1 && txt.indexOf("You acquire") == -1)
	{	var quant = document.location.search.substr(document.location.search.lastIndexOf("ty=")+3);
		SetData('urlstorage',document.location.search);

		GM_get(GetDomain()+"/combine.php?action=makepaste&quantity="+quant,function(result)
		{	if (result.indexOf("enough Meat") == -1)
			{	var url = GetData('urlstorage'); SetData('urlstorage',0);
				GM_get(GetDomain()+"/combine.php"+url,function(result2)
				{	document.body.innerHTML = result2;
				});
			}
		});
}	}


// ---------------------------------
// MOUNTAINS: Always-visible hermit.
// ---------------------------------
else if (thePath == "/mountains.php")
{	if (GetPref('zonespoil') == 1)
	{	var temp; var img = document.getElementsByTagName('img');
		for (var i=0, len=img.length; i<len; i++)
		{	var temp = img[i];
			if (temp.src.indexOf("valley2") != -1)
				temp.setAttribute('title','ML: 75-87');
	}	}
	var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	if (img[i].src.indexOf("mount4") != -1)
		{	var a = document.createElement('a');
			img[i].setAttribute('src','http://images.kingdomofloathing.com/otherimages/mountains/hermitage.gif');
			img[i].setAttribute('border', 0);
			a.setAttribute('href', 'hermit.php');
			img[i].parentNode.insertBefore(a, img[i]); a.appendChild(img[i]);
			break;
}	}	}


// -----------------------------------------------
// COUNCIL: Add shortcut links for current quests.
// -----------------------------------------------
else if (thePath == "/council.php")
{	if (GetPref('shortlinks') > 1)
	{	var p = document.getElementsByTagName('p');
		for (var i=0, len=p.length; i<len; i++)
		{	var txt = p[i].textContent;

			if (txt.indexOf("Toot") != -1)
				p[i].appendChild(AppendLink('[toot]', 'mtnoob.php?action=toot'));
			else if (txt.indexOf("larva") != -1 && txt.indexOf("Thanks") == -1)
				p[i].appendChild(AppendLink('[woods]', 'woods.php'));
			else if (txt.indexOf("Typical Tavern") != -1)
				p[i].appendChild(AppendLink('[tavern]', 'rats.php'));
			else if (txt.indexOf("Boss Bat") != -1)
				p[i].appendChild(AppendLink('[bat hole]', 'bathole.php'));
			else if (txt.indexOf("Guild") != -1)
				p[i].appendChild(AppendLink('[guild]', 'guild.php'));
			else if (txt.indexOf("Goblin King") != -1 && txt.indexOf("slaying") == -1)
			{	var derr = AppendLink('[disguise]', "inv_equip.php?action=outfit&which=2&whichoutfit=4");
				p[i].appendChild(derr);
				if (GetPref('backup') != "")
				{	var bink = derr.lastChild;
					bink.setAttribute('href', '#');
					bink.addEventListener('click',function(event)
					{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' +
						GetPref('backup'),function(response)
						{	parent.frames[2].location = 'http://' + GetDomain() +
								"/inv_equip.php?action=outfit&which=2&whichoutfit=4";
						}); event.stopPropagation(); event.preventDefault();
					}, true);
				}
				p[i].appendChild(AppendLink('[perfume]', 'inv_use.php?pwd=' +
					GetPwd() + '&which=3&whichitem=307'));
				p[i].appendChild(AppendLink('[knob]', 'knob.php'));
			}
			else if (txt.indexOf("Sinister") != -1)
				p[i].appendChild(AppendLink('[cave]', 'cave.php'));
			else if (txt.indexOf("Deep Fat") != -1)
				p[i].appendChild(AppendLink('[copse]', 'friars.php'));
			else if (txt.indexOf("Cyrpt") != -1)
				p[i].appendChild(AppendLink('[cyrpt]', 'cyrpt.php'));
			else if (txt.indexOf("L337") != -1)
				p[i].appendChild(AppendLink('[trapz0r]', 'trapper.php'));
			else if (txt.indexOf("Chasm") != -1)
				p[i].appendChild(AppendLink('[mountains]', 'mountains.php'));
			if (txt.indexOf("invaded!") != -1 || txt.indexOf("pirates") != -1)
			{	var derr = AppendLink('[swashbuckle]', "inv_equip.php?action=outfit&which=2&whichoutfit=9");
				p[i].appendChild(derr);
				if (GetPref('backup') != "")
				{	var bink = derr.lastChild;
					bink.setAttribute('href', '#');
					bink.addEventListener('click',function(event)
					{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' +
						GetPref('backup'),function(response)
						{	parent.frames[2].location = 'http://' + GetDomain() +
								"/inv_equip.php?action=outfit&which=2&whichoutfit=9";
						}); event.stopPropagation(); event.preventDefault();
					}, true);
				} p[i].appendChild(AppendLink('[island]', 'island.php'));
			}
			else if (txt.indexOf("garbage") != -1 && txt.indexOf("Thanks") == -1)
			{	if (txt.indexOf("sky") != -1)
				{	p[i].appendChild(AppendLink('[plant bean]', 'inv_use.php?pwd=' +
						GetPwd() + "&which=3&whichitem=186"));
					top.frames[0].location.reload();
				} else p[i].appendChild(AppendLink('[beanstalk]', 'beanstalk.php'));
			}
			else if (txt.indexOf("her Lair") != -1)
				p[i].appendChild(AppendLink('[lair]', 'lair.php'));
			else if (txt.indexOf("Black Forest") != -1)
				p[i].appendChild(AppendLink('[forest]', 'adventure.php?snarfblat=111'));
			else if (txt.indexOf("war") != -1 && txt.indexOf("Island") != -1)
				p[i].appendChild(AppendLink('[island]', 'island.php'));
		}

		var b = document.getElementsByTagName('b');
		for (var i=0, len=b.length; i<len; i++)
		{	var txt = b[i].textContent;

			if (txt.indexOf("leaflet") != -1)
				b[i].appendChild(AppendLink('[read]', 'leaflet.php'));
			else if (txt.indexOf("dragonbone") != -1)
			{	b[i].appendChild(AppendLink('[make belt]', 'combine.php?action=combine&item1=676&item2=192&pwd=' +
					GetPwd() + '&quantity=1'));
				GoGoGadgetPlunger();
		}	}
	}

	for (i=0,len=document.images.length; i<len; i++)
	{	var img = document.images[i];
		var onclick = img.getAttribute("onclick");
		if (onclick != undefined && onclick.indexOf("desc") != -1)
			AddLinks(onclick, img.parentNode.parentNode, null, thePath);
	}
}


// ----------------------------------------------------
// QUESTLOG: Add MORE shorcut links for current quests!
// ----------------------------------------------------
else if (thePath == "/questlog.php")
{	// If this ever breaks, the following line will probably be why:
	if (document.links[0].href.indexOf("?which=1") == -1 && GetPref('shortlinks') > 1)
	{	var b = document.getElementsByTagName('b');
		for (var i=0, len=b.length; i<len; i++)
		{	var txt = b[i].textContent;

			if (txt.indexOf("Toot") != -1)
				b[i].appendChild(AppendLink('[toot]', 'mtnoob.php?action=toot'));
			else if (txt.indexOf("Larva") != -1 || txt.indexOf("White Citadel") != -1)
				b[i].appendChild(AppendLink('[woods]', 'woods.php'));
			else if (txt.indexOf("Smell a Rat") != -1)
				b[i].appendChild(AppendLink('[tavern]', 'rats.php'));
			else if (txt.indexOf("Smell a Bat") != -1)
				b[i].appendChild(AppendLink('[bat hole]', 'bathole.php'));
			else if (txt.indexOf("Wouldn't Be King") != -1 && txt.indexOf("slaying") == -1)
			{	var derr = AppendLink('[disguise]', "inv_equip.php?action=outfit&which=2&whichoutfit=4");
				b[i].appendChild(derr);
				if (GetPref('backup') != "")
				{	var bink = derr.lastChild;
					bink.setAttribute('href', '#');
					bink.addEventListener('click',function(event)
					{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' +
						GetPref('backup'),function(response)
						{	parent.frames[2].location = 'http://' + GetDomain() +
								"/inv_equip.php?action=outfit&which=2&whichoutfit=4";
						}); event.stopPropagation(); event.preventDefault();
					}, true);
				}
				b[i].appendChild(AppendLink('[perfume]', 'inv_use.php?pwd=' +
					GetPwd() + '&which=3&whichitem=307'));
				b[i].appendChild(AppendLink('[knob]', 'knob.php'));
			}
			else if (txt.indexOf("By Friar") != -1)
				b[i].appendChild(AppendLink('[copse]', 'friars.php'));
			else if (txt.indexOf("Cyrpt") != -1)
				b[i].appendChild(AppendLink('[cyrpt]', 'cyrpt.php'));
			else if (txt.indexOf("Trapper's") != -1)
				b[i].appendChild(AppendLink('[trapz0r]', 'trapper.php'));
			else if (txt.indexOf(" LOL") != -1)
			{	b[i].appendChild(AppendLink('[mountains]', 'mountains.php'));
				var derr = AppendLink('[swashbuckle]', "inv_equip.php?action=outfit&which=2&whichoutfit=9");
				b[i].appendChild(derr);
				if (GetPref('backup') != "")
				{	var bink = derr.lastChild;
					bink.setAttribute('href', '#');
					bink.addEventListener('click',function(event)
					{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' +
						GetPref('backup'),function(response)
						{	parent.frames[2].location = 'http://' + GetDomain() +
								"/inv_equip.php?action=outfit&which=2&whichoutfit=9";
						}); event.stopPropagation(); event.preventDefault();
					}, true);
				} b[i].appendChild(AppendLink('[island]', 'island.php'));
			}
			else if (txt.indexOf("Garbage") != -1)
				b[i].appendChild(AppendLink('[beanstalk]', 'beanstalk.php'));
			else if (txt.indexOf("Final Ultimate") != -1)
			{	b.innerHTML = "The Ultimate Showdown Of Ultimate Destiny"; // Am I a naughty boy? Why, yes, yes I am.
				b[i].appendChild(AppendLink('[lair]', 'lair.php'));
			}
			else if (txt.indexOf("Made of Meat") != -1)
			{	b[i].appendChild(AppendLink('[untinker]', 'town_right.php?place=untinker'));
				b[i].appendChild(AppendLink('[plains]', 'plains.php'));
			}
			else if (txt.indexOf("Driven Crazy") != -1 || txt.indexOf("Wizard of Ego") != -1)
				b[i].appendChild(AppendLink('[plains]', 'plains.php'));
			else if (txt.indexOf("Pyramid") != -1)
				b[i].appendChild(AppendLink('[beach]', 'beach.php'));
			else if (txt.indexOf("Never Odd") != -1)
			{	b[i].appendChild(AppendLink("[o 'nam]", 'inv_equip.php?pwd='+GetPwd()+
					"&which=2&slot=3&whichitem=486"));
				b[i].appendChild(AppendLink('[palindome]', 'adventure.php?adventure=119'));
			} else if (txt.indexOf("Worship") != -1)
				b[i].appendChild(AppendLink('[hidden city]', 'hiddencity.php'));
		}
	}
}


// ---------------------------------------------------
// DUNGEON: Count and display skeleton keys if needed.
// ---------------------------------------------------
else if (thePath == "/dungeon.php")
{	if (GetPref('zonespoil') == 1)
	{	var temp; var img = document.getElementsByTagName('img');
		for (var i=0, len=img.length; i<len; i++)
		{	var temp = img[i];
			if (temp.src.indexOf("ddoom") != -1)
				temp.setAttribute('title','ML: 36-45');
	}	}
	var inputs = document.getElementsByTagName('input');
	for (var i=0, len=inputs.length; i<len; i++)
	{	if (inputs[i].class = "button" && inputs[i].value == "Use a Skeleton Key")
		{	GM_get(GetDomain() + '/inventory.php?which=3',
				function(response)
				{	var num = HasItem("skeleton key", response);
					if (num < 1) return;
					var inputs = document.getElementsByTagName('input');
					for (var i=0, len=inputs.length; i<len; i++)
					{	if (inputs[i].value == "Use a Skeleton Key")
						{	inputs[i].value += "\n(" + num + " In Inventory)";
							break;
					}	}
				});
			break;
}	}	}


// -------------------------------------------------
// CHARSHEET: Add calculator for next level/fullstat
// -------------------------------------------------
else if (thePath == "/charsheet.php")
{
//parent.frames[2].location.reload();
}


// --------------------------------------
// CHARPANE: Find level, class, HP and MP
// --------------------------------------
else if (thePath == "/charpane.php")
{	var centerThing = document.getElementsByTagName('center');
	var imgs = document.getElementsByTagName('img');
	if (imgs.length == 0 || imgs == null) return;
	var compactMode = imgs[0].getAttribute('height') < 60;
	var bText = document.getElementsByTagName('b');
	var curHP, maxHP, curMP, maxMP, level, str, charClass;

	for (var i=1, len=centerThing.length; i<len; i++)
	{	var temp = centerThing[i];
		if (temp.firstChild.nodeName == 'B' || temp.firstChild.nodeName == 'A')
		{	centerThing = temp; break;
	}	}

	// Compact Mode
	if (compactMode)
	{	var mp=0;
		for (var i=4, len=bText.length; i<len; i++)
		{	str = bText[i].textContent;
			if (str.indexOf('/') != -1)
			{	if (mp == 0)
				{	curHP = parseInt(str.split('/')[0]);
					maxHP = parseInt(str.split('/')[1]); mp++;
				}else
				{	curMP = parseInt(str.split('/')[0]);
					maxMP = parseInt(str.split('/')[1]);
					bText[i].parentNode.previousSibling.addEventListener('contextmenu',RightClickMP,true);
					break;
		}	}	}
		//if (centerThing.childNodes == null || centerThing.childNodes == undefined)
		//	GM_log(elementsSpan.length + " centerThing error: " + centerThing.innerHTML);
		level = parseInt(centerThing.childNodes[2].textContent.slice(5)); // error happens here

		SetData("currentHP", curHP);
		SetData("maxHP", maxHP);
		SetData("currentMP", curMP);
		SetData("maxMP", maxMP);
		SetData("level", level);
	}
	// Full Mode
	else
	{	var spans = document.getElementsByTagName('span');
		str = spans[0].textContent;
		curHP = parseInt(str.substring(0, str.indexOf("/")-1));
		maxHP = parseInt(str.substring(str.indexOf("/")+2));
		str = spans[1].textContent;
		curMP = parseInt(str.substring(0, str.indexOf("/")-1));
		maxMP = parseInt(str.substring(str.indexOf("/")+2));
		level = parseInt(centerThing.childNodes[2].textContent.slice(6));

		SetData("currentHP", curHP); SetData("maxHP", maxHP);
		SetData("currentMP", curMP); SetData("maxMP", maxMP);
		SetData("level", level);

		// Find class, and refresh top pane if it's different than what we think it is
		str = centerThing.childNodes[4].textContent.substr(0,3);
		level = (level > 15 || level < 1) ? 15 : level;
		var classes = ["SR","PM","DB","AT","SC","TT"];
		var classArr =
		[["All","Cil","Par","Sag","Ros","Thy","Tar","Ore","Bas","Cor","Bay","Ses","Mar","Alf","Sau"],
		 ["Dou","Yea","Noo","Sta","Car","Spa","Mac","Ver","Lin","Rav","Man","Spa","Can","Ang","Pas"],
		 ["Fun","Rhy","Chi","Jig","Bea","Sam","Mov","Jam","Gro","Vib","Boo","Flo","Jiv","Rhy","Dis"],
		 ["Pol","Mar","Zyd","Cho","Chr","Squ","Con","But","Hur","Sub","Sub","Pse","Hem","App","Acc"],
		 ["Lem","Ter","Puf","Erm","Pen","Mal","Nar","Ott","Car","Moo","Rei","Ox ","Wal","Wha","Sea"],
		 ["Toa","Ski","Fro","Gec","New","Fro","Igu","Sal","Bul","Rat","Cro","Cob","All","Asp","Tur"]];

		for (var i=0; i<6; i++)
		{	if (str == classArr[i][level-1])
			{	charClass = classes[i]; break;
		}	}
		var refreshTop = 0;
		if (charClass != GetData("charclass")) refreshTop = 1;
		SetData("charclass",charClass);
		if (refreshTop == 1) top.frames[0].location.reload();

		// Change image link for costumes
		img = imgs[0];
		if (GetPref('backup'))
		{	img.parentNode.parentNode.nextSibling.setAttribute('id','outfitbkup');
			img.addEventListener('contextmenu',function(event)
			{	GM_get(GetDomain() + '/inv_equip.php?action=customoutfit&which=2&outfitname=' +
				GetPref('backup'),function(response)
				{	var msg; if (response.indexOf("custom outfits") == -1) msg = "Outfit Backed Up";
					else msg = "Too Many Outfits";
					document.getElementById('outfitbkup').innerHTML +=
					"<span class='tiny'><center>"+msg+"</center></span>";
				}); event.stopPropagation(); event.preventDefault();
			}, true);
		}
		// If anyone still uses this feature for some reason, uncomment this and/or let me know.
		/*if (GetPref('shortlinks') > 1)
		{	var imgSrc = img.src.split('/')[4];
			if (imgSrc == "hippycostume.gif") img.parentNode.setAttribute('href', 'store.php?whichstore=h');
			else if (imgSrc == "haremcostume.gif") img.parentNode.setAttribute('href', 'knob.php');
			else if (imgSrc == "bugbearcostume.gif") img.parentNode.setAttribute('href', 'store.php?whichstore=b');
			else if (imgSrc == "guardcostume.gif") img.parentNode.setAttribute('href', 'store.php?whichstore=g');
			else if (imgSrc == "coldcostume.gif") img.parentNode.setAttribute('href', 'mclargehuge.php');
			else if (imgSrc == "minercostume.gif") img.parentNode.setAttribute('href', 'mining.php?mine=1');
			else if (imgSrc == "piratecostume.gif") img.parentNode.setAttribute('href', 'island.php');
			else if (imgSrc == "furrycostume.gif") img.parentNode.setAttribute('href', 'lair6.php');
		}*/

		// Add SGEEA to Effects right-click
		for (i=4, len=bText.length; i<len; i++)
		{	if (bText[i].textContent.indexOf("Effects") != -1)
			{	bText[i].setAttribute("oncontextmenu",
				"top.mainpane.location.href='http://" + GetDomain() + "/uneffect.php'; return false;"); break;
		}	}
	}

	// Poison and other un-effecty things
	SetData("phial",0);
	for (i=0,len=imgs.length; i<len; i++)
	{	img = imgs[i]; imgClick = img.getAttribute('onclick');
		var imgSrc = img.src.substr(img.src.lastIndexOf('/')+1);
		if (imgSrc == 'mp.gif') img.addEventListener('contextmenu', RightClickMP, false);
		if (imgClick == null || imgClick.indexOf("eff(") == -1) continue;
		var effName = img.parentNode.nextSibling.firstChild.innerHTML;

		if (imgSrc == 'poison.gif')
		{	img.parentNode.parentNode.setAttribute('name','poison');
			img.addEventListener('contextmenu', function(event)
			{	document.getElementsByName('poison')[0].childNodes[1].innerHTML = "<i><span style='font-size:10px;'>Un-un-unpoisoning...</span></i>";
				GM_get(GetDomain()+'/store.php?howmany=1&buying=Yep.&whichstore=m&whichitem=829&phash='+GetPwd(),
				function(result)
				{	if (result.indexOf('acquire') != -1)
						GM_get(GetDomain()+'/inv_use.php?which=1&whichitem=829&pwd='+GetPwd(),function(event)
						{	top.frames[1].location.reload(); });
				}); event.stopPropagation(); event.preventDefault();
			}, false);
		}
		else if (img.getAttribute('oncontextmenu') == null)
		{	// Bah, I'm not using strings that long. Six characters will do.
			var effectsDB = {'5e788a':166,'173a9c':165,'15f811':295,
				'087638':189,'801f28':193,'9a12b9':301,'cb5404':58,'c69907':297,
				'a3c871':190,'9574fa':191,'9a6852':192,'d33505':3,'3e2eed':221,
				'cf4844':144,'a4a570':142,'61c56f':141,'ec5873':143,'94e112':140,'454d46':139};
			var effNum = effectsDB[imgClick.substr(5,6)];
			if (effNum == undefined) continue;
			switch (effNum)
			{	case 221: // chalk
					var func = "top.mainpane.location.href = 'http://";
					func += GetDomain() + "/inv_use.php?which=3&whichitem=1794&pwd="+GetPwd()+"'; return false;";
					img.setAttribute('oncontextmenu', func); break;
				case 139: case 140: case 141: case 142: case 143: case 144:
					break;
				case 189: case 190: case 191: case 192: case 193: SetData("phial", effNum);
				default:
					if (effName == undefined) effName = "";
					var func = "if (confirm('Uneffect "+effName+"?')) top.mainpane.location.href = 'http://";
					func += GetDomain() + "/uneffect.php?using=Yep.&whicheffect="+effNum+"&pwd="+GetPwd()+"';return false;";
					img.setAttribute('oncontextmenu', func); break;
		}	}
	}
}


// -----------------------------------------------------------------
// SKILLPAGE: Autofill the proper "maxed-out" number in the use box.
// -----------------------------------------------------------------
if (thePath == "/skills.php")
{	var miniSkills = document.location.search.indexOf("tiny=1") != -1;
	var inputStuff = document.getElementsByTagName("input");
	var noDisable = GetPref('nodisable');

	// Remove stupid "The " from menu
	if (miniSkills)
	{	var sel = document.getElementsByTagName("select")[0];
		for (var i=0, len=sel.childNodes.length; i<len; i++)
		{	var temp = sel.childNodes[i].value;
			if (noDisable > 0 && sel.childNodes[i].getAttribute('disabled') != null)
			{	switch(parseInt(temp))
				{	case 3: case 16: case 17: case 4006: case 5014: case 3006: break;
					default: sel.childNodes[i].removeAttribute('disabled'); break;
			}	}
			if (temp < 6004 || sel.childNodes[i].tagName == "OPTGROUP") continue;
			if (temp == 6004 || temp == 6006 || temp == 6007 || temp == 6008
				|| temp == 6011 || temp == 6014 || temp == 6015)
				sel.childNodes[i].innerHTML = sel.childNodes[i].innerHTML.substr(4);
	}	}

	// Store list of restoratives we care about
	var vich = document.getElementsByName("whichitem");
	if (vich[0] != undefined)
	{	var json = "{"; var opt = vich[0].childNodes;
		for (i=0, len=opt.length; i<len; i++)
		{	var optval = opt[i].value; var temp;
			switch (parseInt(optval))
			{	case 344: case 1559: case 518: case 1658: case 1659: case 1660: case 2639:
					if (opt[i].innerHTML.indexOf('(') == -1) temp = 1;
					else
					{	temp = opt[i].innerHTML.split('(')[1];
						temp = temp.split(')')[0];
					} json += "\""+optval+"\":"+temp+","; break;
				default: break;
		}	}
		if (json == '{') json = "";
		else json += "}";
		SetData("mplist",json);
	}

	for (var i=0, len=inputStuff.length; i<len; i++)
	{	var temp = inputStuff[i];

		// Attach maximum skills event handler
		if (temp.value == "1" && temp.name == "quantity")
		{	temp.addEventListener('keydown', function(event)
			{	if (event.which == 77 || event.which == 88 || event.which == 72) // 'm', 'x', 'h'
				{	var selectItem = document.getElementsByName('whichskill')[0];
					var cost = ParseSelectQuantity(selectItem, " ");
					var limit = SkillUseLimit(selectItem.options[selectItem.selectedIndex].value);
					var val = parseInt(GetData("currentMP") / cost);
					if (event.which == 72) val = parseInt(val/2); // half
					if (val > limit) this.value = limit;
					else this.value = val;
					event.stopPropagation(); event.preventDefault();
				} else if (ENABLE_QS_REFRESH == 1 && event.which == 82) self.location.reload();
			}, true);

			if (!miniSkills && temp.getAttribute('id') != 'skilltimes')
			{	MakeMaxButton(temp, function(event)
				{	var selectItem = document.getElementsByName('whichskill')[0];
					var box = document.getElementsByName('quantity')[0];
					var cost = ParseSelectQuantity(selectItem, " ");
					var limit = SkillUseLimit(selectItem.options[selectItem.selectedIndex].value);
					var val = parseInt(GetData("currentMP") / cost);
					if (val > limit) box.value = limit;
					else box.value = val;
				});
		}	}

		// Attach, um, other maximum skills event handler
		if (temp.value == "1" && temp.name == "bufftimes")
		{	var padding = document.createElement('div');
			padding.setAttribute('style','padding-top: 4px');
			temp.parentNode.insertBefore(padding, temp);
			temp.addEventListener('keydown', function(event)
			{	if (event.which == 77 || event.which == 88) // 'm', 'x'
				{	var selectItem = document.getElementsByName('whichskill')[1];
					var cost = ParseSelectQuantity(selectItem, " ");
					this.value = parseInt(GetData("currentMP") / cost);
					event.stopPropagation(); event.preventDefault();
			}	}, true);

			MakeMaxButton(temp, function(event)
			{	var selectItem = document.getElementsByName('whichskill')[1];
				var box = document.getElementsByName('bufftimes')[0];
				var cost = ParseSelectQuantity(selectItem, " ");
				box.value = parseInt(GetData("currentMP") / cost);
			});
		}

		// Attach maximum items event handler
		if (temp.value == "1" && temp.name == "itemquantity")
		{	temp.addEventListener('keyup', function(event)
			{	if (event.which == 77 || event.which == 88 || event.which == 72) // 77 = 'm', 88 = 'x', 72 = 'h'
				{	var selectItem = document.getElementsByName('whichitem')[0];
					var quant = ParseSelectQuantity(selectItem, ")");
					var index = selectItem.selectedIndex;
					var val = FindMaxQuantity(selectItem.options[index].value, quant, 0, GetPref('safemax'));
					if (event.which == 72) val = parseInt(val/2); // half
					this.value = val;
					event.stopPropagation(); event.preventDefault();
				} else if (ENABLE_QS_REFRESH == 1 && event.which == 82) self.location.reload();
			}, false);

			if (!miniSkills)
			{	MakeMaxButton(temp, function(event)
				{	var selectItem = document.getElementsByName('whichitem')[0];
					var index = selectItem.selectedIndex;
					var box = document.getElementsByName('itemquantity')[0];
					var quant = ParseSelectQuantity(selectItem, ")");
					box.value = FindMaxQuantity(selectItem.options[index].value, quant, 0, GetPref('safemax'));
				});
			}
			break;
		}
	}
}




// -----------------------------------------------------------------
// MULITUSE: Autofill the proper "maxed-out" number in the use box.
// -----------------------------------------------------------------
else if (thePath == "/multiuse.php")
{	var inputStuff = document.getElementsByTagName("input");
	for (var i=0, len=inputStuff.length; i<len; i++)
	{	var temp = inputStuff[i];
		if (temp.name == "quantity")
		{	temp.addEventListener('keydown', function(event)
			{	if (event.which == 77 || event.which == 88) // 'm', 'x'
				{	this.value = "";
					//event.stopPropagation(); event.preventDefault();
				}
			}, true);

			temp.addEventListener('keyup', function(event)
			{	if (event.which == 77 || event.which == 88) // 77 = 'm', 'x'
				{	var selectItem = document.getElementsByName("whichitem")[0];
					var quant = ParseSelectQuantity(selectItem, ")");
					var index = selectItem.selectedIndex;
					this.value = FindMaxQuantity(selectItem.options[index].value, quant, 1, GetPref('safemax'));
				} event.stopPropagation(); event.preventDefault();
			}, false);

			MakeMaxButton(temp, function(event)
			{	var box = document.getElementsByName('quantity')[0];
				var selectItem = document.getElementsByName('whichitem')[0];
				var quant = ParseSelectQuantity(selectItem, ")");
				var index = selectItem.selectedIndex;
				box.value = FindMaxQuantity(selectItem.options[index].value, quant, 1, GetPref('safemax'));
			});
			break;
		}
	}
}


// -------------------------
// MR. KLAW: Mr. Vanity Klaw
// -------------------------
else if (thePath == "/clan_rumpus.php")
{	if (document.location.search == "?action=click&spot=3&furni=3" && GetPref('klaw') == 1)
	{	var tableone = document.getElementsByTagName('table')[0];
		if (tableone.rows[0].textContent == "Results:" &&
			tableone.rows[1].textContent.indexOf("wisp of smoke") == -1 &&
			tableone.rows[1].textContent.indexOf("broken down") == -1 &&
			tableone.rows[1].textContent.indexOf("claw slowly descends") != -1)
		window.setTimeout('self.location = "http://' + GetDomain() +
			'/clan_rumpus.php?action=click&spot=3&furni=3";',500);
	}
}


// -------------------------------------------------
// MANOR: If manor is not present, redirect to town.
// -------------------------------------------------
else if (thePath == "/manor.php")
{	if (document.body.textContent.length == 0)
		parent.frames[2].location = 'http://' + GetDomain() + '/town_right.php';
	else if (GetPref('zonespoil') == 1)
	{	var temp; var img = document.getElementsByTagName('img');
		for (var i=0, len=img.length; i<len; i++)
		{	var temp = img[i];
			if (temp.src.indexOf("sm1.gif") != -1)
				temp.setAttribute('title','ML: 105-115');
			else if (temp.src.indexOf("sm4.gif") != -1)
				temp.setAttribute('title','ML: 20');
			else if (temp.src.indexOf("sm3.gif") != -1)
				temp.setAttribute('title','ML: 8-9');
			else if (temp.src.indexOf("sm6.gif") != -1)
				temp.setAttribute('title','ML: 13-14');
			else if (temp.src.indexOf("sm7.gif") != -1)
				temp.setAttribute('title','ML: 49-57');
			else if (temp.src.indexOf("sm9.gif") != -1)
				temp.setAttribute('title','ML: 1');
		}
}	}
else if (thePath == "/manor3.php")
{	var sel = document.getElementsByTagName('select')[0];
	if (sel) sel.addEventListener('change', function(event)
	{	var wineDB = {'2275':'278847834','2271':'163456429','2276':'147519269',
					'2273':'905945394','2272':'289748376','2274':'625138517'};
		var wine = this.childNodes[this.selectedIndex].value;
		if (wine > 0) GM_get(GetDomain() + "/desc_item.php?whichitem=" + wineDB[wine],
		function(txt)
		{	var num = txt.charAt(txt.indexOf("/glyph") + 6); // I know, I know, I should learn regexps.
			var glyph = document.getElementById('daglyph');
			if (!glyph)
			{	glyph = document.createElement('img');
				glyph.setAttribute('id','daglyph');
				document.getElementsByTagName('select')[0].parentNode.parentNode.appendChild(glyph);
			} glyph.setAttribute('src','http://images.kingdomofloathing.com/otherimages/manor/glyph'+num+".gif");
		});
	}, true);
	for (var i=0; i<3; i++)
	{	var img = document.images[i];
		if (img.src.indexOf("lar2a") != -1)
		{	var a = document.createElement('a');
			a.setAttribute('href','inv_equip.php?pwd=' +
				GetPwd() + '&which=2&action=equip&whichitem=1916&slot=3');
			img.parentNode.appendChild(a); a.appendChild(img);
			img.setAttribute('title','Click to Equip Spectacles');
			img.setAttribute('border','0');
			break;
		}
	}
}
else if (thePath == "/palinshelves.php")
{	for (i=0,len=document.images.length; i<len; i++)
	{	var img = document.images[i];
		var onclick = img.getAttribute("onclick");
		if (onclick != undefined && onclick.indexOf("desc") != -1)
			AddLinks(onclick, img.parentNode.parentNode, null, thePath);
	} var sels = document.getElementsByTagName('select');
	if (sels.length > 0)
	{	sels[0].value = 2259; sels[1].value = 2260;
		sels[2].value = 493; sels[3].value = 2261;
}	}


// --------------------------------------------
// PYRAMID: Display ratchets and other goodies.
// --------------------------------------------
else if (thePath == "/pyramid.php")
{	GM_get(GetDomain() + '/inventory.php?which=3',
	function(response)
	{	var html = ""; var ratch = HasItem("tomb ratchet", response);
		if (response.indexOf("ancient bronze token") != -1) html = "an ancient bronze token";
		else if (response.indexOf("ancient bomb") != -1) html = "an ancient bomb";
		if (ratch > 0)
		{	if (html != "") html += " and ";
			html += ratch + " <a href='inv_use.php?pwd=";
			html += GetPwd() + "&which=3&whichitem=2540'>tomb ratchet";
			if (ratch > 1) html += "s"; html += "</a>";
		}
		if (document.location.pathname == "/pyramid.php" && html != "")
		{	var t = document.getElementsByTagName('table');
			t[t.length-2].parentNode.innerHTML += "<br>You have " + html + ".<br>";
		}
	});
	if (GetPref('zonespoil') == 1)
	{	var temp; var img = document.getElementsByTagName('img');
		for (var i=0, len=img.length; i<len; i++)
		{	var temp = img[i];
			if (temp.src.indexOf("mid2") != -1)
				temp.setAttribute('title','ML: 162-176');
			else if (temp.src.indexOf("mid3b") != -1)
				temp.setAttribute('title','ML: 162-180');
			else if (temp.src.indexOf("mid4_5") != -1)
				temp.setAttribute('title','Keep Going...');
			else if (temp.src.indexOf("mid4_2") != -1)
				temp.setAttribute('title','Keep Going...');
			else if (temp.src.indexOf("mid4_4") != -1)
				temp.setAttribute('title','Phase 1: Token');
			else if (temp.src.indexOf("mid4_3") != -1)
				temp.setAttribute('title','Phase 2: ???');
			else if (temp.src.indexOf("mid4_1.") != -1)
				temp.setAttribute('title','Phase 3: Profit!');
	}	}
}
else if (thePath == "/beach.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("newbeach9") != -1)
			temp.setAttribute('title','ML: 20-25');
		else if (temp.src.indexOf("desert.gif") != -1)
			temp.setAttribute('title','ML: 134-142');
		else if (temp.src.indexOf("oasis") != -1)
			temp.setAttribute('title','ML: 132-137');
}	}


// -------------------
// LAIR: More linkies.
// -------------------
else if (thePath == "/lair1.php" && document.location.search == "?action=gates")
{	for (var i=0; i<3; i++)
	{	var p = document.getElementsByTagName('p')[i];
		var ptxt = p.textContent;
		if (ptxt.indexOf("Suc Rose") != -1) p.appendChild(AppendLink('[sugar rush]',
			'inv_use.php?pwd='+GetPwd()+'&which=3&whichitem=540'));
		else if (ptxt.indexOf("Machismo") != -1) p.appendChild(AppendLink('[meleegra]',
			'inv_use.php?pwd='+GetPwd()+'&which=3&whichitem=1158'));
		else if (ptxt.indexOf("Hidden") != -1) p.appendChild(AppendLink('[dod potion - object]','multiuse.php'));
	}
} else if (thePath == "/lair6.php")
{	var tabl = document.getElementsByTagName('table');
	img = document.images;
	if (tabl[1].innerHTML.indexOf("fying seri") != -1)
	{	tabl[1].parentNode.innerHTML +=
		"<br><a href='inv_equip.php?pwd="+GetPwd()+
		"&which=2&action=equip&whichitem=726'>Equip Shard</a>";
	}
	if (img.length == 2 && img[1].src.indexOf("gash.gif") != -1)
	{	var zif = img[1].parentNode.parentNode;
		zif.setAttribute('align','center');
		zif.innerHTML += "<br><br><a class='tiny' href='storage.php'>Hagnk's</a>";
}	}


// --------------------------------------------
// BASEMENT: Im in ur base, spoilin ur puzzlez.
// --------------------------------------------
else if (thePath == "/basement.php")
{	var bq = document.getElementsByTagName('blockquote')[0];
	var ins = document.getElementsByTagName('input');

	// Phial link
	for (var i=0, len=ins.length; i<len; i++)
	{	if (ins[i].type != 'submit') continue;
		var phial = 0; var temp = ins[i].value;
		var curphial = GetData("phial");
		if (temp.indexOf("Drunk's Drink") != -1) phial = 1638;
		else if (temp.indexOf("Pwn the Cone") != -1) phial = 1640;
		else if (temp.indexOf("Hold your nose") != -1) phial = 1641;
		else if (temp.indexOf("Typewriter,") != -1) phial = 1637;
		else if (temp.indexOf("Vamps") != -1) phial = 1639;
		if (phial > 0 && phial != (curphial+1448)) // In the biz, we call this this the Phial Phudge Phactor.
		{	var bq = document.getElementsByTagName('blockquote')[0];
			var aa = document.createElement('a');
			var phnames = {"1637":"Hot","1638":"Cold","1639":"Spooky","1640":"Stench","1641":"Sleaze"};
			aa.innerHTML = "Use " + phnames[phial] + " Phial"; aa.setAttribute('href','#');
			aa.setAttribute('id','usephial'); if (curphial > 0)
			aa.setAttribute('curphial',"/uneffect.php?using=Yep.&pwd=" + GetPwd() + "&whicheffect=" + curphial);
			aa.setAttribute('phial',"/inv_use.php?pwd=" + GetPwd() + "&which=3&whichitem=" + phial);
			aa.addEventListener('click',function(event)
			{	this.innerHTML = "Using Phial...";
				if (this.getAttribute('curphial'))
				GM_get(GetDomain() + this.getAttribute('curphial'),function(details)
				{	var ph = document.getElementById('usephial');
					if (details.indexOf("Effect removed.") != -1)
					GM_get(GetDomain() + ph.getAttribute('phial'),function(details2)
					{	var ph = document.getElementById('usephial'); ph.innerHTML = "";
						top.frames[1].location.reload();
				});	});
				else GM_get(GetDomain() + this.getAttribute('phial'),function(details)
				{	var ph = document.getElementById('usephial'); ph.innerHTML = "";
					top.frames[1].location.reload();
				}); event.stopPropagation(); event.preventDefault();
			}, false);
			var cr = document.createElement('center');
			bq.appendChild(cr); cr.appendChild(aa);
	}	}

	// OMGSPOILERS
	var lvl; var str = ""; var trs = document.getElementsByTagName('tr');
	for (var j=0; j<trs.length; j++)
	{	lvl = document.getElementsByTagName('tr')[j].textContent;
		if (lvl.charAt(0) == "F") break;
	}
	lvl = lvl.substring(lvl.indexOf("Level ")+6, lvl.length);
	var bim = document.images[document.images.length-1];
	var bimg = bim.getAttribute('src');
	bimg = bimg.substring(bimg.lastIndexOf("/")+1, bimg.length);

	switch(bimg)
	{	case "earbeast.gif":
			//str = "Monster Level: " + parseInt(Math.pow(lvl,1.4));
			break;
		case "document.gif": lvl = 4.48*Math.pow(lvl,1.4)+8;
			str = "Hot & Spooky: " + parseInt(lvl*.95) + " to " + parseInt(lvl*1.05) + " Damage";
			break;
		case "coldmarg.gif": lvl = 4.48*Math.pow(lvl,1.4)+8;
			str = "Cold & Sleaze: " + parseInt(lvl*.95) + " to " + parseInt(lvl*1.05) + " Damage";
			break;
		case "fratbong.gif": lvl = 4.48*Math.pow(lvl,1.4)+8;
			str = "Sleaze & Stench: " + parseInt(lvl*.95) + " to " + parseInt(lvl*1.05) + " Damage";
			break;
		case "onnastick.gif": lvl = 4.48*Math.pow(lvl,1.4)+8;
			str = "Stench & Hot: " + parseInt(lvl*.95) + " to " + parseInt(lvl*1.05) + " Damage";
			break;
		case "snowballbat.gif": lvl = 4.48*Math.pow(lvl,1.4)+8;
			str = "Spooky & Cold: " + parseInt(lvl*.95) + " to " + parseInt(lvl*1.05) + " Damage";
			break;
		case "sorority.gif": case "bigbaby.gif":
		case "pooltable.gif": case "goblinaxe.gif": lvl = Math.pow(lvl,1.4);
			str = "Moxie Needed: " + parseInt(lvl*.94) + " to " + parseInt(lvl*1.06);
			break;
		case "mops.gif": case "voodoo.gif": case "darkshards.gif": lvl = Math.pow(lvl,1.4);
			str = "Mysticality Needed: " + parseInt(lvl*.94) + " to " + parseInt(lvl*1.06);
			break;
		case "typewriters.gif": case "bigstatue.gif": case "bigmallet.gif": lvl = Math.pow(lvl,1.4);
			str = "Muscle Needed: " + parseInt(lvl*.94) + " to " + parseInt(lvl*1.06);
			break;
		case "haiku11.gif": lvl = Math.pow(lvl,1.4) * 1.67;
			str = "HP Needed: " + parseInt(lvl*.94) + " to " + parseInt(lvl*1.06);
			break;
		case "powderbox.gif": lvl = Math.pow(lvl,1.4) * 1.67;
			str = "MP Needed: " + parseInt(lvl*.94) + " to " + parseInt(lvl*1.06);
			break;
	}
	if (str != "") bim.parentNode.innerHTML += "<br><span class='small'><b>"+str+"</b></span>";
}


// -------------------------------------
// OTHER ZONES: Display ML on mouseover.
// -------------------------------------
else if (thePath == "/manor2.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("sm2_1") != -1)
			temp.setAttribute('title','ML: 147-173');
		else if (temp.src.indexOf("sm2_7") != -1)
			temp.setAttribute('title','ML: 76-100');
		else if (temp.src.indexOf("sm2_5") != -1)
			temp.setAttribute('title','ML: 110');
}	}
else if (thePath == "/bathole.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("batrat") != -1)
			temp.setAttribute('title','ML: 23-25');
		else if (temp.src.indexOf("batentry") != -1)
			temp.setAttribute('title','ML: 11-16');
		else if (temp.src.indexOf("junction") != -1)
			temp.setAttribute('title','ML: 14-18');
		else if (temp.src.indexOf("batbean") != -1)
			temp.setAttribute('title','ML: 22');
		else if (temp.src.indexOf("batboss") != -1)
			temp.setAttribute('title','ML: 37');
		else if (temp.src.indexOf("batrock") != -1)
			temp.parentNode.href = "inv_use.php?pwd=" + GetPwd() + "&which=3&whichitem=563";
}	}
else if (thePath == "/plains.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("knob1") != -1)
			temp.setAttribute('title','ML: 1-2');
		else if (temp.src.indexOf("funhouse") != -1)
			temp.setAttribute('title','ML: 14-20');
		else if (temp.src.indexOf("knoll1") != -1)
			temp.setAttribute('title','ML: 10-13');
		else if (temp.src.indexOf("cemetary") != -1)
			temp.setAttribute('title','ML: 18-20 / 53-59');
		else if (temp.src.indexOf("palindome") != -1)
			temp.setAttribute('title','ML: 116-135');
		else if (temp.src.indexOf("garbagegrounds") != -1)
		{	var lnk = document.createElement('a'); temp.border = 0;
			lnk.href = "inv_use.php?pwd=" + GetPwd() + "&which=3&whichitem=186";
			temp.parentNode.insertBefore(lnk,temp); lnk.appendChild(temp);
}	}	}
else if (thePath == "/knob.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("knob3") != -1)
			temp.setAttribute('title','ML: 1-2');
		else if (temp.src.indexOf("knob4") != -1)
			temp.setAttribute('title','ML: 20-22');
		else if (temp.src.indexOf("knob6") != -1)
			temp.setAttribute('title','ML: 24-32');
		else if (temp.src.indexOf("knob7") != -1)
			temp.setAttribute('title','ML: 26-32');
		else if (temp.src.indexOf("knob9") != -1)
			temp.setAttribute('title','ML: 57');
}	}
else if (thePath == "/knob2.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("knob22") != -1)
			temp.setAttribute('title','ML: 40-45');
		else if (temp.src.indexOf("knob23") != -1)
			temp.setAttribute('title','ML: 50-56');
		else if (temp.src.indexOf("knob26") != -1)
			temp.setAttribute('title','ML: 60-66');
		else if (temp.src.indexOf("knob29") != -1)
			temp.setAttribute('title','ML: 70-76');
		else if (temp.src.indexOf("shaft2") != -1)
			temp.setAttribute('title','ML: 30');
}	}
else if (thePath == "/cyrpt.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("cyrpt4d") != -1)
			temp.setAttribute('title','ML: 53-59 / 79');
		else if (temp.src.indexOf("cyrpt6d") != -1)
			temp.setAttribute('title','ML: 57-58 / 77');
		else if (temp.src.indexOf("cyrpt7d") != -1)
			temp.setAttribute('title','ML: 54-58 / 77');
		else if (temp.src.indexOf("cyrpt9d") != -1)
			temp.setAttribute('title','ML: 54 / 79');
		else if (temp.src.indexOf("cyrpt2") != -1)
			temp.setAttribute('title','ML: 91');
}	}
else if (thePath == "/woods.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("8bitdoor") != -1)
			temp.setAttribute('title','ML: 20-25');
		else if (temp.src.indexOf("kforest") != -1)
			temp.setAttribute('title','ML: 123-133');
		else if (temp.src.indexOf("hiddencity") != -1)
			temp.setAttribute('title','ML: ?');
		else if (temp.src.indexOf("forest") != -1)
			temp.setAttribute('title','ML: 5');
		else if (temp.src.indexOf("barrow") != -1)
			temp.setAttribute('title','ML: 56-65');
		else if (temp.src.indexOf("pen.") != -1)
			temp.setAttribute('title','ML: 13-20');
		else if (temp.src.indexOf("grove") != -1)
			temp.setAttribute('title','ML: 34-36');
		else if (temp.src.indexOf("tavern") != -1)
			temp.setAttribute('title','ML: 10');
}	}
else if (thePath == "/island.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("island4") != -1)
			temp.setAttribute('title','ML: 39-41');
		else if (temp.src.indexOf("island6") != -1)
			temp.setAttribute('title','ML: 39-41');
		else if (temp.src.indexOf("cove") != -1)
			temp.setAttribute('title','ML: 61-69');
}	}
else if (thePath == "/friars.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("neck") != -1)
			temp.setAttribute('title','ML: 40-52');
		else if (temp.src.indexOf("heart") != -1)
			temp.setAttribute('title','ML: 42-50');
		else if (temp.src.indexOf("elbow") != -1)
			temp.setAttribute('title','ML: 44-48');
}	}
else if (thePath == "/beanstalk.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("hole") != -1)
			temp.setAttribute('title','ML: 151-169');
		else if (temp.src.indexOf("castle") != -1)
			temp.setAttribute('title','ML: 125-146');
		else if (temp.src.indexOf("airship") != -1)
			temp.setAttribute('title','ML: 91-120');
}	}
else if (thePath == "/fernruin.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("ruins_5") != -1)
			temp.setAttribute('title','ML: 16-24');
}	}
else if (thePath == "/lair3.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("hedgemaze") != -1)
			temp.setAttribute('title','ML: 186');
}	}
else if (thePath == "/mclargehuge.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("omright") != -1)
			temp.setAttribute('title','ML: 53-57');
		else if (temp.src.indexOf("ommid") != -1)
			temp.setAttribute('title','ML: 68');
		else if (temp.src.indexOf("rightmid") != -1)
			temp.setAttribute('title','ML: 71-76');
		else if (temp.src.indexOf("leftmid") != -1)
			temp.setAttribute('title','ML: 70-90');
		else if (temp.src.indexOf("top") != -1)
			temp.setAttribute('title','ML: 105 (?)');
}	}
else if (thePath == "/canadia.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		if (temp.src.indexOf("olcamp") != -1)
			temp.setAttribute('title','ML: 1');
		else if (temp.src.indexOf("lcamp") != -1)
			temp.setAttribute('title','ML: 35-40');
}	}
else if (thePath == "/bigisland.php" && GetPref('zonespoil') == 1)
{	var temp; var img = document.getElementsByTagName('img');
	for (var i=0, len=img.length; i<len; i++)
	{	var temp = img[i];
		// Note to wiki peoples: more spoilers, plz
		if (temp.src.indexOf("nunnery1") != -1)
			temp.setAttribute('title','ML: 168');
		else if (temp.src.indexOf("bmim24") != -1)
			temp.setAttribute('title','ML: 330-375');
		else if (temp.src.indexOf("bmim23") != -1)
			temp.setAttribute('title','ML: 330-375');
}	}


// -------------------------
// MTNOOB: Open letter! Yay!
// -------------------------
else if (thePath == "/mtnoob.php" && document.location.search.indexOf("toot") != -1)
{	var coveredinbs = document.getElementsByTagName('b');
	for (var i=0, len=coveredinbs.length; i<len; i++)
	{	var um = coveredinbs[i];
		if (um.textContent.indexOf("Ralph") != -1)
		{	um.parentNode.appendChild(AppendLink('[read]', 'inv_use.php?pwd='+
				GetPwd() + '&which=3&whichitem=1155'));
			break;
}	}	}
else if (thePath == "/showplayer.php" &&
	(document.location.search == "?who=53596" || document.location.search == "?who=73736"))
{	var img = document.getElementsByTagName('img'); for (var i=50, len=img.length; i<len; i++)
	{	var temp = img[i]; if (temp.width == 100 && temp.title.indexOf("Tiny") != -1)
		{	var nu = document.createElement('img'); nu.title = "Worst. Trophy. Ever.";
			nu.src = "http://images.kingdomofloathing.com/otherimages/trophy/not_wearing_any_pants.gif";
			temp.parentNode.insertBefore(nu,temp.nextSibling); break;
}	}	}


// --------------------------------------------------------------
// DEFAULTS: Pay no attention to the function behind the curtain.
// --------------------------------------------------------------
function Defaults(revert)
{
	if (revert == 0)
	{	if (GetPref('splitinv') == undefined)	SetPref('splitinv', 1);
		if (GetPref('splitquest') == undefined)	SetPref('splitquest', 1);
		if (GetPref('splitmsg') == undefined)	SetPref('splitmsg', 0);
		if (GetPref('outfitmenu') == undefined)	SetPref('outfitmenu', 1);
		if (GetPref('shortlinks') == undefined) SetPref('shortlinks', 3);
		if (GetPref('autoclear') == undefined)	SetPref('autoclear', 1);
		if (GetPref('toprow') == undefined) 	SetPref('toprow', 1);
		if (GetPref('safemax') == undefined) 	SetPref('safemax', 1);
		if (GetPref('moveqs') == undefined) 	SetPref('moveqs', 2);
		if (GetPref('logout') == undefined) 	SetPref('logout', 1);
		if (GetPref('zonespoil') == undefined) 	SetPref('zonespoil', 1);
		if (GetPref('klaw') == undefined) 		SetPref('klaw', 1);
		if (GetPref('quickequip') == undefined)	SetPref('quickequip', 0);
		if (GetPref('nodisable') == undefined)	SetPref('nodisable', 0);
		if (GetPref('docuse') == undefined) 	SetPref('docuse', 0);
		if (GetPref('swordguy') == undefined) 	SetPref('swordguy', 'skills.php');
		if (GetPref('backup') == undefined) 	SetPref('backup', 'Backup');

		if (GetPref('menu1link0') == undefined) SetPref('menu1link0', 'market;town_market.php');
		if (GetPref('menu1link1') == undefined) SetPref('menu1link1', 'hermit;hermit.php');
		if (GetPref('menu1link2') == undefined) SetPref('menu1link2', 'untinker;town_right.php?place=untinker');
		if (GetPref('menu1link3') == undefined) SetPref('menu1link3', 'mystic;mystic.php');
		if (GetPref('menu1link4') == undefined) SetPref('menu1link4', 'hunter;bhh.php');
		if (GetPref('menu1link5') == undefined) SetPref('menu1link5', 'guildstore');
		if (GetPref('menu1link6') == undefined) SetPref('menu1link6', 'demon;store.php?whichstore=m');
		if (GetPref('menu1link7') == undefined) SetPref('menu1link7', 'doc;galaktik.php');
		if (GetPref('menu1link8') == undefined) SetPref('menu1link8', 'lab;store.php?whichstore=g');
		if (GetPref('menu1link9') == undefined) SetPref('menu1link9', 'fruit;store.php?whichstore=h');

		if (GetPref('menu2link0') == undefined) SetPref('menu2link0', 'buy;searchmall.php');
		if (GetPref('menu2link1') == undefined) SetPref('menu2link1', 'trade;makeoffer.php');
		if (GetPref('menu2link2') == undefined) SetPref('menu2link2', 'sell;managestore.php');
		if (GetPref('menu2link3') == undefined) SetPref('menu2link3', 'collection;managecollection.php');
		if (GetPref('menu2link4') == undefined) SetPref('menu2link4', 'closet;closet.php');
		if (GetPref('menu2link5') == undefined) SetPref('menu2link5', 'hagnk\'s;storage.php');
		if (GetPref('menu2link6') == undefined) SetPref('menu2link6', 'attack;pvp.php');
		if (GetPref('menu2link7') == undefined) SetPref('menu2link7', 'wiki;http://www.thekolwiki.net');
		if (GetPref('menu2link8') == undefined) SetPref('menu2link8', 'calendar;http://noblesse-oblige.org/calendar');
		if (GetPref('menu2link9') == undefined) SetPref('menu2link9', ';');
	}
	else if (revert==1) // I'm definitely going to hell.
	{	SetPref('menu1link0', 'market;town_market.php');
		SetPref('menu1link1', 'hermit;hermit.php');
		SetPref('menu1link2', 'untinker;town_right.php?place=untinker');
		SetPref('menu1link3', 'mystic;mystic.php');
		SetPref('menu1link4', 'hunter;bhh.php');
		SetPref('menu1link5', 'guildstore');
		SetPref('menu1link6', 'demon;store.php?whichstore=m');
		SetPref('menu1link7', 'doc;galaktik.php');
		SetPref('menu1link8', 'lab;store.php?whichstore=g');
		SetPref('menu1link9', 'fruit;store.php?whichstore=h');
	} else if (revert==2)
	{	SetPref('menu2link0', 'buy;searchmall.php');
		SetPref('menu2link1', 'trade;makeoffer.php');
		SetPref('menu2link2', 'sell;managestore.php');
		SetPref('menu2link3', 'collection;managecollection.php');
		SetPref('menu2link4', 'closet;closet.php');
		SetPref('menu2link5', 'hagnk\'s;storage.php');
		SetPref('menu2link6', 'attack;pvp.php');
		SetPref('menu2link7', 'wiki;http://www.thekolwiki.net');
		SetPref('menu2link8', 'calendar;http://noblesse-oblige.org/calendar');
		SetPref('menu2link9', ';');
}	}


// --------------------------------------------
// TOPMENU: Add some new links to the top pane.
// --------------------------------------------
if (thePath == "/topmenu.php")
{
	// Test if quickskills is present. TODO: Find a cleaner way to do this.
	var quickSkills = 0, moveqs = 0;
	if (document.getElementsByTagName('center')[0].innerHTML.indexOf("javascript:skillsoff();") != -1)
	{	quickSkills = 1; moveqs = GetPref('moveqs');
		if (moveqs == 0) document.getElementsByTagName('td')[0].innerHTML +=
		"<br><a target='mainpane' href='main.php' name='maplink' style='visibility:hidden'>map</a>&nbsp;" +
		"<a target='mainpane' href='inventory.php?which=1' name='invlink' style='visibility:hidden'>inv</a>" +
		"<a target='mainpane' href='inventory.php?which=2' name='invlink' style='visibility:hidden'>ent</a>" +
		"<a target='mainpane' href='inventory.php?which=3' name='invlink' style='visibility:hidden'>ory</a>";
	}

	// Set defaults if needed
	Defaults(0);

	var toprow1 = 0, toprow2, toprow3, front, shorttop = 0, haveLair = 0, weBuildHere;
	if (GetPref('shortlinks') % 2 > 0)
	{	shorttop = 1;
		toprow1 = document.createElement('span');
		toprow2 = document.createElement('span');
		var front = GetPref('toprow');
	}

	// Find all links and attach event handlers
	var link = document.getElementsByTagName('a');
	for (var i=0; i<link.length; i++)
	{	var temp = link[i];

		// Map link
		if (quickSkills == 1 && temp.text.indexOf("menu") != -1)
		{	if (moveqs > 0)
				temp.parentNode.setAttribute('style','display:none;');
			else
				temp.addEventListener('click', function(event)
			{	var mapLink = document.getElementsByName('maplink');
      				mapLink[0].setAttribute('style', 'visibility:hidden');
				var invLink = document.getElementsByName('invlink');
      				invLink[0].setAttribute('style', 'visibility:hidden');
      				invLink[1].setAttribute('style', 'visibility:hidden');
      				invLink[2].setAttribute('style', 'visibility:hidden');
			}, false);	}

		// Skills link
		if (quickSkills == 1 && temp.text.indexOf("skills") != -1
			&& temp.getAttribute('href').indexOf("javascript") != -1)
		{	if (moveqs == 0) temp.addEventListener('click', function(event)
			{	var mapLink = document.getElementsByName('maplink');
      				mapLink[0].setAttribute('style', 'visibility:visible');
				var invLink = document.getElementsByName('invlink');
      				invLink[0].setAttribute('style', 'visibility:visible');
      				invLink[1].setAttribute('style', 'visibility:visible');
      				invLink[2].setAttribute('style', 'visibility:visible');
			}, false);	}

		// Yes I know this link only applies to a handful of people. I'm doing it anyway.
		if (temp.text.indexOf("devster") != -1) temp.innerHTML = "devster";

		// Lair
		if (temp.text.indexOf("lair") != -1) haveLair = 1;

		// Confirm logout
		if (temp.text.indexOf("log out") != -1 && GetPref('logout') == 1)
		{	var seekrit = document.createElement('a');
			seekrit.setAttribute('href','#');
			temp.setAttribute('href','#');
			temp.removeAttribute('target');
			temp.addEventListener('click', function(event)
			{	this.blur();
				if (this.innerHTML.indexOf("log out") != -1)
				{	this.innerHTML = "sure?";
					this.href = "logout.php";
					this.setAttribute('target','_top')
					this.nextSibling.innerHTML = " (nope)";
					event.stopPropagation(); event.preventDefault();
			}	}, true);
			seekrit.addEventListener('click', function(event)
			{	if (this.innerHTML.indexOf("nope") != -1)
				{	this.innerHTML = "";
					this.previousSibling.href = "#";
					this.previousSibling.innerHTML = "log out";
					this.previousSibling.removeAttribute('target');
			}	}, true);
			temp.parentNode.insertBefore(seekrit,temp.nextSibling);
		}

		// Manor Link
		if (temp.text.indexOf("plains") != -1)
		{	var manor = document.createElement('a');
			manor.innerHTML = 'manor'; manor.setAttribute('target', 'mainpane');
			manor.setAttribute('href','manor.php');
			var space = document.createTextNode(' ');
			temp.parentNode.insertBefore(manor, link[i].nextSibling);
			temp.parentNode.insertBefore(space, link[i].nextSibling);

			if (parseInt(GetData('level')) > 9)
			{	var stalk = document.createElement('a');
				stalk.innerHTML = 'stalk'; stalk.setAttribute('target', 'mainpane');
				stalk.setAttribute('href','beanstalk.php');
				space = document.createTextNode(' ');
				temp.parentNode.insertBefore(stalk, link[i].nextSibling);
				temp.parentNode.insertBefore(space, link[i].nextSibling);
			}

			// This is as good a place as any; get pointer to span for adding links later.
			weBuildHere = temp.parentNode;
			weBuildHere.parentNode.setAttribute('nowrap','nowrap');
		}

		// Remove last row, which will be manually re-added.
		if (shorttop)
		{	if (temp.text.indexOf("documentation") != -1 ||	temp.text.indexOf("report bug") != -1
			||  temp.text.indexOf("store") != -1 ||  temp.text.indexOf("donate") != -1
			||  temp.text.indexOf("forums") != -1)
			{	temp.innerHTML = "";
				temp.nextSibling.textContent = "";
			}if(temp.text.indexOf("radio") != -1)
				temp.innerHTML = "";
		}

		// Inventory
		if (temp.text.indexOf("inventory") != -1 && GetPref('splitinv') == 1)
		{	temp.innerHTML = 'ory'; temp.setAttribute('href','inventory.php?which=3');

			var newLink = document.createElement('a');
			with(newLink) {innerHTML = 'inv';
				setAttribute('target', 'mainpane'); setAttribute('href', 'inventory.php?which=1');
			} temp.parentNode.insertBefore(newLink, temp);

			newLink = document.createElement('a');
			with(newLink) {innerHTML = 'ent';
				setAttribute('target', 'mainpane'); setAttribute('href', 'inventory.php?which=2');
			} temp.parentNode.insertBefore(newLink, temp);
		}

		// Quests
		if (temp.text.indexOf("quests") != -1 && GetPref('splitquest') == 1)
		{	temp.innerHTML = 'sts'; temp.setAttribute('href','questlog.php?which=4');

			var newLink = document.createElement('a');
			with(newLink) {innerHTML = 'que';
				setAttribute('target', 'mainpane'); setAttribute('href', 'questlog.php?which=1');
			} temp.parentNode.insertBefore(newLink, temp);
		}

		// Messages
		if (temp.text.indexOf("messages") != -1 && GetPref('splitmsg') > 0)
		{	temp.innerHTML = 'ages';
			switch (GetPref('splitmsg'))
			{	case 2: temp.setAttribute('href','messages.php?box=Outbox'); break;
				case 3: temp.setAttribute('href','messages.php?box=Saved'); break;
				case 4: temp.setAttribute('href','messages.php?box=PvP'); break;
				default: temp.setAttribute('href','sendmessage.php');
			}
			var newLink = document.createElement('a');
			with(newLink) {innerHTML = 'mess';
				setAttribute('target', 'mainpane'); setAttribute('href', 'messages.php');
			} temp.parentNode.insertBefore(newLink, temp);
		}

		// Ass-metric link. Surround it in a named span for easy hiding.
		if (moveqs > 0 && temp.text.indexOf("Asymmetric") != -1)
		{	var parentalUnit = temp.parentNode;
			var newSpan = document.createElement('span');
			newSpan.setAttribute('name','assy');
			newSpan.setAttribute('id','menus');
			newSpan.appendChild(parentalUnit.firstChild);
			newSpan.appendChild(parentalUnit.firstChild);
			newSpan.appendChild(parentalUnit.firstChild);
			newSpan.appendChild(parentalUnit.firstChild);
			parentalUnit.appendChild(newSpan);
		}
	}

	// Attach skills link to Sword and Martini Guy
	var swordGuy = document.getElementsByTagName('img')[0];
	var swordGuyURL = GetPref('swordguy');
	if (swordGuyURL != '' && swordGuy.src.indexOf("smallleft") != 1)
	{	var guy = document.createElement('a');
		guy.setAttribute('href',swordGuyURL); swordGuy.setAttribute('border',0);
		if (swordGuyURL.indexOf("http://") != -1) guy.setAttribute('target','_blank');
		else guy.setAttribute('target','mainpane');
		swordGuy.parentNode.insertBefore(guy, swordGuy); guy.appendChild(swordGuy);
		swordGuy = swordGuy.parentNode; // For use later
	}

	// Add rows of links
	if (shorttop)
	{	var a;
		var charClass = GetData("charclass");

		toprow1.setAttribute("name","toprow1");
		if (front != 1) toprow1.setAttribute("style","display: none;");

		for (var j=0; j<10; j++)
		{	var zoiks = GetPref('menu1link'+j); var tarjay = 'mainpane';
			var zplit = zoiks.split(';');
			if (zoiks == "hunter;town_wrong.php?place=bountyhunter")
			{	zplit[1] = "bhh.php"; SetPref('menu1link'+j,"hunter;bhh.php"); }
			if (zplit[0] == "guildstore")
			{	if (charClass == "AT" || charClass == "SR" || charClass == "PM")
				AddTopLink(toprow1, 'mainpane', 'store.php?whichstore=2', 'gouda', 1);
				if (charClass == "AT" || charClass == "TT" || charClass == "SC")
				AddTopLink(toprow1, 'mainpane', 'store.php?whichstore=3', 'smack', 1);
			} else if (zoiks != "")
			{	if (zoiks.indexOf("http://") != -1) tarjay = '_blank';
				AddTopLink(toprow1, tarjay, zplit[1], zplit[0], 1);
			} else break;
		}

		toprow1.appendChild(document.createElement('br'));
		var poop = document.createElement('span'); poop.innerHTML = "&nbsp;";
		toprow1.appendChild(poop);
		AddTopLink(toprow1, 'mainpane', 'multiuse.php', 'multi-use', 1);
		AddTopLink(toprow1, 'mainpane', 'combine.php', 'combine', 1);
		AddTopLink(toprow1, 'mainpane', 'sellstuff.php', 'sell', 1);
		AddTopLink(toprow1, 'mainpane', 'cook.php', 'cook', 1);
		AddTopLink(toprow1, 'mainpane', 'cocktail.php', 'mix', 1);
		AddTopLink(toprow1, 'mainpane', 'smith.php', 'smith', 1);
		AddTopLink(toprow1, 'mainpane', 'council.php', 'council', 1);
		AddTopLink(toprow1, 'mainpane', 'guild.php', 'guild', 1);
		if (haveLair == 1 && GetData('level') == 11)
			AddTopLink(toprow1, 'mainpane', 'lair2.php?action=door', 'door', 1);
		a = document.createElement('a'); a.innerHTML = "more"; a.setAttribute('href','#');
		a.addEventListener('click', function(event)
		{	var tr1 = document.getElementsByName("toprow1")[0];
			var tr2 = document.getElementsByName("toprow2")[0];
			tr1.style.display = "none"; tr2.style.display = "inline";
			SetPref('toprow', 2);
		}, true); toprow1.appendChild(a);

		toprow2.setAttribute("name","toprow2");
		if (front != 2) toprow2.setAttribute("style","display: none;");

		for (var j=0; j<10; j++)
		{	var zoiks = GetPref('menu2link'+j); var tarjay = 'mainpane';
			if (zoiks != "")
			{	if (zoiks.indexOf("http://") != -1 || zoiks.indexOf("searchplayer") != -1) tarjay = '_blank';
				AddTopLink(toprow2, tarjay, zoiks.split(';')[1], zoiks.split(';')[0], 1);
			} else break;
		}

		toprow2.appendChild(document.createElement('br'));
		AddTopLink(toprow2, 'mainpane', 'doc.php?topic=home', 'documentation', 1);
		AddTopLink(toprow2, 'mainpane', 'sendmessage.php?toid=Jick', 'report bug', 1);
		AddTopLink(toprow2, '_blank', 'http://store.asymmetric.net', 'store', 1);
		AddTopLink(toprow2, '_blank', 'donatepopup.php', 'donate', 1);
		AddTopLink(toprow2, '_blank', 'http://forums.kingdomofloathing.com', 'forums', 1);
		AddTopLink(toprow2, '_blank', 'radio.php', 'radio', 1);
		a = document.createElement('a'); a.innerHTML = "more"; a.setAttribute('href','#');
		a.addEventListener('click', function(event)
		{	var tr2 = document.getElementsByName("toprow2")[0];
			var tr1 = document.getElementsByName("toprow1")[0];
			tr2.style.display = "none"; tr1.style.display = "inline";
			SetPref('toprow', 1);
		}, true); toprow2.appendChild(a);

		// Actually add the stuffy-stuff to the span we grabbed earlier
		weBuildHere.appendChild(toprow1);
		weBuildHere.appendChild(toprow2);

		GoGoGadgetPlunger();
	}

	// Move Quick-Skills
	if (moveqs > 0)
	{	weBuildHere.setAttribute('id','menus2');
		var assy = document.getElementsByName('assy')[0];
		var iframe = document.getElementsByName('skillpane')[0];
		iframe.removeAttribute('style');
		assy.setAttribute('style','display: none;');
		if (moveqs == 1)
		{	var tr = document.getElementsByTagName('tr')[0];
			tr.insertBefore(assy.parentNode, swordGuy.parentNode);
		} assy.parentNode.appendChild(iframe.parentNode);
		iframe.parentNode.parentNode.setAttribute('style', 'padding-top: 2px;');
//		iframe.parentNode.parentNode.setAttribute('style', 'padding-top: 4px; width: 300px;');
		//iframe.setAttribute('width', 300);
		// I'm open to suggestions on a better way to do this. EDIT: this, maybe?
		document.location = document.links[1];
		//iframe.contentWindow.setTimeout('self.location = "skills.php?tiny=1";',200);
	}
}


// ------------------------------------------------
// ADDTOPOPTION: Add a menu option in compact mode.
// ------------------------------------------------
function AddTopOption(name, url, select, putBefore)
{	var option = document.createElement('option');
	option.innerHTML = name; option.value = url;
	if (putBefore == 0) select.appendChild(option);
	else select.insertBefore(option, putBefore);
}


// --------------------------------------------
// COMPACTMENU: Add options to menus and stuff.
// --------------------------------------------
if (thePath == "/compactmenu.php")
{
	var selectItem, links, oonTD, linkTD;
	var quickSkills = 0, moveqs = 0;

	// Set defaults if needed
	Defaults(0);

	moveqs = GetPref('moveqs');
	links = document.getElementsByTagName('a');
	for (var i=0, len=links.length; i<len; i++)
	{	var temp = links[i];

		if (temp.text.indexOf("menu") != -1)
		{	quickSkills = 1;
			if (moveqs > 0)
			{	temp.innerHTML = "";
				linkTD = temp.parentNode;
		}	}

		if (temp.innerHTML.indexOf("20") != -1)
		{	if (moveqs > 0 && quickSkills > 0)
			{	oonTD = temp.parentNode;
				temp.innerHTML = '';

				var iframe = document.getElementsByName('skillpane')[0];
				var menuspan = document.getElementsByName('menus')[0];
				linkTD.nextSibling.childNodes[1].setAttribute('id','menus2');
				linkTD.nextSibling.setAttribute('style','width:100%;');
				oonTD.appendChild(iframe.parentNode);
				if (moveqs == 1) // Left
					linkTD.parentNode.insertBefore(oonTD, linkTD.nextSibling);
				else // Right
					oonTD.parentNode.insertBefore(linkTD, oonTD);

				// Remove Moons label. Sneakily.
				temp = document.getElementsByTagName('b')[0];
				if (temp.innerHTML.indexOf('Moons') != -1)
				{	var umspan = document.createElement('span');
					temp.parentNode.setAttribute('style','display:none;');
					umspan.setAttribute('id','menus');
					temp.parentNode.appendChild(umspan);
					umspan.appendChild(temp);
				}
				iframe.contentWindow.setTimeout('self.location = "skills.php?tiny=1";',50);
		}	}
	}

	// Camera One!
	if (GetPref('shortlinks') % 2 > 0 || GetPref('splitinv') == 1)
	{	selectItem = document.getElementsByTagName('select')[0];
		//selectItem.setAttribute('style','font-size: 9pt;');
		selectItem.parentNode.parentNode.setAttribute('nowrap','nowrap');
		for (var i=0; i<selectItem.options.length; i++)
		{	if (GetPref('splitinv') == 1 && selectItem.options[i].innerHTML == "Inventory")
			{	selectItem.options[i].innerHTML = "Consumables";
				selectItem.options[i].value = "inventory.php?which=1";
				AddTopOption("Equipment", "inventory.php?which=2", selectItem, selectItem.options[i+1]);
				AddTopOption("Miscellaneous", "inventory.php?which=3", selectItem, selectItem.options[i+2]);
				if (GetPref('shortlinks') % 2 == 0) break;
			}
			if (selectItem.options[i].innerHTML == "Account Menu")
			{	AddTopOption("-", "nothing", selectItem, selectItem.options[i+1]);
				AddTopOption("Multi-Use", "multiuse.php", selectItem, selectItem.options[i+2]);
				AddTopOption("Combine", "combine.php", selectItem, selectItem.options[i+3]);
				AddTopOption("Sell Items", "sellstuff.php", selectItem, selectItem.options[i+4]);
				AddTopOption("Cook Food", "cook.php", selectItem, selectItem.options[i+5]);
				AddTopOption("Mix Drinks", "cocktail.php", selectItem, selectItem.options[i+6]);
				AddTopOption("Smith/Smash", "smith.php", selectItem, selectItem.options[i+7]);
				AddTopOption("Closet", "closet.php", selectItem, selectItem.options[i+8]);
				AddTopOption("-", "nothing", selectItem, selectItem.options[i+9]);
				GM_get(GetDomain() + "/knoll.php",function(response)
				{	if (response == "") return;
					var s = document.getElementsByTagName('select')[0];
					for (var i=0; i<s.options.length; i++)
					{	if (s.options[i].value == "combine.php")
						{	s.options[i].value = "knoll.php?place=paster"; break;
				}	}	});
			}
			if (GetPref('logout') == 1 && selectItem.options[i].innerHTML == "Log Out")
			{	selectItem.options[i].value = "logout";
				selectItem.setAttribute('onchange', 'if (document.navform1.loc.value!="logout") goloc(); ' +
					'else if (confirm("Log out?")) parent.frames[2].location = "logout.php"; ' +
					'else this.selectedIndex=0;');
			}
	}	}

	// Camera Two!
	if (GetPref('shortlinks') % 2 > 0)
	{	selectItem = document.getElementsByTagName('select')[1];
		selectItem.parentNode.parentNode.setAttribute('nowrap','nowrap');
		for (var i=0, len = selectItem.options.length; i<len; i++)
		{	if (selectItem.options[i].innerHTML.indexOf("Nearby Plains") != -1)
			{	AddTopOption("The Beanstalk", "beanstalk.php", selectItem, selectItem.options[i+1]);
				AddTopOption("Spookyraven Manor", "manor.php", selectItem, selectItem.options[i+2]);
				break;
		}	}

		AddTopOption("-", "nothing", selectItem, 0);
		AddTopOption("Council of Loathing", "council.php", selectItem, 0);
		AddTopOption("Class Guild", "guild.php", selectItem, 0);
		AddTopOption("Market Square", "town_market.php", selectItem, 0);
		AddTopOption("Hermitage", "hermit.php", selectItem, 0);
		AddTopOption("Untinker", "town_right.php?place=untinker", selectItem, 0);
		AddTopOption("Mystic Crackpot", "mystic.php", selectItem, 0);
		AddTopOption("Bounty Hunter", "town_wrong.php?place=bountyhunter", selectItem, 0);
		AddTopOption("Gouda's Grocery", "store.php?whichstore=2", selectItem, 0);
		AddTopOption("Smacketeria", "store.php?whichstore=3", selectItem, 0);
		AddTopOption("Demon Market", "store.php?whichstore=m", selectItem, 0);
		AddTopOption("Doc Galaktik", "galaktik.php", selectItem, 0);
		AddTopOption("Laboratory", "store.php?whichstore=g", selectItem, 0);
		AddTopOption("Hippy Store", "store.php?whichstore=h", selectItem, 0);
	}
}


// -----------------------------------
// MAKEOPTION: Does what it says. Yup.
// -----------------------------------
function MakeOption(text, num, pref, opt1, opt2)
{
	var table = document.createElement('table');
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var prefVal = GetPref(pref);
	var select;

	if (num == -2) td.innerHTML = "<input style='font-size:11px;width:70px;' name=" + pref +
	"tag maxlength=16 type=text class=text value=" + text + ">";
	else td.innerHTML = "<span style='font-size:12px;padding-right:3px;'>" + text + "</span>";
	if (num == -1) td.setAttribute('width','50%');
	else if (num == -2) td.setAttribute('width','30%');
	else td.setAttribute('width','65%');
	td.setAttribute('align','right');
	tr.appendChild(td);

	td = document.createElement('td');
	if (num < 0) // Man, am I sneaky.
	{	select = document.createElement('input');
		select.setAttribute('type','text');
		select.setAttribute('class','text');
		select.setAttribute('maxlength','256');
		if (num == -2)
		{	var preflink = prefVal.split(';')[1];
			if (preflink != undefined) select.setAttribute('value', preflink);
			else select.setAttribute('value', '');
		} else select.setAttribute('value', prefVal);
	} else
	{	select = document.createElement('select');
		for (var i=0; i<num; i++)
		{	var option = document.createElement('option');
			if (i == prefVal) option.setAttribute('selected',1);
			option.value = i; select.appendChild(option);
			if (i == 0 && opt1 != 0) option.innerHTML = opt1;
			if (i == 1 && opt2 != 0) option.innerHTML = opt2;
	}	}
	select.setAttribute('style','width:95%;font-size:11px;');
	select.setAttribute('name',pref);
	if (num > -2) select.addEventListener('change', function(event)
	{	if (this.selectedIndex != undefined)
			 SetPref(this.name, this.selectedIndex);
		else SetPref(this.name, this.value);
		switch(this.name)
		{	case 'shortlinks': case 'splitinv':
			case 'moveqs': case 'swordguy':
			case 'logout': case 'splitquest':
			case 'splitmsg':
				top.frames[0].location.reload(); break;
		} }, true);
	td.appendChild(select);
	tr.appendChild(td);
	table.setAttribute('width','280');
	table.setAttribute('align','center');
	table.appendChild(tr);

	return table;
}


// -------------------------------------
// ACCOUNT: Preference-Type Thing-Thing.
// -------------------------------------
if (thePath == "/account.php")
{	Defaults(0);
	var tables = document.getElementsByTagName('table');
	for (var i=0; i < tables.length; i++)
	{	if (tables[i].rows[0].textContent == "Interface Options")
		{	var choice, select;
			var bigSpan = document.createElement('span');
			var prefSpan = document.createElement('span');
			bigSpan.setAttribute('id','scriptpref');
			bigSpan.setAttribute('style','display: none');
			bigSpan.appendChild(document.createElement('hr'));

			var spanSpan = document.createElement('span');
			var clicky1 = 'javascript:getObj("scriptpref1").setAttribute("style","");' +
			'javascript:getObj("scriptpref2").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref3").setAttribute("style","display:none;");';
			var clicky2 = 'javascript:getObj("scriptpref1").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref2").setAttribute("style","");' +
			'javascript:getObj("scriptpref3").setAttribute("style","display:none;");';
			var clicky3 = 'javascript:getObj("scriptpref1").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref2").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref3").setAttribute("style","");';
			var clicky4 = 'javascript:getObj("scriptpref1").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref2").setAttribute("style","display:none;");' +
			'javascript:getObj("scriptpref3").setAttribute("style","display:none;");';
			spanSpan.innerHTML = "Toggles: <a href='" + clicky1 +
			"'>[tweak]</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Customize Links: " +
			"<a href='" + clicky2 + "'>[one]</a> - <a href='" + clicky3 + "'>[two]</a>";
			spanSpan.setAttribute('style','font-size:12px;');
			bigSpan.appendChild(spanSpan);
			bigSpan.appendChild(document.createElement('hr'));

			prefSpan.setAttribute('id','scriptpref1');
			bigSpan.appendChild(prefSpan);

			choice = MakeOption("Clicking Number Boxes: ", 3, 'autoclear', "Does Zilch", "Clears");
			select = choice.firstChild.cells[1].firstChild;
			select.options[2].innerHTML = "Highlights";
			prefSpan.appendChild(choice);

			choice = MakeOption("Max HP/MP Calculation: ", 3, 'safemax', "Average", "Safe");
			select = choice.firstChild.cells[1].firstChild;
			select.options[2].innerHTML = "Really Safe";
			prefSpan.appendChild(choice);

			choice = MakeOption("Extra Shortcut Links: ", 4, 'shortlinks', "Off", "Top Only");
			select = choice.firstChild.cells[1].firstChild;
			select.options[2].innerHTML = "Main Only";
			select.options[3].innerHTML = "On";
			prefSpan.appendChild(choice);

			choice = MakeOption("Omnipresent Quick-Skills: ", 3, 'moveqs', "Off", "On (Left)");
			select = choice.firstChild.cells[1].firstChild;
			select.options[2].innerHTML = "On (Right)";
			prefSpan.appendChild(choice);

			prefSpan.appendChild(MakeOption("Quick-Equip: ", 2, 'quickequip', "Off", "On"));
			prefSpan.appendChild(MakeOption("Split Inventory Link: ", 2, 'splitinv', "Off", "On"));
			prefSpan.appendChild(MakeOption("Split Quest Link: ", 2, 'splitquest', "Off", "On"));
			choice = MakeOption("Split Messages Link: ", 5, 'splitmsg', "Off", "New Message");
			select = choice.firstChild.cells[1].firstChild;
			select.options[2].innerHTML = "Outbox";
			select.options[3].innerHTML = "Saved";
			select.options[4].innerHTML = "PvP";
			prefSpan.appendChild(choice);

			prefSpan.appendChild(MakeOption("Monster Level Spoiler: ", 2, 'zonespoil', "Off", "On"));
			prefSpan.appendChild(MakeOption("Never Grey Out Skills: ", 2, 'nodisable', "Off", "On"));
			prefSpan.appendChild(MakeOption("1-Klick Klaw: ", 2, 'klaw', "Off", "On"));
			prefSpan.appendChild(MakeOption("Logout Confirmation: ", 2, 'logout', "Off", "On"));
			prefSpan.appendChild(MakeOption("Sword-Guy Link: ", -1, 'swordguy', 0, 0));
			prefSpan.appendChild(MakeOption("Backup Outfit Name: ", -1, 'backup', 0, 0));

			var menu1Span = document.createElement('span');
			var menu2Span = document.createElement('span');
			menu1Span.setAttribute('id','scriptpref2');
			menu1Span.setAttribute('style','display: none');
			menu2Span.setAttribute('id','scriptpref3');
			menu2Span.setAttribute('style','display: none');

			// Customized Links, Take 1
			for (var j=0; j<10; j++)
			{	var menutxt = GetPref('menu1link'+j);
				if (menutxt != undefined) menutxt = menutxt.split(';')[0];
				else menutxt = "";
				menu1Span.appendChild(MakeOption(menutxt, -2, 'menu1link'+j), 0, 0);
			}
			select = document.createElement('a');
			select.innerHTML = 'Restore Defaults'; select.href = '#';
			select.setAttribute('class','tiny');
			select.addEventListener('click',function(event)
			{	event.stopPropagation(); event.preventDefault();
				if (confirm("Restore default menu options? (Just double-checking.)") == false) return;
				Defaults(1);
				for (var i=0; i<10; i++)
				{	var tag = document.getElementsByName('menu1link'+i+'tag')[0];
					var link = document.getElementsByName('menu1link'+i)[0];
					tag.value = GetPref('menu1link'+i).split(';')[0];
					if (tag.value == "undefined") tag.value = "";
					link.value = GetPref('menu1link'+i).split(';')[1];
					if (link.value == "undefined") link.value = "";
				} top.frames[0].location.reload();
			}, true);
			choice = document.createElement('input');
			choice.type = 'submit'; choice.setAttribute('class','button');
			choice.value = 'Apply'; choice.href = '#';
			choice.addEventListener('click',function(event)
			{	event.stopPropagation(); event.preventDefault();
				for (var i=0; i<10; i++)
				{	var tag = document.getElementsByName('menu1link'+i+'tag')[0].value;
					var link = document.getElementsByName('menu1link'+i)[0].value;
					if (tag != undefined && link != undefined && tag != "")
						SetPref('menu1link'+i,tag+';'+link);
					else SetPref('menu1link'+i,';');
				} top.frames[0].location.reload();
			}, true);
			menu1Span.appendChild(document.createElement('center'));
			menu1Span.lastChild.appendChild(select);
			menu1Span.lastChild.appendChild(document.createElement('br'));
			menu1Span.lastChild.appendChild(document.createElement('br'));
			menu1Span.lastChild.appendChild(choice);

			// Customized Links, Take 2
			for (var j=0; j<10; j++)
			{	var menutxt = GetPref('menu2link'+j);
				if (menutxt != undefined) menutxt = menutxt.split(';')[0];
				else menutxt = "";
				menu2Span.appendChild(MakeOption(menutxt, -2, 'menu2link'+j), 0, 0);
			}
			select = document.createElement('a');
			select.innerHTML = 'Restore Defaults'; select.href = '#';
			select.setAttribute('class','tiny');
			select.addEventListener('click',function(event)
			{	event.stopPropagation(); event.preventDefault();
				if (confirm("Restore default menu options? (Just double-checking.)") == false) return;
				Defaults(2);
				for (var i=0; i<10; i++)
				{	var tag = document.getElementsByName('menu2link'+i+'tag')[0];
					var link = document.getElementsByName('menu2link'+i)[0];
					tag.value = GetPref('menu2link'+i).split(';')[0];
					if (tag.value == "undefined") tag.value = "";
					link.value = GetPref('menu2link'+i).split(';')[1];
					if (link.value == "undefined") link.value = "";
				} top.frames[0].location.reload();
			}, true);
			choice = document.createElement('input');
			choice.type = 'submit'; choice.setAttribute('class','button');
			choice.value = 'Apply'; choice.href = '#';
			choice.addEventListener('click',function(event)
			{	for (var i=0; i<10; i++)
				{	var tag = document.getElementsByName('menu2link'+i+'tag')[0].value;
					var link = document.getElementsByName('menu2link'+i)[0].value;
					if (tag != undefined && link != undefined && tag != "")
						SetPref('menu2link'+i,tag+';'+link);
					else SetPref('menu2link'+i,';');
				} top.frames[0].location.reload(); event.stopPropagation(); event.preventDefault();
			}, true);
			menu2Span.appendChild(document.createElement('center'));
			menu2Span.lastChild.appendChild(select);
			menu2Span.lastChild.appendChild(document.createElement('br'));
			menu2Span.lastChild.appendChild(document.createElement('br'));
			menu2Span.lastChild.appendChild(choice);

			// Put it all together (-ish.)
			bigSpan.appendChild(menu1Span);
			bigSpan.appendChild(menu2Span);
			bigSpan.appendChild(document.createElement('hr'));

			var ul = document.createElement('a');
			var ulspan = document.createElement('span');
			ul.setAttribute('href','#');
			ul.innerHTML = "Check For Update";
			ul.addEventListener('click',function(event)
			{	GM_get("noblesse-oblige.org/lukifer/scripts/MrScript.version.txt", function(txt)
				{	var uspan = document.getElementsByName('updatespan')[0];
					var txtsplit = txt.split(',');
					var versionNumber = txtsplit[0].replace('.','').replace('.','');
					if (parseInt(versionNumber,10) <= VERSION)
					{	uspan.innerHTML = "<br>No Update Available.";
						GM_setValue('MrScriptLastUpdate', parseInt(new Date().getTime()/3600000)); return;
					} else
					{	uspan.innerHTML = "<br>Version " + txtsplit[0] + " Available: <a target='_blank' href='" +
							txtsplit[1] + "'>Update</a>";
				}	}); event.stopPropagation(); event.preventDefault();
			}, true);
			var ul2 = document.createElement('a');
			ul2.setAttribute('href','#');
			ul2.innerHTML = "Update Item DB";
			ul2.addEventListener('click',function(event)
			{	if (confirm("Are you sure? You should only perform this action if Mr. Script is not functioning properly."))
				{	UpdateItemDB(0); alert("Database will attempt to update. Please contact Lukifer if the problem persists.");
			}	}, true);
			ulspan.setAttribute('class','tiny');
			ulspan.setAttribute('name','updatespan');
			var centre = document.createElement('center');
			centre.appendChild(ulspan);
			ulspan.appendChild(ul);
			ulspan.appendChild(document.createTextNode(' - '));
			ulspan.appendChild(ul2);
			bigSpan.appendChild(centre);

			var prefLink = document.createElement('a');
			with(prefLink)
			{	innerHTML = "Mr. Script's Choicetastic Optionarium";
				setAttribute('href','javascript:toggle("scriptpref");');
				setAttribute('onclick','if (document.getElementById("scriptpref").getAttribute("style").indexOf("none") != -1)' +
					' window.setTimeout("self.location.hash=\'opt\';",50)');
			}
			var prefAnchor = document.createElement('a');
			prefAnchor.setAttribute('name','opt'); prefAnchor.innerHTML = " ";
			var pDiddy = document.createElement('p');
			with(pDiddy)
			{	appendChild(prefAnchor);
				appendChild(prefLink);
				appendChild(bigSpan);
			}

			// Look at all these children. Tables get *around*, man.
			var addHere = tables[i].rows[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
			addHere.appendChild(pDiddy); break;
}	}	}


// -----------------------------------------------------------
// HAGNK'S/MANAGESTORE/STASH: Support autoclear for added rows
// -----------------------------------------------------------
else if (thePath == "/managestore.php" || thePath == "/clan_stash.php" ||
	thePath == "/storage.php" || thePath == "/sendmessage.php")
{	var links = document.getElementsByTagName('a');
	for (var i=0, len=links.length; i<len; i++)
	{	var href = links[i].getAttribute('href');
		if (href != null && href.indexOf("javascript:") != -1 && href.indexOf("add") != -1)
		{	// A mouseout event is the easy way out, since I couldn't find a way
			// to trigger the event AFTER the extra row was added. Meh.
			links[i].addEventListener('mouseout', function(event)
			{	var derp; var autoclear = GetPref('autoclear');
				if (autoclear == 0) return;
				var textBoxes = document.getElementsByTagName('input');
				for (var i=0, len=textBoxes.length; i<len; i++)
				{	derp = textBoxes[i];
					if (derp.type == "text" && derp.value == "1")
					{	if (derp.getAttribute('onclick') == null)
						{	AddAutoClear(derp, autoclear);
					}	}
				}
			}, false); break;
}	}	}


// --------------------------------------
// MAINT: Refresh until rollover is over.
// --------------------------------------
else if (thePath == "/maint.php")
{	window.setTimeout('self.location = "http://www.kingdomofloathing.com";',30000);}