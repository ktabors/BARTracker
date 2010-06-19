/**
 * resizeWindow - resize the current widget window 
 * SHP provides a widget.window.resizeWindow, but WM does not, 
 * so we attempt to do a resizeWindow and fall back to resizeTo.
 * 
 * @param width
 *            desired width of window
 * @param height
 *            desired height of window
 */
function resizeWindow(width, height) {
	try {
		widget.window.resizeWindow(width, height);
	}
	catch (e) {
		window.resizeTo(width, height);
	}
}

/**
 * resizeWindow to fit the specified element
 * This function uses style information from the element so that
 * we don't hard code sizes in our JavaScript files.
 * @param id
 *            the id of main element
 */
function resizeWindowToFit(id) {
	var container = document.getElementById(id);
	resizeWindow(container.offsetWidth, container.offsetHeight);
}


/**
 * @return true if network is available (using getIsNetworkAvailable)
 */
function isNetworkAvailable() {
	try {
		return widget.sysInfo.network.getIsNetworkAvailable();
	}
	catch (e) {
		return true;
	}
}
