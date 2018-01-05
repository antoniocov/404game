class GameState{
    init(level,numberOfCoins){

        //this.game.physics.p2.gravity.y = 1000;
        this.game.physics.arcade.gravity.y = 930;

        //enable cursor keys
        this._cursors = this.game.input.keyboard.createCursorKeys();

        this._currentLevel = level;

        this._BOUNCING_SPEED = 250;

        this._numberOfCoins = numberOfCoins || 0;

        this._coinSound = this.game.add.audio('coin');
        this._coinSound.volume = 0.1;

        this.game.paused = true;
    }

    create(){
        this._loadLevel();
        if(!Phaser.Device.desktop) {
            this._createOnScreenControls();
        }
        //fullscreen
        this.game.input.onTap.add(this._fullScreenMode, this);
        this._showInfoToUserBeforeStartGame();
    }

    update(){
        this._currentLevel.update(this.game,this._player);
        this._currentLevel.update(this.game, this._landMonsterEnemies);
        this.game.physics.arcade.overlap(this._seaBlocks,this._player, this.touchWater, null, this);

        //collision between santa and landmonster
        if(!this._player.hit && this._player.alive) {
            this.game.physics.arcade.collide(this._player, this._landMonsterEnemies, this._hitLandMonster, null, this);
        }

        //collect coin
        this.game.physics.arcade.overlap(this._player, this._coins, this._hitCoins, null, this);
    }

    _loadLevel(){
        //create Map
        this._map = this._currentLevel.buildAndCreateLevel(this.game,this);

        //create player
        //take the coordinate in the map
        let playerPropertiesFromMap = this._currentLevel.findObjectsByTipe('player', 'objectsLayer');
        this._player = new Player(this.game, playerPropertiesFromMap[0].x, playerPropertiesFromMap[0].y,this._cursors,300,this);
        this._playerGroup = this.add.group();
        this._playerGroup.add(this._player);

        //map block sea if exists
        let seaProp = this._currentLevel.findObjectsByTipe('sea', 'objectsLayer');
        if(seaProp.length>0){
            this._seaBlocks = this.add.group();
            seaProp.forEach((seaElementBlock) => {
                let convertSeaBlockToSprite = this.game.add.sprite(0, 0, null);
                this.game.physics.enable(convertSeaBlockToSprite, Phaser.Physics.ARCADE);
                convertSeaBlockToSprite.body.setSize(seaElementBlock.width, seaElementBlock.height, seaElementBlock.x, seaElementBlock.y);
                convertSeaBlockToSprite.body.immovable = true;
                convertSeaBlockToSprite.body.allowGravity = false;
                this._seaBlocks.add(convertSeaBlockToSprite);
            });
        }

        //map the enemies
        this._landMonsterEnemies = this.add.group();
        this._createEnemies();

        // load coins
        let coinsProp = this._currentLevel.findObjectsByTipe('coin', 'objectsLayer');
        if(coinsProp.length>0){
            this._coins = this.add.group();
            coinsProp.forEach((coinBlock) => {
                let coin = this.game.add.sprite(coinBlock.x, coinBlock.y, 'coin');
                this.game.physics.enable(coin, Phaser.Physics.ARCADE);
                coin.body.immovable = true;
                coin.body.allowGravity = false;
                coin.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 25, true);
                coin.play('rotate');
                this._coins.add(coin);
            });
        }

        //create audio button
        this._audioButton = this.game.add.button(0, 0, 'audioIcon', this._muteGame, this);
        this._audioButton.x = this.game.width - (this._audioButton.width / 2) - 5;
        this._audioButton.y = (this._audioButton.height / 2)+5;
        this._audioButton.anchor.setTo(0.5);
        this._audioButton.fixedToCamera = true;
        let loadFrameAduio = (this.game.sound.mute)?0:1;
        this._audioButton.setFrames(loadFrameAduio,loadFrameAduio,loadFrameAduio,loadFrameAduio);

        //icons on the map
        this._setupHud();

        //set timer
        this.game.time.events.loop(1000, () => {
            let timer = this._currentLevel.decreaseTimer();
            if(timer>=0){
                this._elapsedTimeLabel.text = timer;
            }else{
                this.gameOver();
            }
        });


        //folow the player
        this.game.camera.follow(this._player);
    }

    touchWater(){
        this._player.alpha = 0.5;
        this._player.die();

    }

    _createEnemies(){
        let enemies = this._currentLevel.findObjectsByTipe('enemy', 'objectsLayer');
        enemies.forEach((blockElement) => {
            let enemy = new LandMonster(this.game, blockElement.x, blockElement.y, 'landMonster', this._map,'idle',null,
                [{
                    name: 'idle',
                    frames: Phaser.Animation.generateFrameNames('idle/', 1, 10, '.png', 2),
                    frequency: 40,
                    loop: true,
                    useNumericIndex: false
                },
                {
                    name: 'stomped',
                    frames: Phaser.Animation.generateFrameNames('stomped/',1,6,'.png',2),
                    frequency: 40,
                    loop: false,
                    useNumericIndex:false
                }
            ]);
            this._landMonsterEnemies.add(enemy);
        });
    }

    _hitLandMonster(player,landMonster){
        if(landMonster.body.touching.up) {
            landMonster.die();
            player.body.velocity.y = -this._BOUNCING_SPEED;
        }else{
            landMonster.resetVelocity();
            player.damage(1,player.body.touching.right);
        }
    }

    _hitCoins(player,coin){
        this._coinSound.play();
        this._numberOfCoins += 1;
        this._coinsCount.text = `${this._numberOfCoins}`;
        coin.destroy();
    }

    _muteGame(){
        if(this.game.sound.mute){
            this.game.sound.mute = false;
            this._audioButton.setFrames(1,1,1,1);
        }else{
            this.game.sound.mute = true;
            this._audioButton.setFrames(0,0,0,0);
        }
    }

    _createOnScreenControls(){
        this._leftArrow = this.add.button(0,0,'leftKey');
        this._rightArrow = this.add.button(0, 0, 'rightKey');
        this._runKey = this.add.button(0, 0, 'runKey');
        this._jumpKey = this.add.button(0, 0, 'jumpKey');
        this._leftArrow.x = 20;
        this._leftArrow.y = this.game.height - this._leftArrow.height;
        this._rightArrow.x = this._leftArrow.width + 20;
        this._rightArrow.y = this.game.height - this._rightArrow.height;
        this._jumpKey.x = this.game.width - this._jumpKey.width - 20;
        this._jumpKey.y = this.game.height - this._jumpKey.height;
        this._runKey.x = this.game.width - this._runKey.width - this._jumpKey.width - 20;
        this._runKey.y = this.game.height - this._jumpKey.height / 2 - this._runKey.height;
        this._leftArrow.alpha = 0.5;
        this._rightArrow.alpha = 0.5;
        this._runKey.alpha = 0.5;
        this._jumpKey.alpha = 0.5;
        this._leftArrow.fixedToCamera = true;
        this._rightArrow.fixedToCamera = true;
        this._jumpKey.fixedToCamera = true;
        this._runKey.fixedToCamera = true;

        this._leftArrow.events.onInputDown.add(() => {
            this._player.movingLeft = true;
        });

        this._leftArrow.events.onInputUp.add(()=>{
            this._player.movingLeft = false;
        });

        this._rightArrow.events.onInputDown.add(()=>{
            this._player.movingRight = true;
        });

        this._rightArrow.events.onInputUp.add(()=>{
            this._player.movingRight = false;
        });

        this._jumpKey.events.onInputDown.add(()=>{
            this._player.jump = true;
        });

        this._jumpKey.events.onInputUp.add(() => {
            this._player.jump = false;
        });

        this._runKey.events.onInputDown.add(()=>{
            this._player.run = true;
        });

        this._runKey.events.onInputUp.add(()=>{
            this._player.run = false;
        });
    }

    gameOver(){
        //TODO update Highsore in storage

        //kill player if it is alive
        if(this._player.alive){
            this._player.die();
        }

        //stop events
        this.game.time.events.pause();

        //game over overlay
        this._overlay = this.add.bitmapData(this.game.width,this.game.height);
        this._overlay.ctx.fillStyle = '#000000';
        this._overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

        //adding a sprite with overlay just created
        this._panel = this.add.sprite(this.game.camera.x,this.game.height, this._overlay);
        this._panel.alpha = 0.55;
        this._gameOver = this.add.sprite(this.game.camera.x+this.game.camera.width/2, this.game.camera.y+this.game.camera.height/2, 'gameover');
        this._gameOver.anchor.setTo(0.5);

        let styleText = {font: '40px Arial', fill: '#fff'};
        let gameOverText = this.add.text(this.game.camera.x+this.game.camera.width/2, this.game.camera.y+this.game.camera.height/2+this._gameOver.height/2+40, 'Touch to restart', styleText);
        gameOverText.anchor.setTo(0.5);

        //raise tween to show the overlay on the screen
        this.add
            .tween(this._panel)
            .to({y: this.game.camera.y}, 500,null,true)
            .onComplete.add(()=>{
            this.game.input.onDown.addOnce(this._restart, this);
        });
    }

    _fullScreenMode(pointer,doubleTap){
        if(doubleTap){
            if(this.game.scale.isFullScreen){
                this.game.scale.stopFullScreen();
            }else{
                this.game.scale.startFullScreen(false);
            }
        }
    }

    _setupHud(){
        //add icon image for collect coin
        let startSpacingX = 10;
        let startSpacingY = 10;
        let styleText = {font: '40px Arial', fill: '#fff'};
        this._coinIcon = this.game.add.sprite(startSpacingX, startSpacingY, 'coinIcon');
        this._coinIcon.fixedToCamera = true;
        this._coinsCount = this.add.text(startSpacingX*2+this._coinIcon.width, startSpacingY, '0', styleText);
        this._coinsCount.fixedToCamera = true;

        this._playerIcon = this.game.add.sprite(startSpacingX, startSpacingY*2 + this._coinIcon.height, 'playerSantaIcon');
        this._playerIcon.fixedToCamera = true;
        this._playerHealth = this.add.text(startSpacingX * 2 + this._playerIcon.width, startSpacingY * 2 + this._coinIcon.height, this._player.health, styleText);
        this._playerHealth.fixedToCamera = true;

        styleText = {font: '28px Arial', fill: '#fff'};
        this._elapsedTimeLabel = this.game.add.text(this.game.width/2,5,`${this._currentLevel.elapsedTime}`,styleText);
        this._elapsedTimeLabel.fixedToCamera = true;
    }

    updatePlayerHealthValue(val){
        this._playerHealth.text = `${val}`;
    }

    _restart(){
        this.game.time.events.resume();
        this.game.state.start('GameState',true,false,this._currentLevel);
    }

    _showInfoToUserBeforeStartGame(){
        let groupTextHud = this.game.add.group();

        //add overlay before to start to show information on the level
        let overlay = this.add.bitmapData(this.game.width,this.game.height);
        overlay.ctx.fillStyle = '#000000';
        overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);
        let panelBeforeStart = this.add.sprite(this.game.camera.x,this.game.camera.y, overlay);
        //panelBeforeStart.alpha = 0.80;
        panelBeforeStart.fixedToCamera = true;
        groupTextHud.add(panelBeforeStart);


        let styleLevelName = {font: '60px Arial', fill: '#fff'};
        let textLevel = this.add.text(this.game.camera.x+this.game.camera.width/2, this.game.camera.y+this.game.camera.height/2, this._currentLevel.description, styleLevelName,groupTextHud);
        textLevel.anchor.setTo(0.5);
        textLevel.fixedToCamera = true;

        let totalCoins = this._coins.length;
        let styleSubText = {font: '25px Arial', fill: '#fff'};
        let totalCoinText = this.add.text(this.game.camera.x+this.game.camera.width/2,textLevel.y+textLevel.height/2+10,`Total coin ${totalCoins}`,styleSubText,groupTextHud);
        totalCoinText.anchor.setTo(0.5);
        totalCoinText.fixedToCamera = true;

        let minCoinsRequired = this._currentLevel.calculateMinimumCoinsRequestForLevel(totalCoins);
        let minimumCoinsRequiredText = this.add.text(this.game.camera.x + this.game.camera.width / 2, totalCoinText.y + totalCoinText.height / 2 + 10, `Minimum coins required: ${minCoinsRequired}`, styleSubText, groupTextHud);
        minimumCoinsRequiredText.anchor.setTo(0.5);
        minimumCoinsRequiredText.fixedToCamera = true;

        let startText = this.add.text(this.game.camera.x + this.game.camera.width / 2, minimumCoinsRequiredText.y + minimumCoinsRequiredText.height / 2 + 30, '(Touch to start the level)', styleSubText, groupTextHud);
        startText.anchor.setTo(0.5);
        startText.fixedToCamera = true;

        this.game.input.onDown.addOnce(()=>{
            this.game.paused = false;
            groupTextHud.destroy();
            overlay.destroy();
        }, this);
    }

    render(){
        if(Utils.isDebugMode()) {
            this.game.time.advancedTiming = true;
            this.game.debug.text(`[DEBUG] FPS: ${this.game.time.fps}` || '--', 2, 14, "#ffffff");
            this.game.debug.text(`[DEBUG] LIFE: ${this._player.health}`,2,35,'#ffffff');
            this.game.debug.text(`[DEBUG] COINS: ${this._numberOfCoins}`, 2, 56, '#ffffff');

        }
        if(Utils.isDebugPhysics()){
            this.game.debug.body(this._player);
            this._landMonsterEnemies.forEach((e) => {
                this.game.debug.body(e);
            });
            this._coins.forEach((e) => {
                this.game.debug.body(e);
            });
        }
    }
}
