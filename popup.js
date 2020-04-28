// window.onload = function () {
//   getStorageData();
// };

let qtdTotal = 0;
let pod = {};
getStorageData();
//printPage();

function printPage() {}

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
  if (title) {
    title.innerHTML = data;
  }
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
        anchor.name = item.text;
      }
      anchor.addEventListener("click", function (event) {
        console.log(event);
        event.path[0].setAttribute("class", "btnDownload _clicked");
        downloadFile(event.path[0].href, event.path[0].name, id);
      });

      td.appendChild(anchor);
      tr.appendChild(td);

      table.appendChild(tr);
    }
  }
}

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
      setQtdTotal();
      createBtnDownloadAll("", pod);
      //TEST
      //downloadAll(pod);
    }
  });
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

function downloadAll(data, id) {
  const items = data.audioComp;
  const btndownload = document.getElementById("tableaudiocomp_all_d");
  console.log(btndownload);
  id = "tableaudiocomp";

  let i = 0;
  btndownload.innerText = "Download All (" + items.length + ")";
  const timeout = setInterval(function () {
    if (i < items.length) {
      const btnFiles = document.getElementsByName(items[i].text);
      if (btnFiles) {
        btnFiles[0].setAttribute("class", "btnDownload _clicked");
        console.log(btnFiles[0]);
      }

      console.log("count: " + i);
      console.log("File: " + items[i].file);
      console.log("Text: " + items[i].text);
      console.log("lenght: " + items.length);
      downloadFile(items[i].file, items[i].text, "tableaudiocomp");
      i++;
      if (btndownload) {
        let count = items.length - i;
        let textBtn = "";
        if (count > 0) textBtn = "Download All (" + count + ")";
        else textBtn = "Download All (Completed)";
        btndownload.innerText = textBtn;
      }
    } else {
      console.log("time out clear");
      clearTimeout(timeout);
    }
  }, 2 * 1000);

  // let i = 0;
  // console.log("time out start");
  // const timeout = setInterval(function () {
  //   console.log("count: " + i);
  //   console.log("File: " + items[i].file);
  //   console.log("Text: " + items[i].text);
  //   console.log("lenght: " + items.length);
  //   if (i > items.length) {
  //     clearTimeout(timeout);
  //     console.log("time out clear");
  //   }
  //   i++;
  //   downloads = i;
  // }, 2 * 1000);
}

function downloadFile(url, text = "", id) {
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
        fileName = folder + text + "_" + fileName;
      } else {
        fileName = folder + fileName;
      }
    }

    fileName = number + "_" + title + "/" + fileName;

    //console.log(fileName);

    //chrome.downloads.onDeterminingFilename({
    chrome.downloads.download({
      url: url,
      filename: fileName,
    });
  }
}

function cleanString(string) {
  return string.replace(/[-'`~!¡@#$%^&*()_|+=?¿;:'",<>\{\}\[\]\\\/]/gi, "");
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
