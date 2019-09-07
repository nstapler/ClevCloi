function Unit(U=null) {
    if(U && typeof(U)==="object"){
        this.id = U.id;
        this.Topic =U.Topic;
        this.Description =U.Description;
        this.dateCreated=U.dateCreated;
        this.lastUpdated=U.lastUpdated;
        this.vIdentifier=U.vIdentifier;
        this.currentVideo =  new Video(U.currentVideo);
        this.tags=U.tags;

        //this.currentVideo = new Video(U.currentVideo);
        this.VideoCollection = U.VideoCollection.map((v)=>{
            return new Video(v);
        });
    }else{
        var d = new Date();
        this.id = 0;
        this.Topic ="";
        this.Description ="";
        this.dateCreated=d.toString();
        this.lastUpdated="";
        this.vIdentifier=0;

        this.currentVideo = null;
        this.PreviousBlob =null;
        this.VideoCollection = [];
        this.tags=[];
    }
    
}
Unit.prototype.getVideo=function(vId){
return this.getResponses().find((r)=>{
    return r.getId()==vId;
});
};

Unit.prototype.getResponses=function(){
    return this.VideoCollection;
};

Unit.prototype.getPrevTemp = function(){
    return this.PreviousBlob;
};

Unit.prototype.getTopic= function(){
    return this.Topic;
};

Unit.prototype.getDescription= function(){
    return this.Description;
};

Unit.prototype.getTags= function(){
    return this.Tags;
};

Unit.prototype.updated= function(){
    return this.lastUpdated;
};

Unit.prototype.created= function(){
    return this.dateCreated;
};

Unit.prototype.getId= function(){
    return this.id;
};
Unit.prototype.getCurrent= function(){
    return this.currentVideo;
};

Unit.prototype.setUnit=function(unitObj){
        var fields = Object.keys(unitObj);
        fields.forEach((f) => {
            switch (f.toLowerCase()) {
                case "topic":
                    this.setTopic(unitObj[f]);
                    break;
                case "description":
                    this.setDescription(unitObj[f]);
                    break;
                case "tags":
                    this.setTags(unitObj[f]);
                    break;
                default:
                    console.log("Unexpected field found: " + f);
                    break;
            }
        });

};

Unit.prototype.saveVideo=function(){
    var inputObj = getFormInputs();
    if(inputObj){
        $('#modalTemplate').modal('hide');
        inputObj.blob=this.getPrevTemp();
        var vid = new Video();
        vid.setVideo(inputObj);
        vid.setId(this.vIdentifier++);

        this.addVideo(vid);
        this.changeCurrent(vid);
        //this.PreviousBlob=null;
        //show the video in the recent
        //$("#unitContainer_"+this.getId()+" .mainResponse .videoSaveButton").css("visibility","hidden");
    }
    
};

Unit.prototype.savePrevTemp=function(blob){
    this.PreviousBlob=blob;
    this.update();
};

Unit.prototype.setTopic= function(topic="No Topic"){
    this.Topic=topic;
    this.update();
};

Unit.prototype.setDescription= function(description=""){
    this.Description=description;
    this.update();
};

Unit.prototype.update = function(){
    var d = new Date();
    this.lastUpdated=d.toString();
};

Unit.prototype.setTags= function(tags=[]){
    this.Tags=tags;
    this.update();
};

Unit.prototype.setId= function(id){
    this.id = id;
};

Unit.prototype.addVideo = function(video){
    this.VideoCollection.push(video);
    this.update();
    VM.displayUnitSaved(this.getId(),video.getId());
};

Unit.prototype.changeCurrent = function(video){
    //when change current, update the video
    this.currentVideo= video;
    this.update();
    //load the video onto the video player
    var uId = this.getId();
    var cId ="unitContainer_"+ uId; // unit container
    var vId = video.getId();
    var blob =video.getBlob();
    var src =window.URL.createObjectURL(blob);
    $("#"+cId+" .mainResponse .videoPlayer video").attr("src",src);
    //highlight the tile
    var rC =$("#"+cId+" .savedResponses");
    var allR = rC.find(".row");
    var theR = rC.find(".row.savedResponse"+vId);
    allR.removeClass("bg-secondary bg-light").addClass("bg-light");
    theR.removeClass("bg-light").addClass("bg-secondary");
};

Unit.prototype.pickVideo = function(vId){
    this.changeCurrent(this.getVideo(vId));
};
Unit.prototype.deleteVideo=function(vId){
    var cId ="unitContainer_"+ this.getId(); // unit container
    this.VideoCollection=this.getResponses().filter((r)=>{
        return r.getId()!=vId;
    });
    
    $("#"+cId+" .savedResponses .savedResponse"+vId).remove();
};