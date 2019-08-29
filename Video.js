function Video(blob) {
    this.caption = "";
    this.video = blob;
}
Video.prototype.getCaption = function(){
    return this.caption;
};
Video.prototype.getVideo = function(){
    return this.video;
};
Video.prototype.setCaption = function(cap){
this.caption=cap;
};
Video.prototype.setCaption = function(blob){
    this.video=blob;
    };
