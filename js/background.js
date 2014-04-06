function getPrefs(site) {
	// Get user settings
	var filePref;
	chrome.storage.sync.get({
		filePref: 'TorrentMagnetUrl',
		proxy: true
	}, function(items) {
		filePref = items.filePref;
		var keyword = getMovieIdOrTitle();
		var url = items.proxy ? 'http://yify.unlocktorrent.com' : 'http://yts.re';

		if (keyword === undefined) {
			showMessage('No movie found');
		}
		else {
			getMovies(site, keyword, url, filePref);
		}
	});
}

function showMessage(message) {
	buttons.innerHTML += '<p>'+message+'</p>';
}

function getMovies(site, keyword, url, filePref) {
	// Get download links
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById('download-wrapper').innerHTML = '';
			var movies = JSON.parse(xmlhttp.responseText);
			movies = movies.MovieList;

			if (movies === undefined) {
				showMessage('No downloads available');
			}
			else {
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
				
				for (var i=0;i<movies.length;i++)
				{
					var movie = movies[i].TorrentMagnetUrl,
						quality = movies[i].Quality,
						imdbCode = movies[i].ImdbCode,
						title = movies[i].MovieTitleClean;

					if ( ! document.getElementById('downloader-'+imdbCode)) {
						buttons.innerHTML += '<p class="movie-downloads"><span id="downloader-'+imdbCode+'">&nbsp;<a href="/title/'+imdbCode+'">'+title+'</a>&nbsp;</span></p>';
					}

					if (filePref != "TorrentMagnetUrl") {
						movie = movies[i].TorrentUrl;
						movie = movie.replace('http://yts.re', 'http://yify.unlocktorrent.com');
					}
					current = document.getElementById('downloader-'+imdbCode);
					current.innerHTML = '<a href="'+movie+'">'+quality+'</a>' + current.innerHTML;
				}
			}
		}
	};
	xmlhttp.open('GET', url+'/api/list.json?keywords='+keyword+'&limit=50', true);
	xmlhttp.send();
}
