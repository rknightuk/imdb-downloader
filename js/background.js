var buttons, downloadDiv, target, keywords,
	movies = [],
	movieCount = 0,
	failCount = 0,
	url = prefs.proxy,
	filePref = prefs.filePref,
	path = window.location.pathname;

if (path.indexOf('/title') != -1 || path.indexOf('/name') != -1) {
	target = $('#maindetails_center_top');
	keywords = [getKeyword()];
}
else if (path.indexOf('/watchlist') != -1) {
	target = $('.faceter.nojs-hidden');
	keywords = getWatchlistIds();
}

downloadDiv = document.createElement('div');
downloadDiv.id = 'download-wrapper';
downloadDiv.innerHTML = '<p>Fetching download links...</p>';
target.append(downloadDiv);

buttons = document.getElementById('download-wrapper');

failCount = keywords.length;

for (var i = 0; i < keywords.length; i++) {
	getMovie(keywords[i]);
}

function getKeyword() {
	var keyword = window.location.pathname.split('/');
	return keyword[2];
}

function getWatchlistIds() {
	items = document.getElementsByClassName('list_item');
 	
 	var ids = $(".lister-list img").map(function() {
 	    return $(this).data("tconst");
 	}).get();

	return ids;
}

function getMovie(keyword) {
	$.ajax({
		async: true,
		type: 'GET',
		url: 'http://yify.unlocktorrent.com/api/list.json?keywords=' + keyword + '&limit=50',
		success: function(data) {
			if (data.MovieCount) {
				appendMovies(data.MovieList);
			}
			else {
				failCount--;
			}

			if (failCount === 0) {
				buttons.innerHTML = '<p>No downloads available</p>';
			}
		}
	});
}

function appendMovies(movies) {
	movieCount++;
	if (movieCount == 1) {
		buttons.innerHTML = '';
	}
	movies = sortMovies(movies);
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

function sortMovies(movies) {
	movies.sort(function(a, b){
		var nameA = a.MovieTitleClean.toLowerCase(),
			nameB = b.MovieTitleClean.toLowerCase(),
			qualityA = a.Quality == '3D' ? 'zz' : a.Quality.toLowerCase(),
			qualityB = b.Quality == '3D' ? 'zz' : b.Quality.toLowerCase();

		if (nameA < nameB)
			return -1; 
		if (nameA > nameB)
			return 1;
		if (qualityA > qualityB)
			return -1;
		if (qualityA < qualityB)
			return 1;
		return 0;
	});

	return movies;
}