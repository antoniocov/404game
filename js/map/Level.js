class Level{
    constructor(id,levelName,description,tilesetImages,background,elapsedTime,minCoinsPercentage,layers){
        this._id = id;
        this._levelName = levelName;
        this._description = description;
        this._tilesetImages = tilesetImages;
        this._layers = layers;
        this._background = background;
        this._fatalLayers = ["seaLayer"];
        this._elapsedTime = elapsedTime;
        this._minCoinsPercentage = minCoinsPercentage;
    }

    get layers(){
        return this._layers;
    }

    get tilesetImages(){
        return this._tilesetImages;
    }

    get levelName(){
        return this._levelName;
    }

    get elapsedTime(){
        return this._elapsedTime;
    }

    get description(){
        return this._description;
    }

    get id(){
        return this._id;
    }

    calculateMinimumCoinsRequestForLevel(totalCoins){
        return Math.floor(totalCoins*(this._minCoinsPercentage/100));
    }

    decreaseTimer(){
        return --this._elapsedTime;
    }

    buildAndCreateLevel(game,state){
        this._map = game.add.tilemap(this.levelName);
        Object.entries(this._tilesetImages).forEach(([k, v]) => {
            this._map.addTilesetImage(k, v);
        });
        this._layers.forEach((layerItem) => {
            let layer = this._map.createLayer(layerItem.name);
            if(layerItem.goToBack) {
                layer.sendToBack();
            }
            if(layerItem.hasCollision){
                layer.debug = Utils.isDebugPhysics();
                this._map.setCollisionBetween(layerItem.gIdStart, layerItem.gIdEnd, true, layerItem.name);
            }
            if(layerItem.resizeToWorld) {
                layer.resizeWorld();
            }
            //save the layer
            layerItem.phaserLayerObject = layer;
        });
        if(this._background) {
            this._backgroundImage = state.add.tileSprite(0, 0, game.world.width, game.world.height, this._background);
            this._backgroundImage.sendToBack();
            this._backgroundImage.fixedToCamera = true;

        }
        return this._map;

    }

    update(game,sprite){
        this._layers.forEach((layerItem)=>{
            if(layerItem.hasCollision) {
                game.physics.arcade.collide(sprite, layerItem.phaserLayerObject);
            }
        });
    }

    findObjectsByTipe(type,layer){
        return this._map.objects[layer]
            .filter(current => current.properties !== undefined && current.properties.type === type)
            .map((element) => {
                if(!element.properties.convertY) {
                    element.y -= this._map.tileHeight; //this because map use a different coordinate system
                }
                return element;
            });
    }
}