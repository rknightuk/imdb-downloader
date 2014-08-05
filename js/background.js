var buttons, downloadDiv, target, keywords,
	movies = [],
	movieCount = 0,
	failCount = 0,
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
			buttons.innerHTML += '<p class="movie-downloads"><span id="downloader-'+imdbCode+'">&nbsp;<a href="/title/'+imdbCode+'" class="title">'+title+'</a>&nbsp;</span></p>';
		}

		current = document.getElementById('downloader-'+imdbCode);
		current.innerHTML = '<a href="'+download+'">'+quality+'</a>' + current.innerHTML;
	}

	for (i = 0; i < movies.length; i++) {
		imdbCode2 = movies[i].ImdbCode;
		check = $('#downloader-'+imdbCode2).find('.subtitle-link');

		if (check.length === 0) {
			current.innerHTML += '<a class="subtitle-link" href="#">Subtitles</a>';
			current.innerHTML += '<ul id="subtitle-list-'+imdbCode2+'" class="subtitle-list"></ul>';

			getSubtitles(imdbCode2, current);
		}
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

function getSubtitles(id) {
	subtitleList = document.getElementById('subtitle-list-'+id);
	$.ajax({
		async: true,
		type: 'GET',
		url: 'http://rbbl.ws/proxy/json.php?requrl=http://api.ysubs.com/subs/' + id,
		success: function(data) {
			data = JSON.parse(data);
			subs = data.subs[id];
			langs = Object.keys(subs);
			for (var i = 0; i < langs.length; i++) {
				url = 'http://yifysubtitles.com' + subs[langs[i]][0].url;
				console.log(url);
				lang = langs[i];
				lang = lang.charAt(0).toUpperCase() + lang.slice(1);
				subtitleList.innerHTML += '<li><a href="'+url+'">'+lang+'</a></li>';
			}
		}
	});
}

$('#download-wrapper').on('click', '.subtitle-link', function(e) {
	e.preventDefault();
	$(this).parents().find('.subtitle-list').toggle('fast');
});