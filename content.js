console.log("Chrome Extension go");

start();

function start() {
  showDialoguesTextAll();
  showExamples();
  createObject();
}

function setStoreData(data) {
  chrome.storage.local.set({ pod: data });
  //chrome.storage.local.clear();
}

function createObject() {
  let pod = {
    title: getTitle(),
    subtitle: getSubtitle(),
    lessonNumber: getLessonNumber(),
    pdf: getPdfs(),
    audio: getAudios(),
    audioComp: getAudiosComplementary(),
  };

  console.log(pod);
  setStoreData(pod);
}

function getAudios() {
  const audios = document.getElementById("download-center");
  let dataset = [];
  if (audios) {
    const list = audios.getElementsByTagName("a");
    for (item of list) {
      const file = item.dataset.trackurl;
      dataset.push(file);
    }
    //console.log(dataset);
  }
  return dataset;
}

function getAudiosComplementary() {
  const selection = ["js-lsn3-play-dialogue", "js-lsn3-play-vocabulary"];
  let dataset = [];
  for (element of selection) {
    const dialogues = document.getElementsByClassName(element);
    if (dialogues) {
      for (item of dialogues) {
        if (!dataset.includes(item.dataset.src)) {
          if (!isBlackListed(item.dataset.src)) {
            dataset.push(setDomain(item.dataset.src));
          }
        }
      }
      //console.log(dataset);
    }
  }
  return dataset;
}

function getPdfs() {
  const pdfs = document.getElementById("pdfs");
  let dataset = [];
  if (pdfs) {
    const list = pdfs.getElementsByTagName("a");
    for (item of list) {
      //const file = item.dataset.trackurl;
      const file = item.href;
      //console.log(item.href);
      // if (!isBlackListed(file)) {
      dataset.push(file);
      //}
    }
    //console.log(dataset);
  }
  return dataset;
}

function getTitle() {
  const lesson = document.getElementsByClassName("r101-headline__cell-a");
  let result = "";
  if (lesson) {
    result = lesson[0].childNodes[1].innerText;
  }
  return result;
}

function getSubtitle() {
  const lesson = document.getElementsByClassName("r101-headline__cell-a");
  let result = "";
  if (lesson) {
    result = lesson[0].childNodes[5].innerText;
  }
  return result;
}

function showDialoguesTextAll() {
  const all = document.getElementById("dialogue_tab_all_0");
  if (all) {
    all.childNodes[1].click();
  }
}

function getLessonNumber() {
  const numbers = document.getElementsByClassName("js-lsn3-collection-nav");
  let result = "";
  if (numbers) {
    console.log("getLessonNumber");
    const idx = numbers[0].selectedIndex;
    const text = numbers[0][idx].text;
    let selected = text.substring(1, 3).trim();

    for (let i = 0; i <= 1; i++) {
      if (selected.length <= 2) {
        selected = "0" + selected;
      }
    }

    result = selected;
  }
  return result;
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

function setDomain(url) {
  if (url.startsWith("/")) {
    return location.protocol + "//" + location.host + url;
  }
  return url;
}
