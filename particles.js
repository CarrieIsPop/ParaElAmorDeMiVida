// particles.js - Versión Minimalista y Fluida 💖

const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let lastMouseX = 0;
let lastMouseY = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Evento: Al mover el mouse, creamos partículas con límite de frecuencia
window.addEventListener('mousemove', (e) => {
    // Calculamos la distancia movida para no saturar de corazones
    const distance = Math.hypot(e.x - lastMouseX, e.y - lastMouseY);
    
    // Solo crea un corazón si el mouse se ha movido lo suficiente (30px)
    if (distance > 30) {
        particles.push(new HeartParticle(e.x, e.y));
        lastMouseX = e.x;
        lastMouseY = e.y;
    }
});

class HeartParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Tamaño un poco más pequeño para que sea sutil
        this.size = Math.random() * 10 + 5; 
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = Math.random() * 1 + 0.5; // Caen lento
        this.opacity = 1;
        // Colores que "riman" con tu fondo de atardecer en Huancayo
        this.color = `hsl(${Math.random() * 20 + 340}, 100%, 75%)`; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Desvanecimiento más lento y controlado para evitar el parpadeo
        this.opacity -= 0.008; 
    }

    draw() {
        // Evitamos dibujar si la opacidad es muy baja o negativa
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        const s = this.size;
        // Dibujo de corazón más limpio
        ctx.moveTo(this.x, this.y + s / 4);
        ctx.bezierCurveTo(this.x, this.y, this.x - s, this.y, this.x - s, this.y + s / 4);
        ctx.bezierCurveTo(this.x - s, this.y + s, this.x, this.y + s * 1.2, this.x, this.y + s * 1.5);
        ctx.bezierCurveTo(this.x, this.y + s * 1.2, this.x + s, this.y + s, this.x + s, this.y + s / 4);
        ctx.bezierCurveTo(this.x + s, this.y, this.x, this.y, this.x, this.y + s / 4);
        
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    // Limpiamos el rastro anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Eliminación segura cuando dejan de ser visibles
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

animate();