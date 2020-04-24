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
  console.log("getDialogues");
  const dialogues = document.getElementsByClassName(element);
  //const domain = getDomainActive();

  if (dialogues) {
    let dataset = [];
    for (dialogue of dialogues) {
      if (!dataset.includes(dialogue.dataset.src)) {
        dataset.push(dialogue.dataset.src);
      }
    }
    console.log(dataset);
  }
}

function showDialoguesTextAll() {
  console.log("setDialoguesTextAll");
  const all = document.getElementById("dialogue_tab_all_0");

  if (all) {
    console.log(all.childNodes[1]);
    all.childNodes[1].click();
    console.log("aria-selected, true");
  }
}

function showExamples() {
  const examples = document.getElementsByClassName(
    "lsn3-lesson-vocabulary__examples"
  );
  if (examples) {
    //examples[0].click();
    for (item of examples) {
      if (item.type == "button") {
        item.click();
        //console.log(item);
      }
    }
  }
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
