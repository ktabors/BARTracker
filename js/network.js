/**
 * Create a cross-browser XMLHttpRequest object
 * 
 * @see requestXML
 * 
 * @return new XMLHttpRequest or null on error
 */
function getXMLHttpRequest() {
	var xmlHttp = null;
	try {
		xmlHttp = new XMLHttpRequest();
	}
	catch (e) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {
		}
	}
	return xmlHttp;
}

/**
 * Make a request for an XML document. Switched to YQL and jQuery to get around cross site scripting.
 * 
 * @param url
 *            the url for the 'GET' call
 * @param onSuccess
 *            a call-back for successful completion of request
 * @param onError
 *            a call-back for request failure
 */
function requestXML(url, onSuccess, onError) {
	$.ajax({
	    url: url,
	    type: 'GET',
	    success: function(res) {
	        onSuccess((new DOMParser()).parseFromString(res.responseText, "text/xml"));
	    },
	      error: function(xhr, textStatus, errorThrown){
	    	  onError("RSS data unavailable -" + textStatus + "- " + xhr.readyState + " - " + xhr.status + " - " + xhr.responseText + " - " + errorThrown + " - " +  url );
	      }
	});
}
