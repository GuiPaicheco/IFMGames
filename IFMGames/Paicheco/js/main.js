// ====================
// RPG "Ecos da Pedra Abissal" - JS Final Integrado
// ====================

// ====================
// Status do jogador
// ====================
let hp = 100;
let mp = 50;
let andar = 30;

// ====================
// Sons
// ====================
const AmbSound = document.getElementById("AmbSound");
const ButtonHoverSound = document.getElementById("ButtonHoverSound");
const ActionButtonSound = document.getElementById("ActionButtonSound");
const ConfigButtonSound = document.getElementById("ConfigButtonSound");
const MapSound = document.getElementById("MapSound");
const RestartSound = document.getElementById("RestartSound");
const SaveSound = document.getElementById("SaveSound");
const WalkieTalkieSound = document.getElementById("WalkieTalkieSound");
const WalkieSendSound = document.getElementById("WalkieSendSound");
const WalkieReceiveSound = document.getElementById("WalkieReceiveSound");

let soundOn = true;
let musicOn = true;

// ====================
// Funções de sons
// ====================
function playSound(audio) {
    if (!audio) return;
    if (audio === AmbSound) {
        if (!musicOn) return;
    } else {
        if (!soundOn) return;
    }
    const clone = audio.cloneNode();
    clone.volume = audio.volume;
    clone.play().catch(() => {});
}

function playActionButton() {
    if (!soundOn) return;
    const clone = ActionButtonSound.cloneNode();
    clone.volume = soundSlider.value / 100;
    clone.play().catch(() => {});
}

// ====================
// Sliders de Som e Música
// ====================
const soundSlider = document.getElementById("sound-slider");
const musicSlider = document.getElementById("music-slider");

soundSlider.addEventListener("input", () => {
    const volume = soundSlider.value / 100;
    soundOn = volume > 0;
    [ActionButtonSound, ButtonHoverSound, ConfigButtonSound, MapSound, RestartSound, SaveSound, WalkieTalkieSound, WalkieSendSound, WalkieReceiveSound].forEach(audio => audio.volume = volume);
});

musicSlider.addEventListener("input", () => {
    const volume = musicSlider.value / 100;
    musicOn = volume > 0;
    AmbSound.volume = volume;
    if (musicOn && AmbSound.paused) AmbSound.play().catch(() => {});
    if (!musicOn) AmbSound.pause();
});

// ====================
// Iniciar música ambiente
// ====================
function startMusic() {
    AmbSound.loop = true;
    AmbSound.volume = musicSlider.value / 100;
    AmbSound.play().catch(() => {});
}

document.addEventListener("click", startMusic, { once: true });
document.addEventListener("keydown", startMusic, { once: true });

// ====================
// Ações do jogador
// ====================
function explorar() {
    playActionButton();
    const evento = eventoAleatorio();
    mostrarDialogo(evento);

    if (evento.includes("perde")) {
        const perda = parseInt(evento.match(/\d+/)[0]);
        hp = Math.max(0, hp - perda);
    }
    if (evento.includes("recupera")) {
        const ganho = parseInt(evento.match(/\d+/)[0]);
        hp = Math.min(100, hp + ganho);
    }
    if (evento.includes("MP")) mp += 10;

    atualizarStatus();
    andar--;
}

function descansar() {
    playActionButton();
    hp = Math.min(100, hp + 20);
    mp = Math.min(50, mp + 10);
    mostrarDialogo("🛌 Você descansa e recupera forças.");
    atualizarStatus();
}

function fugir() {
    playActionButton();
    mostrarDialogo("🏃 Você tenta fugir... mas algo sempre vigia na escuridão.");
}

function usarItem() {
    playActionButton();
    mostrarDialogo("🧪 Você usa uma poção e recupera 30 HP!");
    hp = Math.min(100, hp + 30);
    atualizarStatus();
}

// ====================
// Menus e toggles
// ====================
function toggleSettings() {
    playSound(ConfigButtonSound);
    document.getElementById("settings-box").classList.toggle("hidden");
}

function toggleStateBox() {
    playSound(ConfigButtonSound);
    document.getElementById("state-box").classList.toggle("hidden");
}

function toggleMap() {
    playSound(MapSound);
    document.getElementById("map-box").classList.toggle("hidden");
}

// ====================
// Salvar / Resetar
// ====================
function salvarJogo() {
    localStorage.setItem("rpgSave", JSON.stringify({ hp, mp, andar }));
    playSound(SaveSound);
    mostrarFeedback("💾 Jogo salvo!");
}

function resetarJogo() {
    if (!confirm("Deseja realmente resetar o jogo? Todo o progresso será perdido.")) return;
    playSound(RestartSound);
    fadeRestart();
}

// ====================
// Feedback visual
// ====================
function mostrarFeedback(texto) {
    const fb = document.createElement("div");
    fb.className = "feedback";
    fb.textContent = texto;
    document.body.appendChild(fb);
    fb.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 1500 });
    setTimeout(() => fb.remove(), 1500);
}

function fadeRestart() {
    const fade = document.createElement("div");
    fade.style.position = "fixed";
    fade.style.top = 0;
    fade.style.left = 0;
    fade.style.width = "100%";
    fade.style.height = "100%";
    fade.style.backgroundColor = "black";
    fade.style.opacity = 0;
    fade.style.zIndex = 9999;
    document.body.appendChild(fade);

    fade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: "forwards" });
    setTimeout(() => location.reload(), 800);
}

// ====================
// Carregar jogo
// ====================
function carregarJogo() {
    const save = localStorage.getItem("rpgSave");
    if (save) {
        const data = JSON.parse(save);
        hp = data.hp;
        mp = data.mp;
        andar = data.andar;
        mostrarDialogo("📂 Jogo carregado!");
    }
    atualizarStatus();
}

// ====================
// Pause aprimorado
// ====================
let jogoPausado = false;
const pauseOverlay = document.getElementById("pause-overlay");
const resumeBtn = document.getElementById("resume-btn");
const pauseSound = document.getElementById("ConfigButtonSound");

function pausarJogo() {
    jogoPausado = !jogoPausado;
    playSound(pauseSound);
    pauseOverlay.classList.toggle("active");

    if (jogoPausado) {
        AmbSound.pause();
    } else {
        if (musicOn) AmbSound.play();
    }

    document.querySelectorAll(".choice").forEach(btn => {
        btn.style.pointerEvents = jogoPausado ? "none" : "auto";
        btn.style.opacity = jogoPausado ? "0.5" : "1";
    });

    ["#walkie-icon", "#state-icon", "#map-icon", "#volume-icon"].forEach(id => {
        const el = document.querySelector(id);
        el.style.pointerEvents = jogoPausado ? "none" : "auto";
        el.style.opacity = jogoPausado ? "0.5" : "1";
    });

    ["#walkie-box", "#state-box", "#map-box", "#settings-box"].forEach(id => {
        const el = document.querySelector(id);
        el.style.pointerEvents = jogoPausado ? "none" : "auto";
        el.style.opacity = jogoPausado ? "0.5" : "1";
    });
}

resumeBtn.addEventListener("click", () => pausarJogo());

// ====================
// Walkie-Talkie
// ====================
const walkieIcon = document.getElementById("walkie-icon");
const walkieBox = document.getElementById("walkie-box");
const walkieInput = document.getElementById("walkie-input");
const walkieSend = document.getElementById("walkie-send");
const walkieChat = document.getElementById("walkie-chat");

walkieIcon.addEventListener("click", () => {
    playSound(WalkieTalkieSound);
    walkieBox.style.display = walkieBox.style.display === "flex" ? "none" : "flex";
});

walkieSend.addEventListener("click", () => {
    const msg = walkieInput.innerText.trim();
    if (!msg) return;
    if (!confirm("📡 Deseja realmente enviar esta mensagem?")) return;

    playSound(WalkieSendSound);

    const userMsg = document.createElement("div");
    userMsg.classList.add("walkie-msg", "you");
    userMsg.textContent = `Paicheco: ${msg}`;
    walkieChat.appendChild(userMsg);
    walkieChat.scrollTop = walkieChat.scrollHeight;

    walkieInput.innerText = "";
    walkieSend.disabled = true;

    setTimeout(() => {
        const otherMsg = document.createElement("div");
        otherMsg.classList.add("walkie-msg", "other");
        otherMsg.textContent = "Outro jogador: Mensagem recebida!";
        walkieChat.appendChild(otherMsg);
        walkieChat.scrollTop = walkieChat.scrollHeight;

        playSound(WalkieReceiveSound);
        walkieSend.disabled = false;
    }, 6000);
});

// ====================
// Hover para todos os botões
// ====================
document.querySelectorAll("button, .choice, .settings-option, #walkie-send, #map-icon, #state-icon, #volume-icon, #walkie-icon").forEach(btn => {
    btn.addEventListener("mouseenter", () => playSound(ButtonHoverSound));
});
