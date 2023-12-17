
"use strict";
(() => {
  var navbar = document.getElementById("sidebar");

  if(navbar) {
    window.addEventListener('scroll', stickyFn);

    var sticky = navbar.offsetTop;
    function stickyFn() {
      if (window.scrollY >= 75) {
        navbar.classList.add("sticky-pin")
      } else {
        navbar.classList.remove("sticky-pin");
      }
    }
    window.addEventListener('scroll', stickyFn);
    window.addEventListener('DOMContentLoaded', stickyFn);
  }
})();

