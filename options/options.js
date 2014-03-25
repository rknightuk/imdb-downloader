function save_options() {
	var filePref;
	var filePrefs = document.getElementsByName('download');
		for (var i = 0; i < filePrefs.length; i++) {
			if (filePrefs[i].checked) {
				filePref = filePrefs[i].value;
				break;
			}
	}

	chrome.storage.sync.set({
		filePref: filePref,
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		filePref: 'TorrentMagnetUrl' // default to magnet links
	}, function(items) {
		document.getElementById(items.filePref).checked = true;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);