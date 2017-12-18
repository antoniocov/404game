class Scaler{
    static getGameLandscapeSize(maxWidth,maxHeight){
        let w = window.innerWidth * window.devicePixelRatio;
        let h = window.innerHeight * window.devicePixelRatio;

        let landW = Math.max(w, h);
        let landH = Math.min(w, h);

        if(landW>maxWidth) {
            let ratioW = maxWidth / landW;
            landW *= ratioW;
            landH *= ratioW;
        }

        if(landH>maxHeight) {
            let ratioH = maxHeight / landH;
            landW *= ratioH;
            landH *= ratioH;
        }

        return {w: landW, h: landH};
    }
}