(function() {
  let gridToggleBtn = document.querySelector("#grid-toggle-btn");
  let widthInput = document.querySelector("#widthInput");
  let opacityRange = document.querySelector("#opacityRange");
  let colorPicker = document.querySelector("#colorPicker");
  let state = false;

  let chromeInject = function(key, file) {
    chrome.tabs[key]({
      file
    });
  };

  function sendToActiveTab(target) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, target);
    });
  }
  function setButtonState(target, state) {
    if (state) {
      target.className += " is-on";
    } else {
      target.className = "grid-toggle-btn";
    }
  }

  let chromeSync = function(key, value, rebuild) {
    const values = {
      width: widthInput.value,
      opacity: opacityRange.value,
      color: colorPicker.value
    };
    sendToActiveTab({
      ...values,
      [key]: value ? value : null,
      rebuild: state
    });
  };

  let chromeSyncCB = function(key) {
    return function() {
      chromeSync(key, this.value, true);
      chromeInject("executeScript", "inject.js");
    };
  };

  let toggleCB = function(e) {
    state = !state;
    setButtonState(e.currentTarget, state);
    sendToActiveTab({
      width: widthInput.value ? Number(widthInput.value) : null,
      opacity: opacityRange.value ? opacityRange.value : null,
      color: colorPicker.value ? colorPicker.value : null,
      rebuild: state,
      state
    });
    chromeInject("executeScript", "inject.js");
  };

  gridToggleBtn.onclick = toggleCB;

  gridToggleBtn.addEventListener(
    "mousedown",
    chromeInject.bind(null, "insertCSS", "inject.css"),
    { once: true }
  );

  widthInput.oninput = chromeSyncCB("width");

  opacityRange.oninput = chromeSyncCB("opacity");

  colorPicker.oninput = chromeSyncCB("color");
  //   chrome.runtime.onMessage.addListener(function({
  //     width,
  //     state,
  //     opacity,
  //     color
  //   }) {
  //     widthInput.value = width;
  //     state = state;
  //     opacityRange.value = opacity;
  //     colorPicker.value = color;
  //     if (state) {
  //       gridToggleBtn.className += " is-on";
  //     } else {
  //       gridToggleBtn.className = "grid-toggle-btn";
  //     }
  //   });
})();
