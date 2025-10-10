const hoverSound = document.getElementById("hover-sound");
const clickSound = document.getElementById("click-sound");

// Efeito de som ao passar o mouse
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
  });
});

// Efeito e ação ao clicar
document.getElementById("new-game").addEventListener("click", () => {
  clickSound.play();
  setTimeout(() => {
    window.location.href = "pages/main.html";
  }, 300);
});

document.getElementById("load-game").addEventListener("click", () => {
  clickSound.play();
  setTimeout(() => {
    window.location.href = "main.html";
  }, 300);
});

document.getElementById("characters").addEventListener("click", () => {
  clickSound.play();
  setTimeout(() => {
    window.location.href = "pages/characters.html";
  }, 300);
});

document.getElementById("about").addEventListener("click", () => {
  clickSound.play();
  setTimeout(() => {
    window.location.href = "aboutgame.html";
  }, 300);
});
