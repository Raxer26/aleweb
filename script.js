let testaCount = 0;
let croceCount = 0;
let isAnimating = false;
let audio = null;
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;

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

function handleFiles(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const name = file.name.replace(/\.[^/.]+$/, "");
            playlist.push({ name: name, url: url });
        }
    }
    
    renderPlaylist();
    
    if (playlist.length > 0 && !audio) {
        audio = new Audio();
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', nextTrack);
        loadTrack(0);
    }
}

function renderPlaylist() {
    const container = document.getElementById('playlist');
    container.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.onclick = () => loadTrack(index);
        item.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <span class="track-title">${track.name}</span>
        `;
        container.appendChild(item);
    });
}

function loadTrack(index) {
    if (!audio || playlist.length === 0) return;
    
    currentTrackIndex = index;
    audio.src = playlist[index].url;
    audio.volume = document.getElementById('volumeSlider').value / 100;
    
    document.getElementById('trackName').textContent = playlist[index].name;
    renderPlaylist();
    
    if (isPlaying) {
        audio.play().catch(e => console.log('Play error'));
    }
}

function togglePlay() {
    if (!audio || playlist.length === 0) {
        alert('Carica prima dei file MP3!');
        return;
    }
    
    const playBtn = document.getElementById('playBtn');
    
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
    } else {
        audio.play().catch(e => console.log('Play error'));
        playBtn.textContent = '⏸';
    }
    
    isPlaying = !isPlaying;
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play().catch(e => console.log('Play error'));
}

function previousTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play().catch(e => console.log('Play error'));
}

function updateProgress() {
    if (!audio) return;
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    }
}

function updateDuration() {
    if (!audio) return;
    document.getElementById('duration').textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function changeVolume() {
    if (audio) {
        audio.volume = document.getElementById('volumeSlider').value / 100;
    }
}

document.querySelector('.progress-container')?.addEventListener('click', function(e) {
    if (!audio || !audio.duration) return;
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});
