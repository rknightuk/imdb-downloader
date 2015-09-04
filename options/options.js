var manifest = chrome.runtime.getManifest(),
	descriptionEl = document.getElementById('description'),
	versionEl = document.getElementById('version-info');

descriptionEl.innerHTML = manifest.description;
versionEl.innerHTML = 'version ' + manifest.version + versionEl.innerHTML;