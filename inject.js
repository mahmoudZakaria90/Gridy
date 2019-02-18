chrome.storage.sync.get( ['wrap', 'state'], ({ wrap, state }) => {
	console.log(wrap, state)
    document.body[state ? 'appendChild' : 'removeChild'](wrap);
} )