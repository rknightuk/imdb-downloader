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
		quality_1080: document.getElementById('quality_1080').checked,
		quality_720: document.getElementById('quality_720').checked,
		quality_3d: document.getElementById('quality_3d').checked
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
		filePref: 'TorrentMagnetUrl',
		quality_3d: true,
		quality_1080: true,
		quality_720: true
	}, function(items) {
		document.getElementById(items.filePref).checked = true;
		document.getElementById('quality_1080').checked = items.quality_1080;
		document.getElementById('quality_720').checked = items.quality_720;
		document.getElementById('quality_3d').checked = items.quality_3d;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);