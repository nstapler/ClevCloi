function Video(V=null) {
    if(V && typeof(V)=="object"){
        this.caption = V.caption;
        this.video = V.video;
        this.id =V.id;
    }else{
        this.caption = "";
        this.video = "";
        this.id=null;
    }
    
}
Video.prototype.setVideo=function(inputObj){
    if(typeof(inputObj)=="object"){
        var fields = Object.keys(inputObj);
        fields.forEach((f) => {
            switch (f.toLowerCase()) {
                case "caption":
                    this.setCaption(inputObj[f]);
                break;
                    case "blob":
                    this.save(inputObj[f]);
                break;
                default:
                    console.log("Unexpected field found: " + f);
                break;
            }
        });
    }else{
        alert("please Submit valid unit object");
    }
};
Video.prototype.getCaption = function(){
    return this.caption;
};
Video.prototype.setId=function(id){
    this.id=id;
};
Video.prototype.getId=function(){
    return this.id;
};
Video.prototype.getVideo = function(){
    return this.video;
};
Video.prototype.setCaption = function(cap){
    this.caption=cap;
};
Video.prototype.save = function(blob){
    this.video = blob;
};