let options = ['Opzione 1', 'Opzione 2', 'Opzione 3', 'Opzione 4'];
let isSpinning = false;
let currentRotation = 0;

const colors = [
    '#ff006e', '#fb5607', '#ffbe0b', '#8338ec', 
    '#3a86ff', '#06d6a0', '#ef476f', '#ffd166'
];

function initWheel() {
    drawWheel();
    renderOptions();
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 190;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    
    const sliceAngle = (2 * Math.PI) / options.length;
    
    options.forEach((option, index) => {
        const startAngle = index * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Orbitron, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        
        const text = option.length > 12 ? option.substring(0, 12) + '...' : option;
        ctx.fillText(text, radius - 20, 5);
        ctx.restore();
    });
    
    ctx.restore();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.font = 'bold 14px Orbitron';
    ctx.fillStyle = '#ff006e';
    ctx.textAlign = 'center';
    ctx.fillText('GIRA', centerX, centerY + 5);
}

function renderOptions() {
    const container = document.getElementById('optionsList');
    container.innerHTML = '';
    
    options.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.innerHTML = `
            <span class="option-color" style="background: ${colors[index % colors.length]}"></span>
            <span class="option-text">${option}</span>
            <button onclick="removeOption(${index})" class="remove-btn">✕</button>
        `;
        container.appendChild(item);
    });
}

function addOption() {
    const input = document.getElementById('optionInput');
    const value = input.value.trim();
    
    if (!value) {
        alert('Inserisci un\'opzione!');
        return;
    }
    
    if (options.length >= 8) {
        alert('Massimo 8 opzioni!');
        return;
    }
    
    options.push(value);
    input.value = '';
    drawWheel();
    renderOptions();
}

function removeOption(index) {
    if (options.length <= 2) {
        alert('Minimo 2 opzioni!');
        return;
    }
    
    options.splice(index, 1);
    drawWheel();
    renderOptions();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    const resultDisplay = document.getElementById('resultDisplay');
    
    spinBtn.disabled = true;
    resultDisplay.textContent = '';
    
    const spins = 5 + Math.random() * 5;
    const targetRotation = currentRotation + (spins * 360) + (Math.random() * 360);
    
    const duration = 5000;
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            
            const normalizedRotation = ((currentRotation % 360) + 360) % 360;
            const sliceAngle = 360 / options.length;
            const winningIndex = Math.floor((360 - normalizedRotation + sliceAngle / 2) / sliceAngle) % options.length;
            
            resultDisplay.innerHTML = `
                <div class="result-label">Risultato:</div>
                <div class="result-value">🎉 ${options[winningIndex]} 🎉</div>
            `;
            
            createConfetti();
        }
    }
    
    animate();
}

document.getElementById('optionInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addOption();
    }
});

window.addEventListener('load', initWheel);
