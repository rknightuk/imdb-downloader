var prefs = {};

function showSubtitles(e) {
	e.preventDefault();
	$(this).parents().next('ul').toggle('fast');
}

chrome.storage.sync.get({
	filePref: 'TorrentMagnetUrl',
	proxy: true
}, function(items) {
	prefs.filePref = items.filePref;
	prefs.proxy = items.proxy ? 'http://yify.unlocktorrent.com/api/list.json' : 'http://yts.re/api/list.json';
});