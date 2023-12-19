
"use strict";
(() => {
  var panelReft = document.getElementById("panel-right");
  var panelLeft = document.getElementById("panel-left");

  if(panelReft) {
    window.addEventListener('scroll', stickyFn);

    var sticky = panelReft.offsetTop;
    function stickyFn() {
      if (window.scrollY >= 75) {
        panelReft.classList.add("sticky-pin");
        panelLeft.classList.add("sticky-pin");
      } else {
        panelReft.classList.remove("sticky-pin");
        panelLeft.classList.remove("sticky-pin");
      }
    }
    window.addEventListener('scroll', stickyFn);
    window.addEventListener('DOMContentLoaded', stickyFn);
  }
})();

