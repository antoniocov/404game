class PreloadState{
    preload(){
        this._preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this._preloadBar.anchor.setTo(0.5);
        this._preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this._preloadBar);

        //load physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //load player texture
        this.load.image('background_level_1',`${Utils.getAssetsFolder()}/images/background.png`);
        this.game.load.atlasJSONArray('player', `${Utils.getAssetsFolder()}/images/santaClaus/player.png`, `${Utils.getAssetsFolder()}/images/santaClaus/player.json`);

        //load enemy texture
        this.game.load.atlasJSONArray('landMonster', `${Utils.getAssetsFolder()}/images/landMonster/landMonster.png`, `${Utils.getAssetsFolder()}/images/landMonster/landMonster.json`);


        //preload stuffs about map
        this.load.image('tileset_1_level_1', `${Utils.getAssetsFolder()}/levels/level1/tileset_1.png`);
        this.load.image('tileset_2_level_1', `${Utils.getAssetsFolder()}/levels/level1/tileset_2.png`);
        this.load.image('peg_tileset', `${Utils.getAssetsFolder()}/levels/peg_tileset.png`);
        this.load.tilemap('level_1', `${Utils.getAssetsFolder()}/levels/level1/level1.json`, null, Phaser.Tilemap.TILED_JSON);

        this.load.image('coinIcon', `${Utils.getAssetsFolder()}/images/icons/coin.png`);
        this.load.image('playerSantaIcon', `${Utils.getAssetsFolder()}/images/icons/playerSantaIcon.png`);
        this.load.image('gameover', `${Utils.getAssetsFolder()}/images/gameover.png`);

        //preload mobile keys
        this.load.image('leftKey', `${Utils.getAssetsFolder()}/images/controls/leftKey.png`);
        this.load.image('rightKey', `${Utils.getAssetsFolder()}/images/controls/rightKey.png`);
        this.load.image('runKey', `${Utils.getAssetsFolder()}/images/controls/x.png`);
        this.load.image('jumpKey', `${Utils.getAssetsFolder()}/images/controls/y.png`);

        //preload spritesheet
        this.load.spritesheet('coin', `${Utils.getAssetsFolder()}/images/coin.png`, 26, 26, 10, 0, 0);
        this.load.spritesheet('audioIcon', `${Utils.getAssetsFolder()}/images/icons/audio.png`, 32, 32, 2, 0, 0);

        //preload sounds
        this.load.audio('jump',[`${Utils.getAssetsFolder()}/audio/jump.ogg`, `${Utils.getAssetsFolder()}/audio/jump.wav`]);
        this.load.audio('stomp', [`${Utils.getAssetsFolder()}/audio/stomp.ogg`, `${Utils.getAssetsFolder()}/audio/stomp.wav`]);
        this.load.audio('coin', [`${Utils.getAssetsFolder()}/audio/coin.ogg`, `${Utils.getAssetsFolder()}/audio/coin.wav`]);

    }

    create(){
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
            layers);
        this.game.state.start('GameState',true,false,level);
    }
}