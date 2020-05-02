console.log("background running");

chrome.runtime.onMessage.addListener(function (message, callback) {
  if (message.data) {
    downloadAll(message.data, message.id);
    var opt = {
      type: "basic",
      title: "Donwload 101",
      message: message.data.title + " background download started",
      iconUrl: "icon_16x16.png",
    };
    chrome.notifications.create("", opt);
    return true;
  }
});

function downloadAll(data, id) {
  console.log("downloadAll");

  let obj = {
    btnText: "",
  };

  const items = data.audioComp;
  id = "tableaudiocomp";
  let i = 0;
  const timeout = setInterval(function () {
    if (i < items.length) {
      downloadFile(items[i].file, items[i].text, "tableaudiocomp", i + 1, data);
      chrome.runtime.sendMessage(
        { btnText: items[i].text, qtdTotal: items.length, qtdActive: i + 1 },
        function () {}
      );
      i++;
    } else {
      clearTimeout(timeout);
      chrome.runtime.sendMessage({ items: "end" }, function () {
        return true;
      });

      var opt = {
        type: "basic",
        title: "Donwload 101",
        message: data.title + " Completed",
        iconUrl: "icon_16x16.png",
      };
      chrome.notifications.create("", opt);
      console.log("end");
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
