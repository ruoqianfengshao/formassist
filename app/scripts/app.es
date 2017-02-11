const click = (e) => {
  chrome.tabs.executeScript(null,
      {code:`window.AutoInput.init('${e.target.id}')`});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var btns = document.querySelectorAll('button');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', click);
  }
});
