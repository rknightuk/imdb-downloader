var buttons, downloadDiv, target, keywords,
	movies = [],
	movieCount = 0,
	failCount = 0,
	path = window.location.pathname;

if (path.indexOf('/title') != -1) {
	target = $('.plot_summary_wrapper');
	keywords = [getKeyword()];
}
// Actor pages disabled — Yify no longer returns results by actor ID
// else if (path.indexOf('/name') != -1) {
// 	target = $('#maindetails_center_top');
// 	keywords = [getKeyword()];	
// }
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
		url: 'https://yts.ag/api/v2/list_movies.json?query_term=' + keyword + '&limit=50',
		success: function(data) {
			if (data.data.movie_count) {
				appendMovies(data.data.movies);
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
		for (var j = 0; j < movies[i].torrents.length; j++) {
			var download = movies[i].torrents[j].url,
				quality = movies[i].torrents[j].quality,
				imdbCode = movies[i].imdb_code,
				title = movies[i].title;

			download = download.replace('https://yts.to', 'https://yify.unblockme.net');

			if ( ! document.getElementById('downloader-'+imdbCode)) {
				buttons.innerHTML += '<p class="movie-downloads"><span id="downloader-'+imdbCode+'">&nbsp;<a href="/title/'+imdbCode+'">'+title+'</a>&nbsp;</span></p>';
			}

			current = document.getElementById('downloader-'+imdbCode);
			current.innerHTML = '<a href="'+download+'">'+quality+'</a>' + current.innerHTML;
		}
	}
}

function sortMovies(movies) {
	movies.sort(function(a, b){
		var nameA = a.title.toLowerCase(),
			nameB = b.title.toLowerCase();

		if (nameA < nameB)
			return -1; 
		if (nameA > nameB)
			return 1;
		return 0;
	});

	return movies;
}