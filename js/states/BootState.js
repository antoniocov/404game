class BootState{

    init(){
        //loading screen with white background to show progress bar
        this.game.stage.backgroundColor = '#fff';

        //scaling option to use all screen
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //center the game
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    preload(){
        this.load.image('preloadbar', `${Utils.getAssetsFolder()}/images/preloader-bar.png`);
    }

    create(){
        this.state.start('PreloadState');
    }
}