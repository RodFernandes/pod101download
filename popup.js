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
      td.innerHTML = item;
      tr.appendChild(td);

      td = document.createElement("td");
      td.setAttribute("class", "td101");

      const anchor = document.createElement("a");
      anchor.setAttribute("class", "btnDownload");
      anchor.setAttribute("href", item);
      anchor.innerHTML = "Download";
      anchor.addEventListener("click", function (event) {
        downloadFile(event.path[0].href);
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

function downloadFile(url) {
  if (url) {
    const list = url.split("/");
    let fileName = list[list.length - 1];
    const hasParam = fileName.indexOf("?");

    if (hasParam != -1) {
      fileName = fileName.substring(0, hasParam);
    }

    let title = pod.title;
    const number = pod.lessonNumber;

    title = title.replace(/([^ a-z0-9-_]+)/gi, " ").trim();

    fileName = number + "_" + title + "/" + fileName;
    console.log(fileName);

    //chrome.downloads.onDeterminingFilename
    chrome.downloads.download({
      url: url,
      filename: fileName,
    });
  }
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
