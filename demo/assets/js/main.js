window.addEventListener("load", () => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
});

AsanaChatbot({
  element: "#chatbot",
  backgroundImage: null,
  apiPath: "http://localhost:5000/chat",
  width: "30vw",
});
