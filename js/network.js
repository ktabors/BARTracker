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
 * Make a request for an XML document.
 * 
 * @param url
 *            the url for the 'GET' call
 * @param onSuccess
 *            a call-back for successful completion of request
 * @param onError
 *            a call-back for request failure
 */
function requestXML(url, onSuccess, onError) {
	var req = getXMLHttpRequest();
	if (isNetworkAvailable() && req) {
		try {
			// Support debugging using Firefox/Firebug
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			}
			catch (e) {
				// ...silently fails in all other browsers.
			}
			req.open('GET', url, true);
			
			// request XML data - make sure responseXML holds response 
			req.setRequestHeader("Content-type", "text/xml");
			
			// anonymous call-back function tracking state changes
			req.onreadystatechange = function() {
				if (req.readyState != 4) {
					return;
				}
				if (req.status == 200) {
					onSuccess(req.responseXML);
				}
				else {
					onError("RSS data unavailable " + req.statusText);
				}
			};
			
			// make the request
			req.send(null);
		}
		catch (e) {
			if (onError) {
				onError("cannot make request");
			}
		}
	}
	else {
		if (onError) {
			onError("network not available");
		}
	}
}
