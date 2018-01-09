class MenuState{

    create(){
        let styleText = {font: '40px Arial', fill: '#fff'};

        let startText = this.game.add.text(0,0, 'Touch to start', styleText);
        startText.anchor.setTo(0.5);
        startText.x = this.game.world.width/2;
        startText.y = this.game.world.height/2;

        this.menuAudio = this.game.add.audio('menuAudio');
        this.menuAudio.loop = true;
        this.menuAudio.volume = 0.3;
        this.menuAudio.play();

        this.game.input.onDown.addOnce(this._startGame, this);

    }

    _startGame(){
        let levelsData = this.game.cache.getJSON('levelsData');
        let levelOne = Utils.buildLevelData(levelsData.levels[0]);
        this.menuAudio.stop();
        this.game.state.start('GameState',true,false,levelOne);
    }

}