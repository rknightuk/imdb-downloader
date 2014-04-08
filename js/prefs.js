var prefs = {};

chrome.storage.sync.get({
	filePref: 'TorrentMagnetUrl',
	proxy: true
}, function(items) {
	prefs.filePref = items.filePref;
	prefs.proxy = items.proxy ? 'http://yify.unlocktorrent.com/api/list.json' : 'http://yts.re/api/list.json';
});