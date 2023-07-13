(function () {
  "use strict";
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  var config = {
    /*...config options...*/
  };
  Chatbot(config, document.getElementById("chatbot"));
})();
