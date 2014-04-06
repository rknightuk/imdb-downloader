var pageTitle = document.title,
	buttons = document.getElementById('maindetails_center_top'),
	downloadDiv = document.createElement('div');

downloadDiv.id = 'download-wrapper';
downloadDiv.innerHTML = '<p>Fetching download links...</p>';
buttons.appendChild(downloadDiv);
buttons = document.getElementById('download-wrapper');

if (pageTitle.indexOf("TV Series") != -1) {
	showMessage("Movie Downloader doesn't currently support TV shows");
}
else {
	getPrefs();
}

function getMovieIdOrTitle() {
	var keyword = window.location.pathname.split('/');
	keyword = keyword[2];
	return keyword;
}