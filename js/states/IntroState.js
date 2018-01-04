class IntroState{
    create(){

        this.game.add.audio('deepAmbience').play();

        this.game.stage.backgroundColor = '#fdfff2';

        this._OUT_DISTANCE = 50;

        this._LIGTH_RADIUS = 130;

        this._flickering = this.game.add.audio('flickering');

        this._logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY,'medicanimalLogo');
        this._logo.anchor.setTo(0.5);
        this._logo.scale.setTo(0.5);

        this._createLights(0 - this._LIGTH_RADIUS, 0 - this._LIGTH_RADIUS);

        this._stampAudio = this.game.add.audio('stampAudio');
        this._switchOffTvAudio = this.game.add.audio('switchOffTvAudio');

        //logo game
        this._logoGame = this.game.add.sprite(0,0,'gameIntroLogo');
        this._logoGame.anchor.setTo(0.5);
        this._logoGame.scale.setTo(0.25);
        this._logoGame.x = this.game.world.centerX + (this._logo.width/2)-(this._logoGame.width/2)+25;
        this._logoGame.y = this._logo.y + this._logo.height-15 ;
        this._logoGame.alpha = 0;

        let whiteRectangle = this.game.add.bitmapData(this.game.width, this.game.height);
        whiteRectangle.context.fillStyle = 'rgb(255,255,255)';
        whiteRectangle.context.fillRect(0, 0, this.game.width, this.game.height);
        whiteRectangle.context.fill();
        this._whiteRect = this.game.add.sprite(0,0, whiteRectangle);
        this._whiteRect.alpha = 0;

    }

    _createLights(x,y){
        this._shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
        this._shadowTexture._anchor.setTo(0.5);

        this._lightSprite = this.game.add.image(0, 0, this._shadowTexture);

        this._lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
        this._firstArcX = x;
        this._firstArcY = y;
        this._firstLimitX = (this.game.world.width/2)+(this._logo.width/2);//this.game.world.width+this._LIGTH_RADIUS+this._OUT_DISTANCE;
        this._firstLimitY = 500;//this.game.world.height+this._LIGTH_RADIUS+this._OUT_DISTANCE;
        this._reverseX = false;
        this._reverseY = false;
        this._increaseX = 20;
        this._increaseY = 5.6;
        this._lightEnabled = true;
        this._loopNumber = -1;
    }

    update(){
        if(this._loopNumber <1) {
            this._firstArcX = this._firstArcX + ((this._firstArcX <= this._firstLimitX && !this._reverseX) ? this._increaseX : -this._increaseX);
            this._firstArcY = this._firstArcY + ((this._firstArcY <= this._firstLimitY && !this._reverseY) ? this._increaseY : -this._increaseY);
            if (this._firstArcX >= this._firstLimitX) {
                this._reverseX = true;
            }
            if (this._firstArcY >= this._firstLimitY) {
                this._reverseY = true;
            }
            if (this._firstArcX <= (this.game.world.width/2)-(this._logo.width/2)){//(-this._LIGTH_RADIUS - this._OUT_DISTANCE)) {
                this._reverseX = false;
            }
            if (this._firstArcY <= (-this._LIGTH_RADIUS - this._OUT_DISTANCE)) {
                this._reverseY = false;
                this._loopNumber += 1;
                this._lightEnabled = false;
            }
            if(this._lightEnabled) {
                this._updateArc(this._firstArcX, this._firstArcY, this._shadowTexture);
            }
        }else if(this._loopNumber<2){
            this._loopNumber +=1;
            this.game.stage.backgroundColor = "#000";


            this._turnOffScreenTween = this.game.add.tween(this._whiteRect);
            this._turnOffScreenTween.onStart.add(() => {
                this._whiteRect.alpha=0.8;
                //play sound
                this._switchOffTvAudio.play();
                this._logoGame.destroy();
                this._shadowTexture.destroy();
                this._logo.destroy();

            });
            this._turnOffScreenTween.to({height: 5,y:this._whiteRect.height/2}, 350, null, false, 2000, 0, false)
                .onComplete.add(()=>{
                let turnOffScreenTween = this.game.add.tween(this._whiteRect);
                turnOffScreenTween.to({width: 5, x: this._whiteRect.width / 2}, 200, null, true, 0, 0, false)
                    .onComplete.add(()=>{
                    this._whiteRect.destroy();
                    //start Menu
                    this._changeState();
                });
            });

            let tweenStart = this.game.add.tween(this._lightSprite);
            tweenStart.onStart.add(()=>{this._flickering.play();});
            tweenStart.to({alpha:0},25,null,true,1000,11,true)
                .onComplete.add(()=>{
                this._lightSprite.destroy();
                this.game.time.events.add(2000,()=>{
                    this._stampAudio.play();
                    this._logoGame.alpha = 1;
                    this._turnOffScreenTween.start();
                });
            });
        }

    }

    _updateArc(x,y,shadowTexture){
        shadowTexture.context.fillStyle = 'rgb(0,0,0)';
        shadowTexture.ctx.fillRect(0, 0, this.game.width, this.game.height);

        // this._shadowTexture.context.beginPath();
        // this._shadowTexture.context.fillStyle = 'rgb(255,255,255)';
        // this._shadowTexture.context.arc(x, y, this._LIGTH_RADIUS, 0, Math.PI * 2);
        // this._shadowTexture.context.fill();

        let radius = this._LIGTH_RADIUS + this.game.rnd.integerInRange(1, 10);

        let gradient = this._shadowTexture.context.createRadialGradient(x, y, this._LIGTH_RADIUS * 0.75, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
        gradient.addColorStop(1, 'rgba(255,255,255,0.0)');
        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(x, y, radius, 0, Math.PI * 2);
        shadowTexture.context.fill();

        shadowTexture.dirty = true;
    }

    _changeState(){
        this.game.state.start('MenuState');
    }
}