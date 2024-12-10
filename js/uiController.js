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
        if (theme === 'neon') {
            body.style.background = 'linear-gradient(45deg, #000, #0ff)';
        } else if (theme === 'dark') {
            body.style.background = '#000';
        } else {
            body.style.background = 'linear-gradient(135deg, #111, #333)';
        }
    }

    createGrid(gridSize) {
        this.gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;
        this.gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
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

    showHintModal(message) {
        const modal = document.getElementById('hintModal');
        const modalText = modal.querySelector('.hint-text');
        modalText.textContent = message;
        modal.style.display = 'flex';
        anime({
            targets: '#hintModal',
            opacity:[0,1],
            duration:500,
            easing:'easeOutQuad'
        });
        setTimeout(() => {
            anime({
                targets:'#hintModal',
                opacity:[1,0],
                duration:500,
                easing:'easeInQuad',
                complete:()=>{ modal.style.display='none'; }
            });
        },3000);
    }

    showEndModal(title, primaryBtnText, secondaryBtnText, lottiePath) {
        const endModal = document.getElementById('endModal');
        endModal.querySelector('.end-title').textContent = title;
        const primaryBtn = endModal.querySelector('.primary-action');
        const secondaryBtn = endModal.querySelector('.secondary-action');
    
        primaryBtn.textContent = primaryBtnText;
        secondaryBtn.textContent = secondaryBtnText;
    
        endModal.style.display='flex';
        anime({
            targets:'#endModal',
            opacity:[0,1],
            duration:600,
            easing:'easeOutExpo'
        });
    
        primaryBtn.onclick=()=>{ window.location.reload(); };
        secondaryBtn.onclick=()=>{ window.location.href='index.html'; };
    
        // Load Lottie animation
        const endLottie = document.getElementById('endLottie');
        endLottie.innerHTML=''; 
        if (lottiePath) {
          lottie.loadAnimation({
            container:endLottie,
            renderer:'svg',
            loop:true,
            autoplay:true,
            path:lottiePath
          });
        }
    }
    
}
