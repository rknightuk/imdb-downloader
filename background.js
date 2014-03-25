var filePref;
chrome.storage.sync.get({
	filePref: 'magnet' // default to magnet links
}, function(items) {
	filePref = items.filePref;
});

// Check title, if TV show ignore
var pageTitle = document.title;
if (pageTitle.indexOf("TV Series") != -1) {
	console.log("This is a TV Show");
}
else {
	// Get IMDB movie id
	var id = window.location.pathname.split('/');
	id = id[2];

	// Get download links
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var buttons = document.getElementById('overview-bottom');
			buttons.innerHTML += '<div style="clear:both;"></div><br>';
			var movies = JSON.parse(xmlhttp.responseText);
			movies = movies.MovieList;

			if ( movies === undefined) {
				buttons.innerHTML += '<p>No downloads available</p>';
			}
			else {
				for (var i=0;i<movies.length;i++)
				{
					var movie = movies[i].TorrentMagnetUrl;
					if (filePref != "TorrentMagnetUrl") {
						movie = movies[i].TorrentUrl;
						movie = movie.replace('http://yts.re', 'http://yify.unlocktorrent.com');
					}
					buttons.innerHTML += '<a class="imdb-download" href="'+movie+'">'+movies[i].Quality+'</a>';
				}
			}
		}
	};
	xmlhttp.open('GET','http://yify.unlocktorrent.com/api/list.json?keywords='+id, true);
	xmlhttp.send();
}