var manifest = chrome.runtime.getManifest(),
	versionEl = document.getElementById('version-info');

versionEl.innerHTML = 'version ' + manifest.version + versionEl.innerHTML;