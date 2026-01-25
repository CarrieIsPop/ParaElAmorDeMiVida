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
        usedIds = []; // Reiniciar ciclo
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

// --- 5. NUEVO: Lógica del Termómetro de Ánimo ---
function updateMood(mood) {
    const body = document.body;
    const msg = document.getElementById("mood-message");
    
    // Diccionario de estados
    const reactions = {
        'happy': {
            color: "#ff85a1", 
            text: "¡Esa sonrisa es mi motor! ❤️",
            musicIdx: 0 // Lofi Love Mix
        },
        'tired': {
            color: "#4a4e69", 
            text: "Descansa, yo te cuido... 🌙",
            musicIdx: 1 // Dulces Sueños
        },
        'missyou': {
            color: "#ff4d6d", 
            text: "¡Pronto estaremos juntos! 🥺",
            musicIdx: 0
        }
    };

    const choice = reactions[mood];
    
    // Transición de fondo suave
    body.style.transition = "background 1s ease";
    body.style.backgroundColor = choice.color;
    msg.innerText = choice.text;

    // Cambiar música automáticamente si es un mood diferente
    if (currentSongIndex !== choice.musicIdx) {
        currentSongIndex = choice.musicIdx;
        cambiarCancion();
    }
}

// --- 6. Contadores de Tiempo ---
setInterval(() => {
    const ahora = new Date().getTime();

    const calc = (target, id, mensajeFinal) => {
        const el = document.getElementById(id);
        if (!el) return;

        const d = target - ahora;

        if (d <= 0) {
            el.innerText = mensajeFinal;
            el.classList.add("celebracion");
            return;
        }

        const dias = Math.floor(d / (1000 * 60 * 60 * 24));
        const horas = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        const segs = Math.floor((d % (1000 * 60)) / 1000);

        el.innerText = `${dias}d ${horas}h ${mins}m ${segs}s`;
    };

    calc(ANNIVERSARY, "timer-aniversario", "¡Feliz Aniversario! ❤️");
    calc(FIRST_MONTH, "timer-mes", "¡Feliz primer mes! 😍");
}, 1000);

// --- 7. Interfaz y Efectos Visuales ---
function cambiarTema() {
    const b = document.body;
    const isDark = b.getAttribute("data-theme") === "dark";
    b.setAttribute("data-theme", isDark ? "light" : "dark");
    // Al cambiar de tema, quitamos el color de fondo manual del termómetro
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

// --- 8. Carga Inicial ---
window.onload = () => {
    initCompliments();
    setTimeout(() => {
        const loader = document.getElementById("loader");
        const content = document.getElementById("main-content");
        if(loader) loader.classList.add("hidden");
        if(content) content.classList.remove("hidden");
        escribir();
    }, 4500);
};
