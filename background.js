console.log("background running");
chrome.browserAction.onClicked.addListener(buttonCliked);

function buttonCliked(tab) {
  let msg = {
    txt: "hello",
  };
  chrome.tabs.sendMessage(tab.id, msg);
  console.log(tab);
}
