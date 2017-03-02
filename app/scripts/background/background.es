const shortcut = {
  "clear-content": "clear",
  "fill-required": "required",
  "fill-all": "all"
}

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.executeScript(null,
    {code:`window.AutoInput.init('${shortcut[command]}')`});
});
