document.addEventListener('DOMContentLoaded', () => {
    const mode = localStorage.getItem('gameMode') || 'random';
    const gridSize = parseInt(localStorage.getItem('gridSize')) || 3;
    const difficulty = localStorage.getItem('difficulty') || 'medium';
    const timerEnabled = (localStorage.getItem('timerEnabled') === 'true');
    const theme = localStorage.getItem('theme') || 'default';

    // Initialize Controllers
    const audioCtrl = new AudioController();
    const uiCtrl = new UIController(theme);
    const gameCtrl = new GameController(gridSize, mode, difficulty, timerEnabled, audioCtrl, uiCtrl);

    document.getElementById('hintBtn').addEventListener('click', () => gameCtrl.useHint());
    document.getElementById('quitBtn').addEventListener('click', () => { window.location.href='index.html'; });
    document.getElementById('restartBtn').addEventListener('click', () => { window.location.reload(); });
});
