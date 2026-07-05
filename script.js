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
    const colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff', '#ffd700', '#ff69b4'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 12 + 6 + 'px';
        confetti.style.height = Math.random() * 12 + 6 + 'px';
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
    
    const coin = document.getElementById("coin");
    const risEl = document.getElementById("ris");
    const btn = document.getElementById("btn-lancia");
    
    btn.disabled = true;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 200);
    
    coin.className = 'coin flipping';
    risEl.innerText = "Lancio in corso...";
    
    let audio = new Audio("suono.mp3");
    audio.volume = 0.5;
    audio.play();

    setTimeout(function() {
        coin.classList.remove('flipping');
        
        let nCasuale = Math.random();
        
        if (nCasuale < 0.5) {
            risEl.innerText = "TESTA!";
            coin.className = 'coin landing-head';
            testaCount++;
        } else {
            risEl.innerText = "CROCE!";
            coin.className = 'coin landing-tail';
            croceCount++;
        }
        
        createConfetti();
        updateStats();

        setTimeout(function() {
            coin.className = 'coin';
            risEl.innerText = "Pronto a lanciare?";
            btn.disabled = false;
            isAnimating = false;
        }, 3500);

    }, 1500);
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
