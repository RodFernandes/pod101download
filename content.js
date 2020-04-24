console.log("Chrome Extension go");

start();

function start() {
  getAudios("js-lsn3-play-dialogue");
  getAudios("js-lsn3-play-vocabulary");
  setDialoguesTextAll();
}

function sendMEssage(message) {}

function getAudios(element) {
  console.log("getDialogues");
  const dialogues = document.getElementsByClassName(element);

  if (dialogues) {
    let dataset = [];
    for (dialogue of dialogues) {
      dataset.push(dialogue.dataset.src);
    }
    console.log(dataset);
  }
}

// function getDialogues() {
//   console.log("getDialogues");
//   const dialogues = document.getElementsByClassName("js-lsn3-play-dialogue");

//   if (dialogues) {
//     let dataset = [];
//     for (dialogue of dialogues) {
//       dataset.push(dialogue.dataset.src);
//     }
//     console.log(dataset);
//   }
// }

// function getVacabulary() {
//   console.log("getVacabulary");
//   const vocabularies = document.getElementsByClassName(
//     "js-lsn3-play-vocabulary"
//   );

//   if (vocabularies) {
//     let dataset = [];
//     for (vocabulary of vocabularies) {
//       dataset.push(vocabulary.dataset.src);
//     }
//     console.log(dataset);
//   }
// }

function setDialoguesTextAll() {
  console.log("setDialoguesTextAll");
  const all = document.getElementById("dialogue_tab_all_0");

  if (all) {
    console.log(all.childNodes[1]);
    all.childNodes[1].click();
    console.log("aria-selected, true");
  }
}
