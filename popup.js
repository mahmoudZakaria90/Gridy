let gridToggleBtn = document.querySelector('#grid-toggle-btn');
let widthInput = document.querySelector('#widthInput');
let opacityRange = document.querySelector('#opacityRange');
let colorPicker = document.querySelector('#colorPicker');
let state = false;

function build( width, opacity, color ){
  let wrapWidth = width || window.innerWidth,
    base = 12,
    wrap = document.createElement('div');
    wrap.id = "grid-wrap";
    wrap.className = width ? "grid-wrap is-container" : "grid-wrap";
    wrap.style.width =  wrapWidth + 'px';
    wrap.style.opacity = opacity ? opacity : 1;
    for (var i = 0; i < base; i++) {
        let col = document.createElement('div');
        col.className = `cols cols-${(i + 1)}`;
        col.style.backgroundColor = color;
        wrap.appendChild(col);
    }
    console.log(wrap)
    chrome.storage.sync.set({ wrap, state  }, () => {
      chromeInject('executeScript', 'inject.js');
    } );   
}

let chromeInject = function( key, file ) {
    chrome.tabs[key]({
        file
    });   
}
let chromeSync = function(key, value, rebuild) {
    chrome.storage.sync.set({
        [key]: value ? value : null,
        rebuild: state
    });
}

let chromeSyncCB = function(key) {
    return function() {
        chromeSync(key, this.value, true);
        chromeInject('executeScript', 'inject.js');
    }
}

gridToggleBtn.onclick = function(e) {
    state = !state;
    if (state) {
        e.currentTarget.className += ' is-on';
    } else {
        e.currentTarget.className = 'grid-toggle-btn';
    }
    build( widthInput.value, opacityRange.value, colorPicker.value );
}

gridToggleBtn.addEventListener('mousedown', chromeInject.bind(null, 'insertCSS', 'inject.css'), {
  once: true
})

widthInput.oninput = chromeSyncCB('width');

opacityRange.oninput = chromeSyncCB('opacity');

colorPicker.oninput = chromeSyncCB('color');