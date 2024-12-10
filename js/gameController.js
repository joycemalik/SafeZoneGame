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
            let allTiles = Array.from({length: totalTiles}, (_, i) => i);
            this.shuffleArray(allTiles);
            this.safeTiles = allTiles.slice(0, safeCount);
            this.deadTiles = allTiles.slice(safeCount);
        } else {
            // Logical patterns
            const patterns = [this.patternCheckerboard, this.patternDiagonal, this.patternPrimes, this.patternFibonacci];
            const patternFunc = patterns[Math.floor(Math.random()*patterns.length)].bind(this);
            const candidates = patternFunc(totalTiles);
            const chosenSafe = candidates.slice(0,safeCount);
            const chosenDead = Array.from({length:totalTiles}, (_,i)=>i).filter(x=>!chosenSafe.includes(x));
            this.safeTiles = chosenSafe;
            this.deadTiles = chosenDead;
        }
    }

    patternCheckerboard(totalTiles) {
        const arr = [];
        for (let i=0; i<totalTiles; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            if ((row+col)%2===0) arr.push(i);
        }
        return arr;
    }

    patternDiagonal(totalTiles) {
        const arr = [];
        for (let i=0; i<totalTiles; i++){
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            if (row === col) arr.push(i);
        }
        return arr;
    }

    patternPrimes(totalTiles) {
        const arr = [];
        for (let i=2;i<totalTiles;i++){
            if (this.isPrime(i)) arr.push(i);
        }
        return arr;
    }

    isPrime(num) {
        for (let i=2;i<=Math.sqrt(num);i++){
            if (num%i===0)return false;
        }
        return true;
    }

    patternFibonacci(totalTiles) {
        const arr = [];
        let a=0,b=1;
        while (b<totalTiles) {
            arr.push(b);
            [a,b] = [b,a+b];
        }
        return arr;
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
        if (tile.classList.contains('revealed')) return;
        this.audioCtrl.playClick();

        if (this.deadTiles.includes(idx)) {
            // Lose condition
            this.revealAll();
            this.audioCtrl.playLose();
setTimeout(() => {
    this.uiCtrl.showEndModal('You Lost!', 'Try Again', 'Main Menu', 'animations/error.json');
    this.updateLeaderboard();
}, 500);
        } else if (this.safeTiles.includes(idx)) {
            this.uiCtrl.revealTileSafe(tile);
            this.revealedCount++;
            this.score += 10;
            this.uiCtrl.setScore(this.score);
            this.audioCtrl.playReveal();

            if (this.revealedCount === this.safeTiles.length) {
                // Win condition
                this.audioCtrl.playWin();
                setTimeout(() => {
                    // Confetti on win
                    const duration = 2 * 1000;
                    const end = Date.now() + duration;
                    (function frame() {
                    confetti({
                        particleCount: 5,
                        startVelocity: 20,
                        spread:360,
                        origin:{x:Math.random(), y:Math.random()-0.2}
                    });
                    if (Date.now() < end) requestAnimationFrame(frame);
                    })();
                    this.uiCtrl.showEndModal('You Win!', 'Play Again', 'Main Menu', 'animations/frame.json');
                    this.updateLeaderboard();
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
            const pick = hiddenSafe[Math.floor(Math.random()*hiddenSafe.length)];
            const hintTile = document.querySelector(`.tile[data-index="${pick}"]`);
            this.uiCtrl.hintTile(hintTile);

            const hintMessages = [
                "The pattern whispers of symmetrical lines...",
                "Numbers of prime origin guide your steps...",
                "A spiral of fate unfolds before your eyes...",
                "Checkerboard harmony is your key..."
            ];
            const randomHint = hintMessages[Math.floor(Math.random()*hintMessages.length)];
            this.uiCtrl.showHintModal(randomHint);
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
                this.uiCtrl.showEndModal('Time Up!', 'Try Again', 'Main Menu');
                this.updateLeaderboard();
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
