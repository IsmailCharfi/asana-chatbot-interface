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
  apiPath:
    window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1"
      ? "http://localhost:5000/chat"
      : "https://asana-chatbot-api.onrender.com/chat",
});
