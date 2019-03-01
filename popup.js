(function(){
    let gridToggleBtn = document.querySelector('#grid-toggle-btn');
    let widthInput = document.querySelector('#widthInput');
    let opacityRange = document.querySelector('#opacityRange');
    let colorPicker = document.querySelector('#colorPicker');
    let state = false;

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

    let toggleCB = function(e){
        state = !state;
        if( state ) {
            e.currentTarget.className += ' is-on';
        } else {
            e.currentTarget.className = 'grid-toggle-btn';
        }
        chrome.storage.sync.set( {
            width: widthInput.value ? Number(widthInput.value) : null,
            opacity: opacityRange.value ? opacityRange.value : null,
            color: colorPicker.value ? colorPicker.value : null,
            rebuild: state,
            state
        } );
        chromeInject('executeScript', 'inject.js');
    }

    gridToggleBtn.onclick = toggleCB;

    gridToggleBtn.addEventListener('mousedown', chromeInject.bind(null, 'insertCSS', 'inject.css'), { once : true });


    widthInput.oninput = chromeSyncCB('width');

    opacityRange.oninput = chromeSyncCB('opacity');

    colorPicker.oninput = chromeSyncCB('color');

})();
