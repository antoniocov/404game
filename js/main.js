class Game{
    constructor(width,height){
        this.game = new Phaser.Game(width, height, Phaser.AUTO,'contentGame');
        this._loadStates();
    }

    _loadStates(){
        this.game.state.add('BootState', BootState);
        this.game.state.add('PreloadState', PreloadState);
        this.game.state.add('IntroState', IntroState);
        this.game.state.add('MenuState', MenuState);
        this.game.state.add('GameState', GameState);
    }

    startGame(){
        this.game.state.start('BootState');
    }
}

const {w, h} = Scaler.getGameLandscapeSize(1280, 800);
let game = new Game(w,h);
game.startGame();
