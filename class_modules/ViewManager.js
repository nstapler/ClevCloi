//Display Models
//shuffle units
//hide elements
//create the related html
//-change the related html
//-- connect html to models

//Control Extra Looks
function ViewManager(VM = null) {
    if (VM && typeof (VM) === "object") {
        this._uIdentifier = VM._uIdentifier;
        this.settings = VM.settings;
        this.allUnits = VM.allUnits;
        this.unitPlacements = VM.unitPlacements;
    } else {
        this._uIdentifier = 0;
        this.settings = {
            videoOptions:{
                controls: true,
                width: 400,
                height: 300,
                fluid: false,
                plugins: {
                    record: {
                        audio: true,
                        video: true,
                        maxLength: 10,
                        debug: true
                    }
                }
            }
        };
        this.allUnits = [];
        this.unitPlacements = {};
    }
}
ViewManager.prototype.createUnit = function (unitObj) {
    if(typeof(unitObj)=="object"){
        var unit = new Unit();
        unit.setUnit(unitObj);
        unit.setId(this._uIdentifier++);

        this.addUnit(unit);
        this.displayUnit(unit);
    }else{
        alert("please Submit valid unit object");
    }
    
};
ViewManager.prototype.addUnit = function (unit) {
    if (typeof (unit) === "object") {
        this.allUnits.push(unit);
    }
};

ViewManager.prototype.displayUnitCurrent=function(uId){
//check for the
    var unit =this.getUnit(uId);
    var cId ="unitContainer_"+ uId; // unit container
    var iId ="unit_"+uId; // response item
    var vId ="currentVideo_"+uId;
    var currC = $("#"+cId+" .mainResponse");
    var vidC =currC.find(".videoPlayer").load(
        "html_templates/video_template.html",(evt)=>{
        vidC.find("video").addClass(iId).prop("id",vId);
        // set to current vid if has one
        var settings = this.getOptions();
        setVideoPlayer(vId,settings.videoOptions);
    });
    currC.find(".videoSaveButton").click(
        (evt)=>{
        Save_B(unit);
    }).css("visibility","hidden");
    currC.find(".unitTopic").text(unit.getTopic());
    currC.find(".unitDescr").text(unit.getDescription());
};

ViewManager.prototype.displayUnitSaved=function(uId,vId){
    var rId=vId;
    var cId ="unitContainer_"+ uId; // unit container
    var resC = $("#"+cId+" .savedResponses");
    var iId ="unit_"+uId; // response item
    var u = this.getUnit(uId);
    var v = u.getVideo(vId);
    resC.prepend(
        $("<div>").prop("class","row bg-light m-2").addClass(iId+" savedResponse"+rId).load(
            "html_templates/savedVideo_template.html",
            (evt)=>{
                var resWhole =$("#"+cId+" .savedResponses .savedResponse"+rId).addClass(iId+" savedResponse"+rId);
                resWhole.find(".savedResponseVid");
                resWhole.find(".savedResponseCap").text(v.getCaption());
                var butts =resWhole.find(".savedResponseActions").load("html_templates/responseButtons.html",(evt)=>{
                    var deleteVid = u.deleteVideo.bind(u,vId);
                    butts.find(".responseDeleteButton").click(
                        deleteVid
                        );
                    butts.find(".responseWatchButton").click();
                });
            })
        );
};

ViewManager.prototype.displayUnit = function (unit) {
    //create holding div
    //create video
    //show description and title
    if(typeof(unit)=="object"){
        var id =unit.getId();
        var cId ="unitContainer_"+ id; // unit container
        var iId ="unit_"+id; // response item
        var vId ="currentVideo_"+id;
        var uContainer =$("#"+cId);
        if(!uContainer || uContainer.length<1){
            $("#appRowsDiv").append(
                $("<div>").prop("id",cId).prop("class","row justify-content-center m-2 bg-success")
                );
                $("#"+cId).load("html_templates/unitTemplate.html",evt=>{
                    $("#"+cId+" *").addClass(iId);
                    this.displayUnitCurrent(id);
                    unit.getResponses().forEach((r)=>{
                        this.displayUnitSaved(id,r.getId());
                    });
                });
                
        }else{
            //empty or update?
        }

    }  
};

ViewManager.prototype.getOptions=function(){
return this.settings;
};

ViewManager.prototype.getUnit=function(uId){
    return (this.getUnits().find((u)=>{
        return u.getId()==uId;
    }));
};

ViewManager.prototype.getUnits=function(){
    return this.allUnits;
};

ViewManager.prototype.showAllUnits=function(){
    var units = this.getUnits();
    units.forEach((u)=>{
        this.displayUnit(u);
    });
};

ViewManager.prototype.saveUnit=function(arg){
    var inputObj = getFormInputs();
    if(inputObj){
        this.createUnit(inputObj);
        $('#modalTemplate').modal('hide');
        $("#newB").text("Reset");
    }
};
ViewManager.prototype.deleteUnit=function(uId){
    var cId ="unitContainer_"+ uId; // unit container
    this.allUnits=this.getUnits().filter((u)=>{
        return u.getId()!=uId;
    });
    $("#"+cId).remove();
};