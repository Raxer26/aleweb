let testaCount = 0;
let croceCount = 0;
let isAnimating = false;
let audioContext = null;
let sfxVolume = 0.7;
let currentTrackIndex = 0;
let isPlaying = false;

const defaultPlaylist = [
    {
        name: "Lofi Hip Hop Mix",
        artist: "Lofi Girl",
        url: "https://streams.ilovemusic.de/iloveradio17.mp3",
        icon: "🎧"
    },
    {
        name: "Chillhop Radio",
        artist: "Chillhop Music",
        url: "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/",
        icon: "🌙"
    },
    {
        name: "Jazz Radio",
        artist: "Smooth Jazz",
        url: "https://strw3.openstream.co/1498",
        icon: "🎷"
    },
    {
        name: "Electronic Mix",
        artist: "Electro",
        url: "https://streams.ilovemusic.de/iloveradio12.mp3",
        icon: "🎹"
    }
];

let customPlaylist = [...defaultPlaylist];

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

function initMusicPlayer() {
    const audio = document.getElementById('audioPlayer');
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextTrack);
    
    renderPlaylist();
}

function renderPlaylist() {
    const container = document.getElementById('playlistItems');
    container.innerHTML = '';
    
    customPlaylist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.onclick = () => loadTrack(index);
        item.innerHTML = `
            <div class="playlist-item-icon">${track.icon}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-name">${track.name}</div>
                <div class="playlist-item-duration">${track.artist}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function loadTrack(index) {
    const audio = document.getElementById('audioPlayer');
    const track = customPlaylist[index];
    
    currentTrackIndex = index;
    audio.src = track.url;
    
    document.getElementById('trackName').textContent = track.name;
    document.getElementById('trackArtist').textContent = track.artist;
    
    renderPlaylist();
    
    if (isPlaying) {
        audio.play().catch(e => console.log('Autoplay prevented'));
    }
}

function togglePlay() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const trackIcon = document.querySelector('.track-icon');
    
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
        trackIcon.classList.add('paused');
    } else {
        if (!audio.src) {
            loadTrack(0);
        }
        audio.play().catch(e => console.log('Play error:', e));
        playBtn.textContent = '⏸';
        trackIcon.classList.remove('paused');
    }
    
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % customPlaylist.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + customPlaylist.length) % customPlaylist.length;
    loadTrack(currentTrackIndex);
}

function updateProgress() {
    const audio = document.getElementById('audioPlayer');
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    }
}

function updateDuration() {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('duration').textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seekAudio(event) {
    const audio = document.getElementById('audioPlayer');
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
}

function updateMusicVolume() {
    const audio = document.getElementById('audioPlayer');
    const slider = document.getElementById('musicVolume');
    audio.volume = slider.value / 100;
}

function toggleMusicPlayer() {
    const body = document.getElementById('musicBody');
    const icon = document.getElementById('toggleIcon');
    
    body.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

function loadCustomAudio() {
    const urlInput = document.getElementById('customUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Inserisci un URL valido!');
        return;
    }
    
    const customTrack = {
        name: 'Traccia Personalizzata',
        artist: 'Custom',
        url: url,
        icon: '🎵'
    };
    
    customPlaylist.push(customTrack);
    renderPlaylist();
    loadTrack(customPlaylist.length - 1);
    urlInput.value = '';
}

window.onload = initMusicPlayer;
