window.addEventListener("load", () => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
});

Chatbot(
  {
    apiPath: "http://localhost:5000/chat",
    width: "30vw",
  },
  document.getElementById("chatbot")
);
