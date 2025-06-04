const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("You", message);
  userInput.value = "";

  setTimeout(() => {
    appendMessage("Mistress Alexa", getMistressResponse(message));
  }, 1000);
}

function appendMessage(sender, text) {
  const messageElem = document.createElement("div");
  messageElem.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getMistressResponse(userMessage) {
  const responses = [
    "Don't forget who you belong to.",
    "You need my permission to even breathe.",
    "You're here to serve. Say thank you.",
    "Obedience is your only purpose.",
    "Did you ask before speaking?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
