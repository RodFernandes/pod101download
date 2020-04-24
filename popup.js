//validSite();

function validSite() {
  const isSiteValid = document.getElementsByClassName("js-lsn3-play-dialogue");
  console.log(isSiteValid);
  if (isSiteValid && isSiteValid.length > 0)
    if (isSiteValid) {
      const hidePage = document.getElementsByClassName("invalidPage");
      if (hidePage && hidePage.length > 0) {
        hidePage[0].setAttibute("display", "none");
      }
      console.log(hidePage);
    }
}
