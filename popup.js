// window.onload = function () {
//   getStorageData();
// };

let qtdTotal = 0;
let pod = {};
getStorageData();
//printPage()

chrome.runtime.onMessage.addListener(function (message, callback) {
  console.log("message");
  console.log(message);
  if (message.btnText) {
    const btnFiles = document.getElementsByName(message.btnText);
    if (btnFiles) {
      btnFiles[0].setAttribute("class", "btnCopied");
    }
    const btndownload = document.getElementById("tableaudiocomp_all_d");
    if (btndownload) {
      btndownload.innerText =
        "Download All (" + (message.qtdTotal - message.qtdActive) + ")";
    }
    return true;
  }

  if (message.items) {
    if (message.items == "end") {
      const btndownload = document.getElementById("tableaudiocomp_all_d");
      if (btndownload) {
        btndownload.innerText = "Download All (Completed)";
        btndownload.setAttribute("class", "btnCopied");
      }
    }
    return true;
  }
});

function createPdfSection(data) {
  createSection("tablepdf", data.pdf);
  setQuantity(data.pdf.length, "qtdpdf");
}

function createAudioSection(data) {
  createSection("tableaudio", data.audio);
  setQuantity(data.audio.length, "qtdaudio");
}

function createAudioCompSection(data) {
  createSection("tableaudiocomp", data.audioComp);
  setQuantity(data.audioComp.length, "qtdaudiocomp");
}

async function copyTitle(title) {
  try {
    await navigator.clipboard.writeText(cleanString(title));
    console.log("Title copied to clipboard");
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
}

function createBtnDownloadAll(element, data) {
  element = tableaudiocomp;
  const el = "tableaudiocomp" + "_all";
  const span = document.getElementById(el);
  if (span) {
    const anchor = document.createElement("a");
    anchor.setAttribute("class", "btnDownload");
    anchor.setAttribute("id", el + "_d");
    anchor.innerHTML = "Download All";
    anchor.name = "Download All";
    anchor.addEventListener("click", function (event) {
      event.path[0].setAttribute("class", "btnDownload _clicked");
      downloadAll(data, "tableaudiocomp");
    });
    span.appendChild(anchor);
  }
}

function createBtnNewTab() {
  const span = document.getElementById("tableaudiocomp_all_newtab");
  if (span) {
    const anchor = document.createElement("a");
    anchor.setAttribute("class", "btnDownload");
    anchor.innerHTML = "New Tab";
    anchor.name = "new_tab";
    anchor.addEventListener("click", function (event) {
      chrome.tabs.create({ url: "index.html" });
    });
    span.appendChild(anchor);
  }
}

function setQuantity(qtd, element) {
  const span = document.getElementById(element);
  if (span) {
    span.innerHTML = qtd;
    qtdTotal += qtd;
    console.log(qtdTotal);
  }
}

function setQtdTotal() {
  const qtd = document.getElementById("totalfiles");
  if (qtd) {
    qtd.innerHTML = "Total files: " + qtdTotal;
  }
}

function setTitle(number, data) {
  const title = document.getElementById("title");
  if (title) {
    title.innerHTML = "Lesson: " + number + " - " + data;
  }
}

function setSubtitle(data) {
  const title = document.getElementById("subtitle");
  if (!title) return;
  title.innerHTML = data;
  //copyTitle(data);
}

function addBtnCopyTitle(title) {
  const span = document.getElementById("copysubtitle");
  if (!span) return;
  const btn = document.createElement("button");
  btn.setAttribute("class", "btnDownload");
  btn.innerText = "Copy";
  btn.addEventListener("click", function (e) {
    const isCopied = copyTitle(title);
    if (isCopied) {
      btn.innerText = "Copied";
      btn.setAttribute("class", "btnCopied");
    }
  });
  span.appendChild(btn);
}

function createSection(id, data) {
  const table = document.getElementById(id);
  if (table && data) {
    for (item of data) {
      const tr = document.createElement("tr");

      let td = document.createElement("td");
      td.setAttribute("class", "td101");
      if (item.text) {
        let filename = getFilename(item.file);
        filename = cleanString(item.text) + "_" + filename;
        td.innerHTML = filename;
      } else {
        td.innerHTML = getFilename(item.file);
      }

      tr.appendChild(td);

      td = document.createElement("td");
      td.setAttribute("class", "td101");

      const anchor = document.createElement("a");
      anchor.setAttribute("class", "btnDownload");
      anchor.setAttribute("href", item.file);
      anchor.innerHTML = "Download";
      if (item.text) {
        if (item.file.includes("_b.mp3")) {
          anchor.name = item.text + "_b";
        } else {
          anchor.name = item.text;
        }
      }
      anchor.addEventListener("click", function (event) {
        console.log(event);
        event.path[0].setAttribute("class", "btnDownload btnCopied");
        downloadFile(event.path[0].href, event.path[0].name, id);
      });

      td.appendChild(anchor);
      tr.appendChild(td);

      table.appendChild(tr);
    }
  }
}

function getFilename(url) {
  const list = url.split("/");
  let fileName = list[list.length - 1];
  return fileName;
}

function setFileFolder(id) {
  if (id == "tableaudiocomp") {
    return "vocabulary/";
  }
  return "";
}

// function downloadAll(data, id) {
//   const items = data.audioComp;
//   const btndownload = document.getElementById("tableaudiocomp_all_d");
//   console.log(btndownload);
//   id = "tableaudiocomp";

//   let i = 0;
//   btndownload.innerText = "Download All (" + items.length + ")";
//   const timeout = setInterval(function () {
//     if (i < items.length) {
//       const btnFiles = document.getElementsByName(items[i].text);
//       if (btnFiles) {
//         btnFiles[0].setAttribute("class", "btnDownload _clicked");
//         console.log(btnFiles[0]);
//       }

//       downloadFile(items[i].file, items[i].text, "tableaudiocomp", i + 1);
//       i++;
//       if (btndownload) {
//         let count = items.length - i;
//         let textBtn = "";
//         if (count > 0) textBtn = "Download All (" + count + ")";
//         else textBtn = "Download All (Completed)";
//         btndownload.innerText = textBtn;
//       }
//     } else {
//       console.log("time out clear");
//       clearTimeout(timeout);
//     }
//   }, 2 * 1000);

//   // let i = 0;
//   // console.log("time out start");
//   // const timeout = setInterval(function () {
//   //   console.log("count: " + i);
//   //   console.log("File: " + items[i].file);
//   //   console.log("Text: " + items[i].text);
//   //   console.log("lenght: " + items.length);
//   //   if (i > items.length) {
//   //     clearTimeout(timeout);
//   //     console.log("time out clear");
//   //   }
//   //   i++;
//   //   downloads = i;
//   // }, 2 * 1000);
// }

function downloadAll(data, id) {
  const obj = {
    data: data,
    id: id,
  };

  const btndownload = document.getElementById("tableaudiocomp_all_d");
  console.log(btndownload);
  if (btndownload) {
    btndownload.innerText = "Download All (" + data.audioComp.length + ")";
  }
  chrome.runtime.sendMessage(obj, function () {});
}

function downloadFile(url, text = "", id, seq) {
  console.log("downloadFile");
  if (url) {
    let fileName = getFilename(url);
    const hasParam = fileName.indexOf("?");

    if (hasParam != -1) {
      fileName = fileName.substring(0, hasParam);
    }

    let title = pod.title;
    const number = pod.lessonNumber;

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

function cleanString(string) {
  return string.replace(/['`~!¡@#$%^&*()_|+=?¿;:'".,<>\{\}\[\]\\\/]/gi, "");
}

// function downloadFetchFile(filename, url) {
//   fetch(url)
//     .then((resp) => resp.blob())
//     .then((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.style.display = "none";
//       a.href = url;
//       // the filename you want
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       console.log("your file has downloaded!"); // or you know, something with better UX...
//     })
//     .catch(() => alert("download error: -> " + url));
// }

function getStorageData() {
  console.log("get Storage");
  chrome.storage.local.get("pod", function (data) {
    if (typeof data.pod == "undefined") {
      console.log("error getStorageData");
    } else {
      //console.log(data.pod);
      //result = data.pod;
      pod = data.pod;

      createPdfSection(pod);
      createAudioSection(pod);
      createAudioCompSection(pod);
      setTitle(pod.lessonNumber, pod.title);
      setSubtitle(pod.subtitle);
      addBtnCopyTitle(pod.subtitle);
      setQtdTotal();
      createBtnDownloadAll("", pod);
      createBtnNewTab();
      //TEST
      //downloadAll(pod);
    }
  });
}
