class Utils{
    static getAssetsFolder(){
        return "assets";
    }

    static isDebugMode(){
        return false;
    }

    static isDebugPhysics(){
        return false;
    }

    static buildLevelData(levelData){
        let layers = levelData.layers.map((current) => {
            let name = current.name;
            let gIdStart = current.gIdStart;
            let gIdEnd = current.gIdEnd;
            let sendToBack = current.sendToBack;
            let hasCollision = current.hasCollision;
            let resizeToWorld = current.resizeToWorld;
            return new Layer(name, gIdStart, gIdEnd, sendToBack, hasCollision, resizeToWorld);
        });
        return new Level(
            levelData.id,
            levelData.name,
            levelData.description,
            levelData.tilesetImages,
            levelData.background,
            levelData.elapsedTime,
            levelData.minCoinsPercentage,
            layers
        );
    }
}