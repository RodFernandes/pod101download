console.log("background running");

chrome.runtime.onMessage.addListener(function (message, callback) {
  if (message) {
    downloadAll(message.data, message.id);
  }
});

function downloadAll(data, id) {
  console.log("downloadAll");
  const items = data.audioComp;
  id = "tableaudiocomp";
  let i = 0;
  const timeout = setInterval(function () {
    if (i < items.length) {
      downloadFile(items[i].file, items[i].text, "tableaudiocomp", i + 1, data);
      i++;
    }
  }, 2 * 1000);
}

function downloadFile(url, text = "", id, seq, data) {
  console.log("downloadFile");
  if (url) {
    let fileName = getFilename(url);
    const hasParam = fileName.indexOf("?");

    if (hasParam != -1) {
      fileName = fileName.substring(0, hasParam);
    }

    let title = data.title;
    const number = data.lessonNumber;

    title = cleanString(title);

    const folder = setFileFolder(id);
    if (folder) {
      if (text) {
        text = cleanString(text.trim());
        if (seq) {
          text = seq + "_" + text;
        }
        fileName = folder + text + "_" + fileName;
      } else {
        fileName = folder + fileName;
      }
    }

    fileName = "101Donwloads/" + number + "_" + title + "/" + fileName;

    console.log(url);
    console.log(fileName);

    chrome.downloads.download({
      url: url,
      filename: fileName,
    });
  }
}

function getFilename(url) {
  const list = url.split("/");
  let fileName = list[list.length - 1];
  return fileName;
}

function cleanString(string) {
  return string.replace(/['`~!¡@#$%^&*()_|+=?¿;:'".,<>\{\}\[\]\\\/]/gi, "");
}

function setFileFolder(id) {
  if (id == "tableaudiocomp") {
    return "vocabulary/";
  }
  return "";
}
