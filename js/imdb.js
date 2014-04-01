var site = 'imdb',
	pageTitle = document.title,
	buttons = document.getElementById('maindetails_center_top');
buttons.innerHTML += '<div style="clear:both;overflow:auto;padding:10px;margin-bottom:20px;border:1px solid #dddddd" id="fetching-download">Fetching download links...</div><br>';
buttons = document.getElementById('fetching-download');
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