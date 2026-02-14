// --- 1. Variables Globales y Configuración ---
const ANNIVERSARY = new Date("Jan 17, 2027 00:00:00").getTime();
const FIRST_MONTH = new Date("Feb 17, 2026 00:00:00").getTime();

const playlist = [
    { title: "Lofi Love Mix 🎵", file: "assets/lofi1.mp3" },
    { title: "Dulces Sueños ✨", file: "assets/lofi2.mp3" }
];
let currentSongIndex = 0;
const audio = new Audio(playlist[currentSongIndex].file);
audio.loop = true;

let compliments = [];
let usedIds = JSON.parse(localStorage.getItem('visto')) || [];

// --- 2. Lógica de Cumplidos (JSON) ---
async function initCompliments() {
    try {
        const resp = await fetch('assets/compliments.json');
        compliments = await resp.json();
    } catch (e) {
        console.log("No se encontró el JSON todavía.");
    }
}

function darCumplido() {
    const p = document.getElementById("compliment-text");
    let disponibles = compliments.filter(c => !usedIds.includes(c.id));

    if (disponibles.length === 0) {
        usedIds = []; 
        disponibles = compliments;
    }

    const index = Math.floor(Math.random() * disponibles.length);
    const seleccionada = disponibles[index];

    usedIds.push(seleccionada.id);
    localStorage.setItem('visto', JSON.stringify(usedIds));

    p.style.opacity = 0;
    setTimeout(() => {
        p.innerText = seleccionada.text;
        p.style.opacity = 1;
    }, 300);
}

// --- 3. Efecto Typewriter ---
function escribir() {
    const msg = "Hola mi amor... hice este rincon solo para nosotros. ❤️";
    let i = 0;
    const dest = document.getElementById("typewriter");
    
    if (!dest) return;
    dest.innerHTML = ""; 

    const interval = setInterval(() => {
        if (msg[i] === " ") {
            dest.innerHTML += "&nbsp;";
        } else {
            dest.innerHTML += msg[i];
        }
        
        i++;
        if (i === msg.length) {
            clearInterval(interval);
        }
    }, 90);
}

// --- 4. Reproductor de Música ---
function toggleMusica() {
    const btn = document.getElementById("play-btn");
    if (audio.paused) {
        audio.play().then(() => {
            btn.innerText = "⏸️"; 
        }).catch(err => console.log("Clic necesario para sonar"));
    } else {
        audio.pause();
        btn.innerText = "▶️";
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    cambiarCancion();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    cambiarCancion();
}

function cambiarCancion() {
    audio.src = playlist[currentSongIndex].file;
    document.getElementById("song-title").innerText = playlist[currentSongIndex].title;
    audio.play();
    document.getElementById("play-btn").innerText = "⏸️";
}

// --- 5. Lógica del Termómetro ---
function updateMood(mood) {
    const body = document.body;
    const msg = document.getElementById("mood-message");
    
    const reactions = {
        'happy': { color: "#ceb36d", text: "¡Esa sonrisa es mi motor! ❤️", musicIdx: 0 },
        'tired': { color: "#1d3557", text: "Descansa, yo te cuido... 🌙", musicIdx: 1 },
        'missyou': { color: "#6d597a", text: "¡Pronto estaremos juntos! 🥺", musicIdx: 0 }
    };

    const choice = reactions[mood];
    body.style.transition = "background 1s ease";
    body.style.backgroundColor = choice.color;
    msg.innerText = choice.text;

    if (currentSongIndex !== choice.musicIdx) {
        currentSongIndex = choice.musicIdx;
        cambiarCancion();
    }
}

// --- 6. Mini-Juego de Nuestra Historia ---
const questions = [
    { q: "¿En que fecha nos hicimos novios?", a: "17 de Enero", options: ["15 de Enero", "17 de Enero", "20 de Enero", "17 de Febrero"] },
    { q: "¿Cual fue nuestra primera canción?", a: "Eres", options: ["Eres", "Saturno", "Cunumi", "Mi persona favorita"] },
    { q: "¿Que hice para ti en el registro de amor?", a: "Una web", options: ["Un dibujo", "Una web", "Un video", "Una carta"] },
    { q: "¿Cual es mi comida favorita?", a: "Mostrito", options: ["Salchipapa", "Hamburguesa", "Todo lo comestible", "Mostrito"]},
    { q: "¿Cual es mi color favorito?", a: "Rosa Pastel", options: ["Negro", "Azul neon", "Salmon", "Rosa Pastel"]},
    { q: "¿Como se llama nuestra mascotita?", a: "Sushi", options: ["Destructor de galaxias", "Espanta coños", "Sushi", "Kimberly"]},
    { q: "¿Mi personaje de serie favorito?", a: "Mr. Robot", options: ["Gumball", "Zoe", "Fluttershy", "Mr. Robot"]},
    { q: "¿Mi juego favorito?", a: "League Of Legends", options: ["League Of Legends", "Roblox", "Left 4 Dead", "Minecraft"]},
    { q: "¿Mi personaje de juego favorito?", a: "Zoe", options: ["Panda", "Mordekaiser", "Gummy Bee", "Zoe"]},
    { q: "¿Cuando es mi cumpleaños?", a: "4 de Diciembre", options: ["24 de Diciembre", "4 de Noviembre", "4 de Diciembre", "24 de Noviembre"]},
    { q: "¿Que era lo que realmente queria estudiar?", a: "Biologia marina", options: ["Biologia marina", "Arquitecto", "Ing. de Software", "Actor nopor"]},
    { q: "¿Mi serie favorita?", a: "Mr.Robot", options: ["My Little Pony", "Fiona y Cake", "Mr.Robot", "Adolescencia"]},
    { q: "¿Que hago para distraerme?", a: "Escuchar musica", options: ["Escuchar musica", "Jugar", "Ver videos", "Comer"]},
    { q: "¿Mi dulce favorito?", a: "GloboPop Led", options: ["Trident", "GloboPop Led", "Chicle en Polvo", "Gomitas trululu"]},
    { q: "¿Quien es mi mejor amigo?", a: "Ander", options: ["Pala", "Fernan", "Ander", "Diego"]},
    { q: "¿Genero de musica que escucho al programar?", a: "Phonk", options: ["Rock", "Romanticas","Pop", "Phonk"]},
    { q: "¿Algo malo de mi?", a: "Ser indeciso", options: ["Pensar mucho", "Mi esquizofrenia", "Mis pensamientos", "Ser indeciso"]},
    { q: "¿Algo bueno de mi?", a: "Ser creativo", options: ["Ser creativo", "Amigable", "Chistoso", "Inteligente"]},
    { q: "¿Lo que me gusta que hagas?", a: "Apoyarme", options: ["Mimarme", "Enviarme fotos", "Apoyarme", "Dedicarme poemas"]},
    { q: "¿Mi animal favorito?", a: "Gatos", options: ["Perros", "Loros", "Gatos", "Peces"]},
    { q: "¿Genero de pelicula que mas me gusta?", a: "Terror", options: ["Romantico", "Accion", "Terror", "Drama"]},
    { q: "¿Mi anime favorito?", a: "One Piece", options: ["Dragon Ball", "One Piece", "Sailor Moon", "Solo Leveling"]}
];

let currentQuestionIndex = 0;
let correctAnswers = 0;

function loadQuestion() {
    const qData = questions[currentQuestionIndex];
    const qText = document.getElementById("question-text");
    const container = document.getElementById("options-container");
    
    if(!qText || !container) return;

    qText.innerText = qData.q;
    container.innerHTML = "";

    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        container.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if (selected === questions[currentQuestionIndex].a) {
        correctAnswers++;
        updateProgressBar();
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishGame();
    }
}

function updateProgressBar() {
    const progress = (correctAnswers / questions.length) * 100;
    const bar = document.getElementById("progress-bar");
    if(!bar) return;
    bar.style.width = `${progress}%`;
    bar.innerText = `${Math.round(progress)}%`;
}

function finishGame() {
    const quizCard = document.getElementById("quiz-card");
    const reward = document.getElementById("reward-area");
    const retry = document.getElementById("retry-area");
    
    if(quizCard) quizCard.classList.add("hidden");

    const progress = (correctAnswers / questions.length) * 100;

    if (progress === 100) {
        if(reward) reward.classList.remove("hidden");
        localStorage.setItem('juegoGanado', 'true');
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        if(retry) retry.classList.remove("hidden");
    }
}

function restartGame() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    updateProgressBar();
    document.getElementById("retry-area").classList.add("hidden");
    document.getElementById("reward-area").classList.add("hidden");
    document.getElementById("quiz-card").classList.remove("hidden");
    loadQuestion();
}

// --- 7. Contadores, Temas y Efectos ---
setInterval(() => {
    const ahora = new Date().getTime();
    const calc = (target, id, mensajeFinal) => {
        const el = document.getElementById(id);
        if (!el) return;
        const d = target - ahora;
        if (d <= 0) { el.innerText = mensajeFinal; return; }
        const dias = Math.floor(d / (1000 * 60 * 60 * 24));
        const horas = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        const segs = Math.floor((d % (1000 * 60)) / 1000);
        el.innerText = `${dias}d ${horas}h ${mins}m ${segs}s`;
    };
    calc(ANNIVERSARY, "timer-aniversario", "¡Feliz Aniversario! ❤️");
    calc(FIRST_MONTH, "timer-mes", "¡Feliz primer mes! 😍");
}, 1000);

function cambiarTema() {
    const b = document.body;
    const isDark = b.getAttribute("data-theme") === "dark";
    b.setAttribute("data-theme", isDark ? "light" : "dark");
    b.style.backgroundColor = ""; 
    document.getElementById("theme-toggle").innerText = isDark ? "🌙" : "☀️";
}

document.addEventListener('mousedown', (e) => {
    for(let i=0; i<8; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = e.pageX + 'px';
        s.style.top = e.pageY + 'px';
        s.style.setProperty('--x', (Math.random()-0.5)*120+'px');
        s.style.setProperty('--y', (Math.random()-0.5)*120+'px');
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
    }
});

// --- 8. Lógica de San Valentín ---
function checkValentineDate() {
    const ahora = new Date();
    const fechaEvento = new Date(2026, 1, 10); 
    const btn = document.getElementById("btn-evento");
    const msg = document.getElementById("lock-message");

    if (ahora >= fechaEvento) {
        if(btn) btn.classList.remove("hidden");
        if(msg) msg.classList.add("hidden");
    }
}

function irAEvento() {
    window.location.href = "evento1.html";
}

// --- 9. ÚNICA CARGA INICIAL (UNIFICADA) ---
window.onload = () => {
    initCompliments();
    
    // Verificamos San Valentín
    checkValentineDate();

    // Verificamos si ya ganó el juego
    const yaGano = localStorage.getItem('juegoGanado') === 'true';
    const rewardArea = document.getElementById("reward-area");
    const quizCard = document.getElementById("quiz-card");

    if (yaGano && rewardArea && quizCard) {
        quizCard.classList.add("hidden");
        rewardArea.classList.remove("hidden");
        const bar = document.getElementById("progress-bar");
        if(bar) { bar.style.width = "100%"; bar.innerText = "100%"; }
    } else {
        loadQuestion();
    }

    // Loader y Typewriter
    setTimeout(() => {
        const loader = document.getElementById("loader");
        const content = document.getElementById("main-content");
        if(loader) loader.classList.add("hidden");
        if(content) content.classList.remove("hidden");
        escribir();
    }, 4500);
};
