var buttons,
	downloadDiv,
	target,
	keywords,
	movies = [],
	url = prefs.proxy,
	filePref = prefs.filePref,
	path = window.location.pathname;

if (path.indexOf('/title') != -1 || path.indexOf('/name') != -1) {
	target = document.getElementById('maindetails_center_top');
	keywords = [getKeyword()];
}
else if (path.indexOf('/watchlist') != -1) {
	target = document.getElementById('main');
	target = target.getElementsByClassName('clear')[0];
	keywords = getWatchlistIds();
}

downloadDiv = document.createElement('div');
downloadDiv.id = 'download-wrapper';
downloadDiv.innerHTML = '<p>Fetching download links...</p>';
target.appendChild(downloadDiv);

buttons = document.getElementById('download-wrapper');

for (var i = 0; i < keywords.length; i++) {
	getMovie(keywords[i]);
}

movies.sort(function(a, b){
	var nameA = a.MovieTitleClean.toLowerCase(),
		nameB = b.MovieTitleClean.toLowerCase(),
		qualityA = a.Quality == '3D' ? 'zz' : a.Quality.toLowerCase(),
		qualityB = b.Quality == '3D' ? 'zz' : b.Quality.toLowerCase();

	if (nameA < nameB) //sort string ascending
		return -1; 
	if (nameA > nameB)
		return 1;
	if (qualityA > qualityB)
		return -1;
	if (qualityA < qualityB)
		return 1;
	return 0; //default return value (no sorting)
});

if (movies.length === 0) {
	buttons.innerHTML = '<p>No downloads available</p>';
	return;
}

$(document).ready(function(){
	appendMovies(movies);
});

function getKeyword() {
	var keyword = window.location.pathname.split('/');
	return keyword[2];
}

function getWatchlistIds() {
	items = document.getElementsByClassName('list_item');
 
	var ids = [];
 
	for (var i = 0; i < items.length; i++) {
	    var a = items[i].getElementsByTagName('a');
	    for (var j = 0; j < a.length; j++) {
	        var href = a[j].href;
	        href = href.split('/');
	        href = href[4];
	        if (ids.indexOf(href) == -1) {
				ids.push(href);
	        }
	    }
	}
	return ids;
}

function getMovie(keyword) {
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://yify.unlocktorrent.com/api/list.json?keywords=' + keyword + '&limit=50',
		success: function(data) {
			if (data.MovieCount) {
				for (var i = 0; i < data.MovieList.length; i++) {
					movies.push(data.MovieList[i]);
				}
			}
		}
	});
}

function appendMovies(movies) {
	buttons.innerHTML = '';
	for (var i = 0; i < movies.length; i++) {
		var download = movies[i].TorrentMagnetUrl,
			quality = movies[i].Quality,
			imdbCode = movies[i].ImdbCode,
			title = movies[i].MovieTitleClean;

		if (filePref != "TorrentMagnetUrl") {
			download = movies[i].TorrentUrl;
			download = download.replace('http://yts.re', 'http://yify.unlocktorrent.com');
		}

		if ( ! document.getElementById('downloader-'+imdbCode)) {
			buttons.innerHTML += '<p class="movie-downloads"><span id="downloader-'+imdbCode+'">&nbsp;<a href="/title/'+imdbCode+'">'+title+'</a>&nbsp;</span></p>';
		}

		current = document.getElementById('downloader-'+imdbCode);
		current.innerHTML = '<a href="'+download+'">'+quality+'</a>' + current.innerHTML;
	}
}