class UIController {
    constructor(theme) {
        this.theme = theme;
        this.applyTheme(theme);
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.gameGrid = document.getElementById('gameGrid');
    }

    applyTheme(theme) {
        const body = document.body;
        switch(theme) {
            case 'neon':
                body.style.background = 'linear-gradient(45deg, #000, #0ff)';
                break;
            case 'dark':
                body.style.background = '#000';
                break;
            default:
                body.style.background = 'linear-gradient(135deg, #111, #333)';
        }
    }

    createGrid(gridSize) {
        this.gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        this.gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    }

    createTile(idx) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = idx;
        return tile;
    }

    revealTileSafe(tile) {
        tile.classList.add('revealed','safe');
    }

    revealTileDead(tile) {
        tile.classList.add('revealed','dead');
    }

    setScore(score) {
        this.scoreDisplay.textContent = `Score: ${score}`;
    }

    setTime(time) {
        this.timerDisplay.textContent = `Time: ${time}`;
    }

    hintTile(tile) {
        tile.classList.add('hint');
        setTimeout(() => tile.classList.remove('hint'), 1000);
    }

    showMessage(message) {
        alert(message);
    }
}
