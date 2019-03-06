var getFromClient = () =>
    new Promise( resolve =>
        chrome.storage.sync.get( ['width', 'rebuild', 'state', 'opacity', 'color'], data => resolve( data ) ) );

var getFromClientCB = ( { width, rebuild, state, opacity, color } ) => {
    const minWidth = 320;
    const maxWidth = window.innerWidth;
    const wrapWidth = ( width < minWidth || width > maxWidth  ) ? maxWidth : width,
    base = 12,
    wrap = document.createElement('div');

    wrap.id = "gridy-wrap";
    wrap.className = width ? "gridy-wrap is-container" : "gridy-wrap";
    wrap.style.width =  wrapWidth + 'px';
    wrap.style.opacity = opacity ? opacity : 1;
    for (var i = 0; i < base; i++) {
        const col = document.createElement('div');
        col.className = `gridy-cols gridy-cols-${(i + 1)}`;
        col.style.backgroundColor = color;
        wrap.appendChild(col);
    }
    const wrapAlready = document.getElementById(wrap.id);

    if( rebuild )
    {
        if( wrapAlready ) document.body.removeChild(wrapAlready);

        document.body.appendChild(wrap);

    } else if( !state ) {
        if( wrapAlready ) {
            document.body.removeChild(wrapAlready);
        }
    }
}

getFromClient().then( getFromClientCB )
