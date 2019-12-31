(function() {
  let gridToggleBtn = document.querySelector("#grid-toggle-btn");
  let widthInput = document.querySelector("#widthInput");
  let opacityRange = document.querySelector("#opacityRange");
  let colorPicker = document.querySelector("#colorPicker");
  let state = false;

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

  let chromeSync = function() {
    const values = {
      width: widthInput.value,
      opacity: opacityRange.value,
      color: colorPicker.value
    };
    sendToActiveTab({
      ...values,
      rebuild: state
    });
  };

  let chromeSyncCB = function(key) {
    return function() {
      chromeSync(key, this.value, true);
    };
  };

  let toggleCB = function(e) {
    state = !state;
    setButtonState(e.currentTarget, state);
    sendToActiveTab({
      width: widthInput.value ? widthInput.value : widthInput.defaultValue,
      opacity: opacityRange.value
        ? opacityRange.value
        : opacityRange.defaultValue,
      color: colorPicker.value ? colorPicker.value : colorPicker.defaultValue,
      rebuild: state,
      state
    });
  };

  gridToggleBtn.onclick = toggleCB;

  widthInput.oninput = chromeSyncCB("width");

  opacityRange.oninput = chromeSyncCB("opacity");

  colorPicker.oninput = chromeSyncCB("color");
})();
