let testaCount = 0;
let croceCount = 0;

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        container.appendChild(particle);
    }
}

createParticles();

function lancia() {
    const flipEl = document.getElementById("flip");
    const testaEl = document.getElementById("testa");
    const croceEl = document.getElementById("croce");
    const risEl = document.getElementById("ris");
    
    testaEl.style.opacity = 0;
    croceEl.style.opacity = 0;
    testaEl.style.transform = "scale(0.5) rotateY(180deg)";
    croceEl.style.transform = "scale(0.5) rotateY(180deg)";
    flipEl.style.opacity = 1;
    risEl.innerText = "Moneta in volo...";
    
    let audio = new Audio("suono.mp3");
    audio.play();

    setTimeout(function() {
        flipEl.style.opacity = 0;
        
        let nCasuale = Math.random();
        
        if (nCasuale < 0.5) {
            risEl.innerText = "È uscito: Testa! 🎉";
            testaEl.style.opacity = 1;
            testaEl.style.transform = "scale(1) rotateY(0deg)";
            testaCount++;
        } else {
            risEl.innerText = "È uscito: Croce! 🎉";
            croceEl.style.opacity = 1;
            croceEl.style.transform = "scale(1) rotateY(0deg)";
            croceCount++;
        }
        
        updateStats();

        setTimeout(function() {
            testaEl.style.opacity = 0;
            croceEl.style.opacity = 0;
            testaEl.style.transform = "scale(0.5) rotateY(180deg)";
            croceEl.style.transform = "scale(0.5) rotateY(180deg)";
            risEl.innerText = "Premi il pulsante per lanciare";
        }, 3000);

    }, 1000);
}

function updateStats() {
    const total = testaCount + croceCount;
    if (total > 0) {
        const testaPercent = ((testaCount / total) * 100).toFixed(1);
        const crocePercent = ((croceCount / total) * 100).toFixed(1);
        document.getElementById('stats-text').innerText = 
            `📊 Statistiche: Testa ${testaCount} (${testaPercent}%) | Croce ${croceCount} (${crocePercent}%)`;
    }
}
