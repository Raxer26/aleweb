let testaCount = 0;
let croceCount = 0;
let isAnimating = false;
let audio = null;
let currentRadio = -1;

const radioStations = [
    { name: "Radio 105", url: "https://icy.unitedradio.it/VirginMP3.mp3" },
    { name: "RDS", url: "https://stream.rds.it:8000/rds" },
    { name: "RTL 102.5", url: "https://streamingv2.shoutcast.com/RTL1025" },
    { name: "Kiss Kiss", url: "https://icy.unitedradio.it/KissKissMP3.mp3" },
    { name: "Virgin Radio", url: "https://icy.unitedradio.it/VirginMP3.mp3" },
    { name: "Radio Deejay", url: "https://dj.deejayradio.net/dj_mp3" },
    { name: "Lofi Hip Hop", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
    { name: "Smooth Jazz", url: "https://strw3.openstream.co/1498" }
];

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

function togglePlayer() {
    const body = document.getElementById('musicBody');
    const icon = document.getElementById('toggleIcon');
    
    if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        icon.textContent = '▼';
    } else {
        body.classList.add('hidden');
        icon.textContent = '▲';
    }
}

function playRadio(index) {
    if (!audio) {
        audio = new Audio();
    }
    
    stopAudio();
    
    const station = radioStations[index];
    currentRadio = index;
    
    audio.src = station.url;
    audio.volume = document.getElementById('volumeSlider').value / 100;
    
    document.getElementById('stationName').textContent = '🔊 ' + station.name;
    
    audio.play().catch(e => {
        document.getElementById('stationName').textContent = '❌ Errore connessione';
    });
    
    document.querySelectorAll('.radio-btn').forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function pauseAudio() {
    if (audio && !audio.paused) {
        audio.pause();
        document.getElementById('stationName').textContent = '⏸ In pausa';
    } else if (audio && audio.paused) {
        audio.play();
        if (currentRadio >= 0) {
            document.getElementById('stationName').textContent = '🔊 ' + radioStations[currentRadio].name;
        }
    }
}

function stopAudio() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
    }
    document.getElementById('stationName').textContent = 'Seleziona una radio';
    document.querySelectorAll('.radio-btn').forEach(btn => btn.classList.remove('active'));
}

function changeVolume() {
    if (audio) {
        audio.volume = document.getElementById('volumeSlider').value / 100;
    }
}
