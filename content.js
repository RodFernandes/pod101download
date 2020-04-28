console.log("Chrome Extension go");

start();

function start() {
  showDialoguesTextAll();
  showExamples();
  createObject();
}

function printPage() {
  window.print();
  window.close();
}

function getAudiosComplementary() {
  const selection = ["js-lsn3-play-dialogue", "js-lsn3-play-vocabulary"];
  let dataset = [];
  let count_versionb = 0;
  for (element of selection) {
    const dialogues = document.getElementsByClassName(element);

    if (dialogues) {
      let textList = getAudioText(element);

      for (let i = 0; i < dialogues.length; i++) {
        const datasetUrl = dialogues[i] ? dialogues[i].dataset.src : "";

        let text = "";

        if (isBlackListed(datasetUrl, "_b")) {
          const play = dialogues[i].parentNode.parentNode.childNodes[5];
          if (play) {
            const hasPlay = play.innerHTML.trim();
            if (hasPlay) {
              count_versionb += 1;
            }
          }
        }
        text = textList[i - count_versionb];

        if (isBlackListed(datasetUrl, "_e")) count_versionb += 1;

        if (!hasObjectInArray(dataset, datasetUrl)) {
          if (!isBlackListed(datasetUrl, "_e")) {
            const obj = {
              file: setDomain(datasetUrl),
              text: text,
            };
            dataset.push(obj);
          }
        }
      }
    }
  }
  // console.log(count_versionb);
  // console.log(dataset);
  return dataset;
}

function getAudioText(element) {
  let text = [];
  let result = [];

  if (element == "js-lsn3-play-dialogue") {
    text = document.getElementsByClassName("lsn3-lesson-dialogue__td--text");
  }

  if (element == "js-lsn3-play-vocabulary") {
    text = document.getElementsByClassName("lsn3-lesson-vocabulary__term");
  }

  const lang = getLanguage();

  for (item of text) {
    // if (item.lang != "en") {
    if (item.lang == lang || item.lang == "") {
      const parent = item.parentNode.className;
      if (!parent && item.parentNode.parentNode.childNodes[3]) {
        const parentAudio =
          item.parentNode.parentNode.childNodes[3].childNodes[1];
        if (parentAudio) {
          result.push(item.innerHTML);
        }
      } else {
        if (item.childNodes[1]) result.push(item.childNodes[1].innerText);
        else result.push(item.innerText);
      }
    }
  }
  //console.log(result);
  return result;
}
getLanguage();
function getLanguage() {
  const host = location.host;
  console.log(host);
  const langs = [
    {
      host: "www.englishclass101.com",
      lang: "en",
    },
    {
      host: "www.frenchpod101.com",
      lang: "fr",
    },
    {
      host: "www.italianpod101.com",
      lang: "it",
    },
    {
      host: "www.spanishpod101.com",
      lang: "es",
    },
    {
      host: "www.romanianpod101.com",
      lang: "ro",
    },
    {
      host: "www.polishpod101.com",
      lang: "pl",
    },
    {
      host: "www.chineseclass101.com",
      lang: "zh",
    },
    {
      host: "www.germanpod101.com",
      lang: "de",
    },
  ];
  let result = langs.find((x) => x.host == host);
  if (result) {
    result = result.lang;
  } else {
    console.log("lang not found");
    result = "en";
  }
  console.log(result);
  return result;
}

function hasObjectInArray(source, url) {
  if (!url) return false;

  for (item of source) {
    if (JSON.stringify(item.file) === JSON.stringify(url)) {
      return true;
    }
  }
  return false;
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
      const obj = { file: item.dataset.trackurl };
      dataset.push(obj);
    }
    //console.log(dataset);
  }
  return dataset;
}

// function getAudiosComplementary() {
//   const selection = ["js-lsn3-play-dialogue", "js-lsn3-play-vocabulary"];
//   let dataset = [];
//   for (element of selection) {
//     const dialogues = document.getElementsByClassName(element);
//     if (dialogues) {
//       for (item of dialogues) {
//         if (!dataset.includes(item.dataset.src)) {
//           if (!isBlackListed(item.dataset.src, "_e")) {
//             dataset.push(setDomain(item.dataset.src));
//           }
//         }
//       }
//       //console.log(dataset);
//     }
//   }
//   console.log(dataset);
//   return dataset;
// }

function getPdfs() {
  const pdfs = document.getElementById("pdfs");
  let dataset = [];
  if (pdfs) {
    const list = pdfs.getElementsByTagName("a");
    for (item of list) {
      //const file = item.dataset.trackurl;
      //const file = item.href;
      //console.log(item.href);
      // if (!isBlackListed(file,"_e")) {
      const obj = {
        file: item.href,
      };
      dataset.push(obj);
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
function isBlackListed(url, wildcard) {
  if (url) {
    const name = url.replace(/^(.*[/\\])?/, "").replace(/(\.[^.]*)$/, "");
    return name.indexOf(wildcard) != -1 ||
      name.indexOf("fluency_fast_premium_checklist") != -1
      ? true
      : false;
  }
}

function setDomain(url) {
  if (url.startsWith("/")) {
    return location.protocol + "//" + location.host + url;
  }
  return url;
}
