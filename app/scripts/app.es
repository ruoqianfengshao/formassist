const click = (e) => {
  chrome.tabs.executeScript(null,
    {code:`window.AutoInput.init('${e.currentTarget.id}')`});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.js-operation-item');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', click);
  }
});
