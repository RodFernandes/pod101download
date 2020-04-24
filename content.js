console.log("Chrome Extension go");

start();

function start() {
  showDialoguesTextAll();
  showExamples();
  getAudios("js-lsn3-play-dialogue");
  getAudios("js-lsn3-play-vocabulary");
}

function sendMEssage(message) {}

function getAudios(element) {
  const dialogues = document.getElementsByClassName(element);
  //const domain = getDomainActive();

  if (dialogues) {
    let dataset = [];

    for (item of dialogues) {
      if (!dataset.includes(item.dataset.src)) {
        if (!isBlackListed(item.dataset.src)) {
          dataset.push(item.dataset.src);
        }
      }
    }

    console.log(dataset);
  }
}

function showDialoguesTextAll() {
  const all = document.getElementById("dialogue_tab_all_0");
  if (all) {
    all.childNodes[1].click();
  }
}

function showExamples() {
  const examples = document.getElementsByClassName(
    "lsn3-lesson-vocabulary__examples"
  );
  if (examples) {
    for (item of examples) {
      if (item.type == "button") {
        item.click();
      }
    }
  }
}

// Using when isn't english course
function isBlackListed(url) {
  const audioName = url.replace(/^(.*[/\\])?/, "").replace(/(\.[^.]*)$/, "");
  return audioName.indexOf("_e") != -1 ? true : false;
}

function setDomain(url, domainActive) {
  if (url.startsWith("/")) {
    return domainActive + url;
  }
  return url;
}

function getDomainActive() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    var domain = url.hostname;
  });
}
