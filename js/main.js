/** */
var adviseUrl = 'http://www.bart.gov/schedules/advisories/advisories.xml';
var etaUrl = 'http://www.bart.gov/dev/eta/bart_eta.xml';

/**
 * bAdvisories holds the array of Advisories.  Each Advisory object
 * has a title, description, date, and link.
 */
var bAdvisories;

/**
 * A constructor for an Advisory object. 
 * An Advisory contains the following properties: title, link, description
 * 
 * @param title
 * @param link
 * @param description
 * @param date
 */
function Advisory(title, link, description, date) {
	this.title = title;
	this.link = link;
	this.description = description;
	this.date = date;
}

/**
 * Show an error alert with error message
 * 
 * @param text
 *            status message
 */
function showStatus(text) {
	alert(text);
}

/**
 * For resizing the left and right border images on startup or after sliding up/down.
 */
function sideImageResize() {
	$('.lrborder').height(300); // to fix the document height after showing stations
    $('.lrborder').height( $('#body').height()-5);
}

/**
 * Makes the widget full screen and does some button management.
 */
function widgetFullScreen() {
    // button management
    //$('#closeButton').show();
	$('#reloadAdv').hide();
}

/**
 * Hide the close button and show the advisors and reset the height and width
 */
function minFullScreen() {
	// button management
	//$('#closeButton').hide();
	$('#reloadAdv').show();
	$('#reloadEta').hide();
	
	// hide all ETA or Info data and show the advisories
	$("dd:not(:first)").hide();
	$("dd:first").slideDown("slow", function(){ sideImageResize(2); });
	
	//window.location.reload(false);
}

/**
 * For initialization and data reloading of advisory RSS.
 */
function loadAdvisories() {
	requestXML(adviseUrl, iterateAdvisoryXML, showStatus);
}

/**
 * For initialization and data reloading of eta XML.
 */
function loadEtas() {
	requestXML(etaUrl, iterateEtaXML, showStatus);
}

/**
 * Iterate the xml document. For each item in the RSS document, create an
 * Advisory object, and adds that Advisory to our Advisory list display
 * 
 * @param xmlDoc
 *            an xml document
 */
function iterateAdvisoryXML(xmlDoc) {
	var channel = xmlDoc.getElementsByTagName('channel').item(0);	
	var items = channel.getElementsByTagName('item');

	//var items = xmlDoc.getElementsByTagName('item');
	
	bAdvisories = new Array();
	for ( var i = 0; i < items.length; i++) {
		var itemTitle = items[i].getElementsByTagName('title').item(0).firstChild.data;
		var itemLink = items[i].getElementsByTagName('link').item(0).firstChild.data;
		var itemDescription = items[i].getElementsByTagName('description').item(0).firstChild.data;
		var itemDate = items[i].getElementsByTagName('pubDate').item(0).firstChild.data;
		bAdvisories[i] = new Advisory(itemTitle, itemLink, itemDescription, itemDate);
	}
	
	var container = document.getElementById('adviseList');
	container.removeChild(document.getElementById('adviseItemList'));
	var itemList = document.createElement('ul');
	itemList.id = 'adviseItemList';

	for ( var i = 0; i < bAdvisories.length; i++) {
		var aListItem = document.createElement('li');
		aListItem._AdvisoryNumber = i;
		aListItem.id = 'item' + i;
		itemList.appendChild(aListItem);

		var title = document.createTextNode(bAdvisories[i].title);
		var description = document.createTextNode(bAdvisories[i].description);
		var link = bAdvisories[i].link;
		var date = document.createTextNode(bAdvisories[i].date);
		
		var aTitle = document.createElement('a');
		var aDescription = document.createElement('p');
		aTitle.appendChild(title);
		aTitle.setAttribute("onclick", "openURL('" + link + "');" );
		aDescription.appendChild(description);
		aDescription.appendChild(document.createElement("br"));
		aDescription.appendChild(date);

		aListItem.appendChild(aTitle);
		aListItem.appendChild(aDescription);		
		
		if( i+1 != bAdvisories.length ){
			itemList.appendChild(document.createElement('hr'));
		}
	}

	container.appendChild(itemList);
	
	sideImageResize();
}

/**
 * Iterate the xml document. For each item in the RSS document and build the
 * ETA information HTML.
 * 
 * Attach the jQuery accordion listener to the list.
 * 
 * @param xmlDoc
 */
function iterateEtaXML(xmlDoc) {
	var channel = xmlDoc.getElementsByTagName('channel').item(0);
	var time = channel.getElementsByTagName('time').item(0).firstChild.data;
	var stationListTime = document.getElementById('stationListTime').innerHTML = time;

	var items = xmlDoc.getElementsByTagName('station');

	var stationList = document.getElementById('stationList');
	stationList.removeChild(document.getElementById('etaItemList'));
	var itemList = document.createElement('ul');
	itemList.id = 'etaItemList';
	
	for(var i=0; i<items.length; i++){
		var stationName = items[i].getElementsByTagName('name').item(0).firstChild.data;

		var anItem = document.createElement('li');
		anItem.id = 'station' + i;
		anItem.setAttribute('class', 'stationList');
		anItem._StationNumber = i;

		var stationA = document.createElement('a');
		stationA.id = stationName;
		var name = document.createTextNode(stationName);
		stationA.appendChild(name);
		anItem.appendChild(stationA);
		
		// add the ETAs
		var etas = items[i].getElementsByTagName('eta');
		var etaDiv = document.createElement('div');
		for(var j=0; j < etas.length; j++){
			var etaDest = etas[j].getElementsByTagName('destination').item(0).firstChild.data;
			var etaEst = etas[j].getElementsByTagName('estimate').item(0).firstChild.data;

			var aDest = document.createElement('p');
			aDest.appendChild(document.createTextNode(etaDest));
			aDest.appendChild(document.createElement('br'));
			aDest.appendChild(document.createTextNode(etaEst));
			etaDiv.appendChild(aDest);
		}
		
		anItem.appendChild(etaDiv);
		
		if( i+1 != items.length ){
			anItem.appendChild(document.createElement('hr'));
		}
		
		itemList.appendChild(anItem);
	}

	stationList.appendChild(itemList);
	
	// after the list is created hide the station details and attach the accordion listener
	$("li.stationList div").hide();
	$("li.stationList a").click(function(){
		// don't slide if the clicked on is the selected
        if( $(this).attr( "id" ) != $("li.stationList div:visible").prev().attr( "id" )  ) {
          $("li.stationList div:visible").slideUp("slow", function(){ sideImageResize(); });
          $(this).next().slideDown("slow", function(){ sideImageResize(); });
		}
    });
}
