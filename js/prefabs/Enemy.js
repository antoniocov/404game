class Enemy extends Phaser.Sprite{
    constructor(game,x,y,key,animations,velocity){
        super(game, x, y, key);

        this.game = game;
        //this.tilemap = tilemap;
        this.anchor.setTo(0.5);

        this._init(animations);
    }

    _init(animations){
        this.game.physics.arcade.enableBody(this);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1, 0);


        //create animations
        if(animations) {
            animations.forEach((currentAnimation) => {
                this.animations.add(
                    currentAnimation.name,
                    currentAnimation.frames,
                    currentAnimation.frequency,
                    currentAnimation.loop,
                    currentAnimation.useNumericIndex);
            });
        }
    }

}