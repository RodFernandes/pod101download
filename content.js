console.log("Chrome Extension go");

start();

function start() {
  showDialoguesTextAll();
  showExamples();
  getPdfs();
  getAudios();
  getAudiosComplementary("js-lsn3-play-dialogue");
  getAudiosComplementary("js-lsn3-play-vocabulary");
}

function sendMEssage(message) {}

function getAudios() {
  const audios = document.getElementById("download-center");
  let dataset = [];
  if (audios) {
    const list = audios.getElementsByTagName("a");
    for (item of list) {
      const file = item.dataset.trackurl;
      dataset.push(file);
    }
  }
}

function getAudiosComplementary(element) {
  const dialogues = document.getElementsByClassName(element);
  let dataset = [];
  if (dialogues) {
    for (item of dialogues) {
      if (!dataset.includes(item.dataset.src)) {
        if (!isBlackListed(item.dataset.src)) {
          dataset.push(item.dataset.src);
        }
      }
    }
    //console.log(dataset);
  }
}

function getPdfs() {
  const pdfs = document.getElementById("pdfs");
  let dataset = [];
  if (pdfs) {
    const list = pdfs.getElementsByTagName("a");
    for (item of list) {
      const file = item.dataset.trackurl;
      if (!isBlackListed(file)) {
        dataset.push(file);
      }
    }
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
  const name = url.replace(/^(.*[/\\])?/, "").replace(/(\.[^.]*)$/, "");
  return name.indexOf("_e") != -1 ||
    name.indexOf("fluency_fast_premium_checklist") != -1
    ? true
    : false;
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
