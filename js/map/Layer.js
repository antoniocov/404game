class Layer{
    constructor(name,gIdStart=0,gIdEnd=0,sendToBack=false,hasCollision=true,resizeToWorld = true){
        this._name = name;
        this._goToBack = sendToBack;
        this._hasCollision = hasCollision;
        this._resizeToWorld = resizeToWorld;
        this._gIdStart = gIdStart;
        this._gIdEnd = gIdEnd;
    }

    get name(){
        return this._name;
    }

    get goToBack(){
        return this._goToBack;
    }

    get resizeToWorld(){
        return this._resizeToWorld;
    }

    get hasCollision(){
        return this._hasCollision;
    }

    get gIdStart(){
        return this._gIdStart
    }

    get gIdEnd(){
        return this._gIdEnd;
    }

    set phaserLayerObject(phaserLayerObject){
        this._phaserLayerObject = phaserLayerObject;
    }

    get phaserLayerObject(){
        return this._phaserLayerObject;
    }

}