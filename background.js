// just place a div at top right
var div = document.createElement('div');
div.id = 'myDiv';
div.style.position = 'fixed';
div.style.top = 0;
div.style.right = 0;
div.style.padding = '5px';
div.style.background = '#fff';
div.style.border = '1px solid black';
document.body.appendChild(div);

// Get movie title
var title = document.getElementsByTagName('h1');
title = title[0].outerText;
title = title.replace('(', '');
title = title.replace(')', '');

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
		for (var i=0;i<movies.length;i++)
		{ 
			console.log(movies[i]);
			buttons.innerHTML += '<p><a href="'+movies[i].TorrentMagnetUrl+'">'+movies[i].Quality+'</a></p>';
		}
	}
};
xmlhttp.open('GET','http://yify.unlocktorrent.com/api/list.json?keywords='+title, true);
xmlhttp.send();