class MenuState{

    create(){
        this._startGame();
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