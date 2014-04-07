var filePref,
	url,
	movieCount = 0,
	idCount = 0,
	checkCount = 0,
	pageTitle = document.title,
	buttons = document.getElementById('main'),
	downloadDiv = document.createElement('div');
	
downloadDiv.id = 'download-wrapper';
downloadDiv.innerHTML = '<p>Fetching download links...</p>';
$(downloadDiv).insertBefore('#main .clear');
buttons = document.getElementById('download-wrapper');

getPrefs();

function getPrefs() {
	// Get user settings
	chrome.storage.sync.get({
		filePref: 'TorrentMagnetUrl',
		proxy: true
	}, function(items) {
		filePref = items.filePref;
		url = items.proxy ? 'http://yify.unlocktorrent.com' : 'http://yts.re';

		getWatchlistIds();
	});
}

function getWatchlistIds() {
	items = document.getElementsByClassName('list_item');
 
	var links = [];
 
	for (var i = 0; i < items.length; i++) {
	    var a = items[i].getElementsByTagName('a');
	    for (var j = 0; j < a.length; j++) {
	        var href = a[j].href;
	        href = href.split('/');
	        href = href[4];
	        if (links.indexOf(href) == -1) {
				links.push(href);
	        }
	    }
	}
	idCount = links.length;
	for (i = 0; i < links.length; i++) {
		id = links[i];
		console.log(id);
		getMovies(id);
	}
}

function showMessage(message) {
	buttons.innerHTML = '<p>'+message+'</p>';
}

function getMovies(keyword) {
	// Get download links
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var movies = JSON.parse(xmlhttp.responseText);
			movies = movies.MovieList;
			checkCount++;
			if (movies !== undefined) {
				movieCount++;
				if (movieCount === 1) {
					showMessage('');
				}
				var count = 0;
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

				appendDownloadLinks(movies);
			}
			else {
				console.log(movieCount);
				if (checkCount == idCount && movieCount === 0) {
					showMessage('No downloads available');
				}
			}
		}
	};
	xmlhttp.open('GET', url+'/api/list.json?keywords='+keyword+'&limit=50', true);
	xmlhttp.send();
}

function appendDownloadLinks(movies) {
	for (var i=0;i<movies.length;i++)
	{
		var movie = movies[i].TorrentMagnetUrl,
			quality = movies[i].Quality,
			imdbCode = movies[i].ImdbCode,
			title = movies[i].MovieTitleClean;

		if ( ! document.getElementById('downloader-'+imdbCode)) {
			movieCount++;
			buttons.innerHTML += '<p class="movie-downloads"><span id="downloader-'+imdbCode+'" class="downloader-link">&nbsp;<a href="/title/'+imdbCode+'">'+title+'</a>&nbsp;</span></p>';
		}

		if (filePref != "TorrentMagnetUrl") {
			movie = movies[i].TorrentUrl;
			movie = movie.replace('http://yts.re', 'http://yify.unlocktorrent.com');
		}
		current = document.getElementById('downloader-'+imdbCode);
		current.innerHTML = '<a href="'+movie+'">'+quality+'</a>' + current.innerHTML;
	}
}