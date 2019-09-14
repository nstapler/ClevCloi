//Display Models
//shuffle units
//hide elements
//create the related html
//-change the related html
//-- connect html to models

//Control Extra Looks
function ViewManager(vmO = null) {
    if (vmO && typeof (vmO) === "object"){
        this._uIdentifier = vmO._uIdentifier;
        this.settings = vmO.settings;
        this.allUnits = vmO.allUnits.map((u)=>{
            return new Unit(u);
        });
        //this.unitPlacements = VM.unitPlacements;
        this.defaultSettings =vmO.defaultSettings;
    }else{
        this._uIdentifier = 0;
        this.settings = {
            videoOptions:{
                controls: true,
                //fluid: true,
                plugins: {
                    record: {
                        audio: true,
                        video: true,
                        maxLength: 300,
                        debug: true
                    }
                }
            }
        };
        this.defaultSettings =this.settings;
        this.allUnits = [];
        //this.unitPlacements = {};
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
ViewManager.prototype.setOptions = function(settings){
this.settings=settings;
//update the css of the page
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
    }).css("display","none");
    var header =$("#"+cId+" .unitHeaderBar");
    var deleteUnit = this.deleteUnit.bind(this,uId);
    header.find(".deleteUnitButton").click(
        deleteUnit
    );
    header.find(".unitTopic").text(unit.getTopic());
    header.find(".unitDescr").text(unit.getDescription());
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
                var resWhole =$("#"+cId+" .savedResponses .savedResponse"+rId).addClass(iId+" savedResponse"+rId+" rounded-lg border border-danger");
                resWhole.find(".savedResponseVid");
                resWhole.find(".savedResponseCap").text(v.getCaption());
                var butts =resWhole.find(".savedResponseActions").load("html_templates/Buttons.html .responseButtons *",(evt)=>{
                    var deleteVid = u.deleteVideo.bind(u,vId);
                    var changeVid = u.pickVideo.bind(u,vId);
                    butts.find(".responseDeleteButton").click(
                        deleteVid
                        );
                    butts.find(".responseWatchButton").click(
                        changeVid
                    );
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
        if (!uContainer || uContainer.length < 1) {
            $("#appRowsDiv").append(
                $("<div>").prop("id", cId).prop("class", "row justify-content-center m-2 bg-success")
            );
            var unitC =$("#" + cId);
            unitC.load("html_templates/unitTemplate.html", evt => {
                $("#" + cId + " *").addClass(iId);
                unitC.find(".unitHeaderBar .unitToggleButton").click((evt)=>{
                    var main =unitC.find(".mainResponse");
                    var resps =unitC.find(".savedResponses");
                    if(main.css("display")==="none"){
                        main.css("display","");
                    }else{
                        main.css("display","none");
                    }
                    if(resps.css("display")==="none"){
                        resps.css("display","");
                    }else{
                        resps.css("display","none");
                    }
                });
                unitC.find(".unitHeaderBar .UnitHideVideosButton").click((evt)=>{

                });
                this.displayUnitCurrent(id);
                unit.getResponses().forEach((r) => {
                    this.displayUnitSaved(id, r.getId());
                });
            });

        } else {
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
        $("#newPb").text("Reset Page").removeClass("btn-success btn-danger").addClass("btn-danger");
        VM.PrepSave(FC.saveToLocal);
    }
};
ViewManager.prototype.deleteUnit=function(uId){
    var cId ="unitContainer_"+ uId; // unit container
    this.allUnits=this.getUnits().filter((u)=>{
        return u.getId()!=uId;
    });
    this.deleteUnitDom(uId);
    VM.PrepSave(FC.saveToLocal);
};
ViewManager.prototype.deleteUnitDom=function(uId){
    var cId ="unitContainer_"+ uId; // unit container
    var pI = playerArr.findIndex((pO)=>{
        return pO.id==("currentVideo_"+uId);
    });
    if(pI!=-1){
        var p =playerArr.splice(pI,1);
        if(p && p.length>0){
            p[0].vid.record().destroy();
        }
    }
    $("#"+cId).remove();
};
ViewManager.prototype.resetAll=function(){
    this.setOptions(this.defaultSettings);
    this.deleteAllUnits();
};
ViewManager.prototype.resetDom=function(){
    this.getUnits().forEach((u)=>{
        this.deleteUnitDom(u.getId());
    });
};
ViewManager.prototype.deleteAllUnits=function(){
    this.getUnits().forEach((u)=>{
        this.deleteUnit(u.getId());
    });
};
ViewManager.prototype.Initialize=function(){
    var saveUnit = VM.saveUnit.bind(VM);
    var p =$("#modalsHere");
    var newUnit = promptNewUnit.bind(null,p,saveUnit);
    $("#appRowsDiv").empty().append(
        $("<button>").prop("class","btn btn-success").text("New Unit").click(
            newUnit
        )
    );
    
    $("#savePb").css("display","inherit");
    this.showAllUnits();
    this.PrepSave(FC.saveToLocal);
};
ViewManager.prototype.PrepSave=function(callBack){
    //promis.all
    var allPromises=[];
    var toReplace =[];
    //var promise = Promise.resolve();
    this.getUnits().forEach((u)=>{
        if(u.currentVideo && u.currentVideo.getBlob()){
           allPromises.push(blobToDataURL(u.currentVideo.getBlob(),(dataUrl)=>{
                if(!dataUrl){
                    return 'e';
                }   
                u.currentVideo.dataUrl=dataUrl;
               return 's';
           }));
        }
        u.getResponses().forEach((v)=>{
            if(v.getBlob()){
                allPromises.push(blobToDataURL(v.getBlob(),(dataUrl)=>{
                    if(!dataUrl){
                        return 'e';
                    }
                    v.dataUrl=dataUrl;
                    return 's';
                }));
            }
        });

    });
    // promise.then(()=>{
    //     console.log("all the videos were processed!");
    // });
    Promise.all(allPromises).then(res=>{
        var Error =res.find((res)=>{return res=='e';});

if(Error){
    alert("one or more of the blobs were not converted to a dataurl. Please try saving again");
}else{
    callBack();
}
    });
};