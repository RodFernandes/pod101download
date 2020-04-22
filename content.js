console.log("Chrome Extension go");

chrome.runtime.onMessage.addLIstener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  console.log(message.txt);
  let paragraphs = document.getElementsByTagName("p");
  for (elt of paragraphs) {
    elt.style["background-color"] = "#FF00FF";
  }
}
