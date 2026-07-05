let testaCount = 0;
let croceCount = 0;
let isAnimating = false;

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 8 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = Math.random() * 15 + 15 + 's';
        container.appendChild(particle);
    }
}

createParticles();

function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#a855f7', '#ec4899', '#6366f1', '#3b82f6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

function lancia() {
    if (isAnimating) return;
    isAnimating = true;
    
    const flipEl = document.getElementById("flip");
    const testaEl = document.getElementById("testa");
    const croceEl = document.getElementById("croce");
    const risEl = document.getElementById("ris");
    const btn = document.getElementById("btn-lancia");
    
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 200);
    
    testaEl.style.opacity = 0;
    croceEl.style.opacity = 0;
    testaEl.style.transform = "scale(0) rotateY(180deg)";
    croceEl.style.transform = "scale(0) rotateY(180deg)";
    flipEl.style.opacity = 1;
    risEl.innerText = "Lancio in corso...";
    
    let audio = new Audio("suono.mp3");
    audio.volume = 0.5;
    audio.play();

    setTimeout(function() {
        flipEl.style.opacity = 0;
        
        let nCasuale = Math.random();
        
        if (nCasuale < 0.5) {
            risEl.innerText = "TESTA!";
            testaEl.style.opacity = 1;
            testaEl.style.transform = "scale(1) rotateY(0deg)";
            testaCount++;
        } else {
            risEl.innerText = "CROCE!";
            croceEl.style.opacity = 1;
            croceEl.style.transform = "scale(1) rotateY(0deg)";
            croceCount++;
        }
        
        createConfetti();
        updateStats();

        setTimeout(function() {
            testaEl.style.opacity = 0;
            croceEl.style.opacity = 0;
            testaEl.style.transform = "scale(0) rotateY(180deg)";
            croceEl.style.transform = "scale(0) rotateY(180deg)";
            risEl.innerText = "Pronto a lanciare?";
            isAnimating = false;
        }, 3500);

    }, 1200);
}

function updateStats() {
    const total = testaCount + croceCount;
    if (total > 0) {
        const testaPercent = ((testaCount / total) * 100).toFixed(1);
        const crocePercent = ((croceCount / total) * 100).toFixed(1);
        document.getElementById('stats-text').innerHTML = 
            `📊 <strong>${total}</strong> lanci | Testa: <strong>${testaCount}</strong> (${testaPercent}%) | Croce: <strong>${croceCount}</strong> (${crocePercent}%)`;
    }
}
