document.querySelectorAll('.modeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modeBtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('startGameBtn').addEventListener('click', () => {
    const selectedMode = document.querySelector('.modeBtn.active').dataset.mode;
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const difficulty = document.getElementById('difficulty').value;
    const timerEnabled = document.getElementById('timerOption').checked;
    const theme = document.getElementById('themeOption').value;

    localStorage.setItem('gameMode', selectedMode);
    localStorage.setItem('gridSize', gridSize);
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('timerEnabled', timerEnabled);
    localStorage.setItem('theme', theme);

    window.location.href = 'game.html';
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// gsap.from(".mode-container", {duration:1, opacity:0, y:50, ease:"power3.out"});

// Initialize Tippy.js for tooltips
tippy('[data-tippy-content]', {
    theme: 'light-border',
    animation:'scale',
    delay:[100,0],
    placement:'top'
});
