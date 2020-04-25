getStorageData();

function createPdfSection(data) {
  //console.log("PDF");
  //console.log(data.pdf);
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
      const pod = data.pod;

      createPdfSection(pod);
      createAudioSection(pod);
      createAudioCompSection(pod);
    }
  });
}
