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
  apiPath: "https://asana-chatbot-api.onrender.com/chat",
  width: "30vw",
});
