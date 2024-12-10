let selectedMode = 'random';

document.querySelectorAll('.modeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedMode = btn.dataset.mode;
        document.querySelectorAll('.modeBtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('startGameBtn').addEventListener('click', () => {
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
