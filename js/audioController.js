class AudioController {
    constructor(){
        this.clickSound = document.getElementById('clickSound');
        this.revealSound = document.getElementById('revealSound');
        this.loseSound = document.getElementById('loseSound');
        this.winSound = document.getElementById('winSound');
        this.hintSound = document.getElementById('hintSound');
    }

    playClick(){ this.play(this.clickSound); }
    playReveal(){ this.play(this.revealSound); }
    playLose(){ this.play(this.loseSound); }
    playWin(){ this.play(this.winSound); }
    playHint(){ this.play(this.hintSound); }

    play(sound){
        if(sound) sound.currentTime = 0; 
        if(sound) sound.play();
    }
}
