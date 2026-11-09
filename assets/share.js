/* IKJON share bar: "Copy link" and the phone's own share sheet. No tracking. */
(function () {
  document.querySelectorAll(".sharebar").forEach(function (bar) {
    var url = bar.getAttribute("data-url"), title = bar.getAttribute("data-title");
    bar.querySelectorAll("button.js").forEach(function (b) {
      var act = b.getAttribute("data-act");
      if (act === "share" && !navigator.share) return;
      if (act === "copy" && !(navigator.clipboard && navigator.clipboard.writeText)) return;
      b.hidden = false;
      b.addEventListener("click", function () {
        if (act === "share") { navigator.share({title: title, url: url}).catch(function () {}); return; }
        navigator.clipboard.writeText(url).then(function () {
          var old = b.textContent; b.textContent = bar.getAttribute("data-copied");
          setTimeout(function () { b.textContent = old; }, 1800);
        }).catch(function () {});
      });
    });
  });
})();
