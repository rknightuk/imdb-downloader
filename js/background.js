var pageTitle = document.title; // Check title, if TV show ignore
var buttons = document.getElementById('overview-bottom');
buttons.innerHTML += '<div style="clear:both;" id="fetching-download">Fetching download links...</div><br>';

// Get user settings
var filePref, qualities = [];
chrome.storage.sync.get({
	filePref: 'TorrentMagnetUrl',
	quality_1080: true, 
	quality_720: true,
	quality_3d: true,
	proxy: true
}, function(items) {
	filePref = items.filePref;
	if (items.quality_1080) qualities.push('1080p');
	if (items.quality_720) qualities.push('720p');
	if (items.quality_3d) qualities.push('3D');

	if (qualities.length === 0) { // No qualities selected
		showMessage('No download qualities selected, please review your IMDB downloader options');
	}
	else if (pageTitle.indexOf("TV Series") != -1) {
		showMessage("IMDB Downloader doesn't currently support TV shows");
	}
	else {
		// Get IMDB movie id
		var id = window.location.pathname.split('/');
		var url = items.proxy ? 'http://yify.unlocktorrent.com' : 'http://yts.re';
		id = id[2];

		if (id === undefined) {
			showMessage('No movie ID found');
		}
		else {
			getMovies(id, url);
		}
	}
});

function showMessage(message) {
	buttons.innerHTML += '<p>'+message+'</p>';
}

function getMovies(id, url) {
	// Get download links
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById('fetching-download').innerHTML = '';
			var movies = JSON.parse(xmlhttp.responseText);
			movies = movies.MovieList;

			if (movies === undefined) {
				showMessage('No downloads available');
			}
			else {
				var count = 0;
				for (var i=0;i<movies.length;i++)
				{
					var movie = movies[i].TorrentMagnetUrl;
					if (filePref != "TorrentMagnetUrl") {
						movie = movies[i].TorrentUrl;
						movie = movie.replace('http://yts.re', 'http://yify.unlocktorrent.com');
					}
					if (qualities.indexOf(movies[i].Quality) != -1) {
						count++;
						buttons.innerHTML += '<a class="imdb-download" href="'+movie+'">'+movies[i].Quality+'</a>';
					}
				}
				if (count === 0) {
					showMessage('No downloads available, adjust your IMDB downloader for better results');
				}
			}
		}
	};
	xmlhttp.open('GET', url+'/api/list.json?keywords='+id, true);
	xmlhttp.send();
}
