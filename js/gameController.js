class GameController {
    constructor(gridSize, mode, difficulty, timerEnabled, audioCtrl, uiCtrl) {
        this.gridSize = gridSize;
        this.mode = mode;
        this.difficulty = difficulty;
        this.timerEnabled = timerEnabled;
        this.audioCtrl = audioCtrl;
        this.uiCtrl = uiCtrl;

        this.safeTiles = [];
        this.deadTiles = [];
        this.revealedCount = 0;
        this.score = 0;
        this.hintsUsed = 0;
        this.hintLimit = 3;
        this.timeLeft = 60;

        this.initGame();
    }

    initGame() {
        this.generateTiles();
        this.uiCtrl.createGrid(this.gridSize);
        this.renderTiles();
        if (this.timerEnabled) this.startTimer();
    }

    generateTiles() {
        const totalTiles = this.gridSize * this.gridSize;
        let safeCount;
        switch(this.difficulty) {
            case 'easy':
                safeCount = Math.floor(totalTiles * 0.8);
                break;
            case 'hard':
                safeCount = Math.floor(totalTiles * 0.5);
                break;
            default:
                safeCount = Math.floor(totalTiles * 0.65);
        }

        if (this.mode === 'random') {
            // Random
            let allTiles = Array.from({length: totalTiles}, (_, i) => i);
            this.shuffleArray(allTiles);
            this.safeTiles = allTiles.slice(0, safeCount);
            this.deadTiles = allTiles.slice(safeCount);
        } else {
            // Logical pattern:
            // Example pattern: Safe tiles on a checkerboard pattern
            this.safeTiles = [];
            this.deadTiles = [];
            for (let i=0; i<totalTiles; i++){
                const row = Math.floor(i / this.gridSize);
                const col = i % this.gridSize;
                // Checkerboard pattern: safe if (row+col) % 2 == 0
                if ((row + col) % 2 === 0) {
                    this.safeTiles.push(i);
                } else {
                    this.deadTiles.push(i);
                }
            }

            // Adjust counts if needed
            while (this.safeTiles.length > safeCount) {
                this.deadTiles.push(this.safeTiles.pop());
            }
        }
    }

    renderTiles() {
        const totalTiles = this.gridSize * this.gridSize;
        for (let i=0; i<totalTiles; i++) {
            const tile = this.uiCtrl.createTile(i);
            tile.addEventListener('click', (e) => this.handleTileClick(e, i));
            this.uiCtrl.gameGrid.appendChild(tile);
        }
    }

    handleTileClick(e, idx) {
        const tile = e.target;
                // In handleTileClick method, replace the part where we reveal tiles with UI methods:
        if (this.deadTiles.includes(idx)) {
            // Lose condition
            this.revealAll();
            this.audioCtrl.playLose();
            setTimeout(() => {
                this.uiCtrl.showMessage('You hit a dead tile! Game Over.');
                this.updateLeaderboard();
                window.location.href='leaderboard.html';
            }, 500);
        } else if (this.safeTiles.includes(idx)) {
            const tile = e.target;
            // Use uiCtrl method to reveal visually
            this.uiCtrl.revealTileSafe(tile);
            this.revealedCount++;
            this.score += 10;
            this.uiCtrl.setScore(this.score);
            this.audioCtrl.playReveal();

            if (this.revealedCount === this.safeTiles.length) {
                // Win condition
                this.audioCtrl.playWin();
                setTimeout(() => {
                    this.uiCtrl.showMessage('You cleared all safe tiles! You Win!');
                    this.updateLeaderboard();
                    window.location.href='leaderboard.html';
                }, 500);
            }
        }

    }

    revealAll() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const idx = parseInt(tile.dataset.index);
            if (this.deadTiles.includes(idx)) {
                this.uiCtrl.revealTileDead(tile);
            } else if (this.safeTiles.includes(idx)) {
                this.uiCtrl.revealTileSafe(tile);
            }
        });
    }
    // In useHint method, ensure we call the uiCtrl to hint the tile:
useHint() {
    if (this.hintsUsed >= this.hintLimit) return;
    this.hintsUsed++;
    document.getElementById('hintBtn').textContent = `Hint (${this.hintLimit - this.hintsUsed})`;

    this.audioCtrl.playHint();

    const hiddenSafe = this.safeTiles.filter(i => {
        const t = document.querySelector(`.tile[data-index="${i}"]`);
        return !t.classList.contains('revealed');
    });

    if (hiddenSafe.length > 0) {
        const pick = hiddenSafe[Math.floor(Math.random() * hiddenSafe.length)];
        const hintTile = document.querySelector(`.tile[data-index="${pick}"]`);
        this.uiCtrl.hintTile(hintTile);  // This will animate the hint
    }
}


    startTimer() {
        this.uiCtrl.setTime(this.timeLeft);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.uiCtrl.setTime(this.timeLeft);
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.revealAll();
                this.uiCtrl.showMessage('Time Up! Game Over.');
                this.updateLeaderboard();
                window.location.href='leaderboard.html';
            }
        }, 1000);
    }

    shuffleArray(arr) {
        for (let i=arr.length-1; i>0; i--){
            const j = Math.floor(Math.random()* (i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    updateLeaderboard() {
        let playerName = localStorage.getItem('playerName') || 'Player';
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({name:playerName, score:this.score});
        leaderboard.sort((a,b)=> b.score - a.score);
        leaderboard = leaderboard.slice(0,10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
}
