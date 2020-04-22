console.log("Chrome Extension go");

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  console.log(message.txt);

  let paragraphs = document.getElementsByTagName("p");

  const color =
    "#" +
    getColor() +
    getColor() +
    getColor() +
    getColor() +
    getColor() +
    getColor();

  for (elt of paragraphs) {
    elt.style["background-color"] = color;
  }

  console.log(color);
}

function getColor() {
  let rnd = Math.floor(Math.random() * 16);
  return rnd.toString(16);
}
