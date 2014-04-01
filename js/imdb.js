var site = 'imdb',
	pageTitle = document.title,
	buttons = document.getElementById('overview-bottom');
buttons.innerHTML += '<div style="clear:both;" id="fetching-download">Fetching download links...</div><br>';
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