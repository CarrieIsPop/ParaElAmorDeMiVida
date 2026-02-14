// evento1.js - Lógica de San Valentín (Con Playlist Automática)

// 1. CONFIGURACIÓN DE HORARIOS
const horarios = [
    new Date(2026, 1, 14, 8, 0, 0).getTime(),
    new Date(2026, 1, 14, 16, 0, 0).getTime(),
    new Date(2026, 1, 14, 22, 0, 0).getTime()
];

// --- LÓGICA DE AUDIO (PLAYLIST SECUENCIAL) ---
let musicStarted = false;
const bgMusic = document.getElementById('bg-music');

// NUEVO: Cuando termine la primera canción, reproduce la segunda
if (bgMusic) {
    bgMusic.addEventListener('ended', function() {
        // Cambiamos a la segunda canción
        this.src = "assets/MusicaEvento2.mp3"; 
        this.load(); // Cargar la nueva fuente
        this.loop = true; // Hacemos que la segunda SÍ se repita en bucle
        this.play().then(() => {
            console.log("Reproduciendo MusicaEvento2...");
        }).catch(e => console.log("Error al cambiar canción:", e));
    });
}

function startMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.volume = 0.2; 
        bgMusic.play().then(() => {
            musicStarted = true;
            // Efecto Fade In (Subir volumen suavemente)
            let fadeIn = setInterval(() => {
                if (bgMusic.volume < 0.5) { 
                    bgMusic.volume += 0.05;
                } else {
                    clearInterval(fadeIn);
                }
            }, 500);
        }).catch(error => {
            console.log("Esperando interacción para iniciar música...");
        });
    }
}

// Actualización de contadores
function updateTimers() {
    const ahora = new Date().getTime();
    let cartasDesbloqueadas = 0;

    horarios.forEach((fecha, index) => {
        const id = index + 1;
        const diff = fecha - ahora;
        const tag = document.getElementById(`timer${id}`);
        const wrapper = document.getElementById(`env${id}`);

        if (diff <= 0) {
            tag.innerText = "¡Mensaje listo! ❤️";
            wrapper.classList.remove('locked');
            cartasDesbloqueadas++;
        } else {
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            tag.innerText = `Faltan: ${h}h ${m}m ${s}s`;
        }
    });

    // Lógica del Regalo Final (Caja)
    const regaloFinal = document.getElementById('final-gift');
    if (regaloFinal) {
        const candadoTexto = regaloFinal.querySelector('.lock-status');
        if (cartasDesbloqueadas === 3) {
            regaloFinal.classList.remove('locked');
            regaloFinal.classList.add('unlocked');
            candadoTexto.innerText = "¡Ábreme! ✨";
        } else {
            regaloFinal.classList.add('locked');
            regaloFinal.classList.remove('unlocked');
            candadoTexto.innerText = "🔒 Bloqueado";
        }
    }
}

setInterval(updateTimers, 1000);
updateTimers();

// 2. FUNCIONES DE APERTURA

function abrirMensaje(num) {
    const env = document.getElementById(`env${num}`);
    if (env.classList.contains('locked')) return;
    startMusic(); cerrarTodo();
    env.classList.add('open'); mostrarModal(`msg${num}`);
    lanzarConfeti(['#ff4d6d', '#ff8fa3', '#ffffff']);
}

function abrirGaleria() {
    startMusic(); cerrarTodo(); mostrarModal('gallery-modal');
    lanzarConfeti(['#ff4d6d', '#ff8fa3', '#ffffff', '#302b63']);
}

// Función del Ramo (Imagen)
function abrirRamo() {
    startMusic(); cerrarTodo();
    mostrarModal('ramo-modal');
    lanzarConfeti(['#d90429', '#003049', '#ffffff']);
}

// Función Carta Final
function abrirCartaFinal() {
    const regalo = document.getElementById('final-gift');
    if (regalo.classList.contains('locked')) return;
    startMusic(); cerrarTodo();
    mostrarModal('msg-final');
    lanzarConfeti(['#ffd700', '#ffffff', '#ff4d6d']);
}

function mostrarModal(modalId) {
    document.getElementById('overlay').classList.add('active');
    document.getElementById(modalId).classList.add('visible');
}

// 3. CIERRE Y EFECTOS

function cerrarTodo() {
    document.querySelectorAll('.envelope-wrapper').forEach(e => e.classList.remove('open'));
    document.querySelectorAll('.modal-letter, .modal-gallery, .modal-hydrangea').forEach(m => m.classList.remove('visible'));
    
    // Cerrar caja regalo si estaba abierta
    const modalFinal = document.getElementById('msg-final');
    if (modalFinal) modalFinal.classList.remove('visible');

    document.getElementById('overlay').classList.remove('active');
}

function lanzarConfeti(colores) {
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: colores
        });
    }, 300);
}

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") cerrarTodo();
});