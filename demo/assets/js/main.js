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
    backgroundImage: null,
    avatar:
      "https://driftt.imgix.net/https%3A%2F%2Fdriftt.imgix.net%2Fhttps%253A%252F%252Fs3.amazonaws.com%252Fcustomer-api-avatars-prod%252F1913439%252F1dc2ae1c2c13837a696a872748e7b756yw9xfnrfvn9d%3Ffit%3Dmax%26fm%3Dpng%26h%3D200%26w%3D200%26s%3D8abfb32ef34beb725a69e03164c7c2a8?fit=max&fm=png&h=200&w=200&s=82130ac2f8c8fdb4b8b4b511b9ee2fad",
    apiPath: "http://localhost:5000/chat",
    width: "30vw",
  },
  document.getElementById("chatbot")
);
