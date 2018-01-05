class MenuState{

    create(){
        let styleText = {font: '40px Arial', fill: '#fff'};

        let startText = this.game.add.text(0,0, 'Touch to start', styleText);
        startText.anchor.setTo(0.5);
        startText.x = this.game.world.width/2;
        startText.y = this.game.world.height/2;

        this.game.input.onDown.addOnce(this._startGame, this);

    }

    _startGame(){
        //load this from json file is better
        let layers = [
            new Layer('seaLayer',1,25,false,false,false),
            new Layer('collisionLayer',1,25),
            new Layer('backgroundLayer',0,0,true,false)
        ];
        let level = new Level(
            `level_1`,
            {
                'tileset_1': 'tileset_1_level_1',
                'tileset_2': 'tileset_2_level_1',
                'peg_tileset':'peg_tileset'
            },
            'background_level_1',
            250,
            layers);
        this.game.state.start('GameState',true,false,level);
    }

}