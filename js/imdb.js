var site = 'imdb',
	pageTitle = document.title,
	buttons = document.getElementById('maindetails_center_top');
buttons.innerHTML += '<div id="download-wrapper"><p>Fetching download links...</p></div><br>';
buttons = document.getElementById('download-wrapper');
if (pageTitle.indexOf("TV Series") != -1) {
	showMessage("Movie Downloader doesn't currently support TV shows");
}
else {
	getPrefs(site);
}

function getMovieIdOrTitle() {
	var keyword = window.location.pathname.split('/');
	keyword = keyword[2];
	return keyword;
}