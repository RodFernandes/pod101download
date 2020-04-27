// window.onload = function () {
//   getStorageData();
// };
let qtdTotal = 0;
let pod = {};
getStorageData();

function createPdfSection(data) {
  createSection("tablepdf", data.pdf);
  setQuantity(data.pdf.length, "qtdpdf");
}

function createAudioSection(data) {
  createSection("tableaudio", data.audio);
  setQuantity(data.audio.length, "qtdaudio");
}

function createAudioCompSection(data) {
  console.log("createAudioCompSection");
  console.log(data.audioComp.text);

  createSection("tableaudiocomp", data.audioComp);
  setQuantity(data.audioComp.length, "qtdaudiocomp");
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

function downloadFile(url, text = "", id) {
  if (url) {
    let fileName = getFilename(url);
    const hasParam = fileName.indexOf("?");

    if (hasParam != -1) {
      fileName = fileName.substring(0, hasParam);
    }

    let title = pod.title;
    const number = pod.lessonNumber;

    //title = title.replace(/([^ a-z0-9-_]+)/gi, " ").trim();
    title = cleanString(title);

    const folder = setFileFolder(id);
    if (folder) {
      if (text) {
        fileName = folder + cleanString(text) + "_" + fileName;
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
  return string.replace(/([^ a-z0-9-_]+)/gi, " ").trim();
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
