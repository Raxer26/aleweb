let testaCount = 0;
let croceCount = 0;
let isAnimating = false;
let audioContext = null;
let sfxVolume = 0.7;
let player = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playFlipSound() {
    initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
}

function playResultSound(isWin) {
    initAudioContext();
    
    const notes = isWin ? [523.25, 659.25, 783.99] : [392, 349.23, 329.63];
    
    notes.forEach((freq, i) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(sfxVolume * 0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.type = 'triangle';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, i * 100);
    });
}

function playConfettiSound() {
    initAudioContext();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1200 + Math.random() * 800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(sfxVolume * 0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }, i * 50);
    }
}

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
    
    playConfettiSound();
    
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
    
    playFlipSound();
    
    coin.className = 'coin flipping';
    risEl.innerText = "Lancio in corso...";

    setTimeout(function() {
        coin.classList.remove('flipping');
        
        let nCasuale = Math.random();
        
        if (nCasuale < 0.5) {
            risEl.innerText = "TESTA!";
            coin.className = 'coin landing-head';
            testaCount++;
            playResultSound(true);
        } else {
            risEl.innerText = "CROCE!";
            coin.className = 'coin landing-tail';
            croceCount++;
            playResultSound(true);
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

function toggleMusicPlayer() {
    const body = document.getElementById('musicBody');
    const icon = document.getElementById('toggleIcon');
    
    body.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

function loadYouTubeVideo() {
    const urlInput = document.getElementById('youtubeUrl');
    const url = urlInput.value.trim();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        alert('Inserisci un URL YouTube valido!');
        return;
    }
    
    const container = document.getElementById('youtubeContainer');
    container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function loadPreset(videoId) {
    document.getElementById('youtubeUrl').value = `https://www.youtube.com/watch?v=${videoId}`;
    loadYouTubeVideo();
}

function updateSfxVolume() {
    const slider = document.getElementById('sfxVolume');
    sfxVolume = slider.value / 100;
}

function updateMusicVolume() {
    const slider = document.getElementById('musicVolume');
    const volume = slider.value / 100;
    
    const iframe = document.querySelector('#youtubeContainer iframe');
    if (iframe) {
        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [volume * 100]
        }), '*');
    }
}
