class Player extends Phaser.Sprite{
    constructor(game,x,y,cursors,health,gameState){
        super(game,x,y,'player','idle/01.png');
        this._WALK_SPEED = 180;
        this._INCREASE_FACTOR = 1.4;
        this._JUMPING_SPEED = 600;
        this._JUMPING_SPEED_X = 300;
        this._INCREASE_FACTOR_JUMP = 1.1;
        this._MOVE_AFTER_HIT = 60;
        this.x = x;
        this.y = y;
        this.game = game;
        this._cursors = cursors;
        this._isAlive = true;
        this._health = health;
        this._maxHealth = 999;
        this._jumpAudio = this.game.add.audio('jump');
        this._jumpAudio.volume = 0.05;
        this._gameState = gameState;
        this._init();
        this._loadTexture();
        this._createAnimations();
    }

    _init(){
        this._cursors.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    }

    _loadTexture(){
        this.game.physics.arcade.enable(this);
        // this can be improved a lot changed the physics engine - anyway redifen sprite bounds
        this.body.setSize(50, 60,12,0);

        this.body.collideWorldBounds = true;

    }

    _createAnimations(){
        this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 16, '.png', 2), 40, true, false);
        this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 1, 17, '.png', 2), 8, false, false);
        this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 1, 8, '.png', 2), 40, false, false);
        this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 1, 11, '.png', 2), 40, true, false);
        this.animations.add('slide', Phaser.Animation.generateFrameNames('slide/', 1, 11, '.png', 2), 40, true, false);
        this.animations.add('walk', Phaser.Animation.generateFrameNames('walk/', 1, 13, '.png', 2), 40, true, false);

        this.anchor.setTo(0.5);
    }

    update(){

        if(!this._isAlive){
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.gravity.y = 500;
            return;
        }
        this._isRunning = this.body.onFloor() && (this._cursors.actionKey.isDown||this._mustRun);
        if(this._cursors.right.isDown || this._isMovingRight){
            this._direction = 1;
            this.body.velocity.x = (this._isJumping && (this._cursors.actionKey.isDown || this._mustRun))?this._JUMPING_SPEED_X*this._direction:this._WALK_SPEED * ((this._isRunning)?this._INCREASE_FACTOR:1);
            this.scale.setTo(this._direction, 1);
            if(this.body.onFloor()) {
                this.play((this._cursors.actionKey.isDown || this._mustRun) ? 'run' : 'walk');
            }
        }else if(this._cursors.left.isDown || this._isMovingLeft) {
            this._direction = -1;
            this.body.velocity.x = (this._isJumping && (this._cursors.actionKey.isDown || this._mustRun))?this._JUMPING_SPEED_X*this._direction:-this._WALK_SPEED * ((this._isRunning)?this._INCREASE_FACTOR:1);
            this.scale.setTo(this._direction, 1);
            if(this.body.onFloor()) {
                this.play((this._cursors.actionKey.isDown || this._mustRun) ? 'run' : 'walk');
            }
        }else{
            this._direction = 0;
            if(this.body.onFloor()) {
                this._isJumping = false;
                this.play('idle');
            }
            this.body.velocity.x = 0;
        }

        if((this._cursors.up.isDown || this._mustJump) && this.body.onFloor()){
            this.body.velocity.y = -this._JUMPING_SPEED *((this._isRunning)?this._INCREASE_FACTOR_JUMP:1);
            this._jumpAudio.play();
            this._isJumping = this._isRunning;
            this._mustJump = false;
            this.play('jump');
        }
        if(!this.body.onFloor() && this.animations.currentAnim.name !== "jump"){
            this.play('jump');
        }
    }

    damage(amount,touchingRight){
        if(this._health>0) {
            this._health -= amount;
        }
        if(this._health<=0) {
            this.die();
        }else{
            this._gameState.updatePlayerHealthValue(this._health);
            this._hit = true;
            let tween = this.game.add.tween(this).to({alpha: 0.1}, 150, Phaser.Easing.Linear.None, true, 0, 10, true);
            tween.onComplete.add(()=>{
                    this._hit = false;
                });
            this.game.add.tween(this).to({x: this.x+(((touchingRight) ? -1 : 1)*this._MOVE_AFTER_HIT)}, 40, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }

    die(){
        if(!this._isAlive)
            return;
        this._gameState.updatePlayerHealthValue(0);
        this._isAlive = false;
        this.play('die');
        this.game.time.events.add(3000, () => {
            this._gameState.gameOver();
        });
    }

    get hit(){
        return this._hit;
    }

    get health(){
        return this._health;
    }

    get alive(){
        return this._isAlive;
    }

    set jump(bool){
        this._mustJump = bool;
    }

    set movingLeft(bool){
        this._isMovingLeft = bool;
    }

    set movingRight(bool){
        this._isMovingRight = bool;
    }

    set run(bool){
        this._mustRun = bool;
    }

    get alive(){
        return this._isAlive;
    }
}