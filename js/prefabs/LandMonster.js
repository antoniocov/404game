class LandMonster extends Enemy{

    constructor(game,x,y,key,map,animationStart,velocity,animations){
        super(game, x, y, key, animations, velocity);
        this._alive = true;
        this._map = map;
        this._stompAudio = this.game.add.audio('stomp');
        //set custom velocity if it is not defined
        if(!velocity) {
            this._velocityX = 40 + Math.random() * 20 * (Math.random() < 0.5 ? 1 : -1);
        }
        this._startAnimation(animationStart);
    }

    _startAnimation(animationStart){
        this.play(animationStart);
        this.body.velocity.x = this._velocityX;
    }

    update(){
        if(!this._alive) {
            this.body.velocity.x = 0;
            return;
        }
        let direction = 1;
        if(this.body.velocity.x>0){
            this.scale.setTo(-1, 1);
            direction = 1;
        }else{
            this.scale.setTo(1,1);
            direction = -1;
        }

        //make view ahead and detect cliffs
        let nextX = this.x + direction * (Math.abs(this.width) / 2 + 1);
        let nextY = this.bottom + 1;

        let nextTile = this._map.getTileWorldXY(nextX, nextY, this._map.tileWidth,this._map.tileHeight, 'collisionLayer');
        if(!nextTile && this.body.blocked.down){
            this.body.velocity.x *= -1;
        }
    }

    resetVelocity(){
        this.body.velocity.x = this._velocityX;
    }

    die(){
        this._alive = false;
        this.play('stomped');
        this._stompAudio.play();
        this.animations.currentAnim.onComplete.add(() => {
            this.destroy();
        });

    }
}