//Display Models
//shuffle units
//hide elements
//create the related html
//-change the related html
//-- connect html to models

//Control Extra Looks
function ViewManager(VM = null) {
    if (VM && typeof (VM) === "object") {
        this.identifier = VM.identifier;
        this.settings = VM.settings;
        this.allUnits = VM.allUnits;
        this.unitPlacements = VM.unitPlacements;
    } else {
        this.identifier = 0;
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
ViewManager.prototype.addUnit = function (unitObj) {
    if(typeof(unitObj)=="object"){
        let unit = new Unit();
        var fields = Object.keys(unitObj);
        fields.forEach((f) => {
            switch (f.toLowerCase()) {
                case "topic":
                    unit.setTopic(unitObj[f]);
                    break;
                case "description":
                    unit.setDescription(unitObj[f]);
                    break;
                case "tags":
                    unit.setTags(unitObj[f]);
                    break;
                default:
                    console.log("Unexpected field found: " + f);
                    break;
            }
        });
        unit.setId(this.identifier++);
        this.changeUnits(unit);
    }else{
        alert("please Submit valid unit object");
    }
    
};
ViewManager.prototype.changeUnits = function (unit) {
    if (typeof (unit) === "object") {
        this.allUnits.push(unit);
    }
};
ViewManager.prototype.Initialize = function () {
    // create modal
    // create first unit
    // get topic from form
    //https://stackoverflow.com/questions/30298041/capture-close-event-on-bootstrap-modal/30303312
    $('#newPageModal .modal-header').empty().load("html_templates/New-Unit-Form.html #newUnitHeader *");
    $('#newPageModal .modal-body').load("html_templates/New-Unit-Form.html #newUnitBody");
    $('#newPageModal #modalSave').click(saveUnit);
    $('#newPageModal').modal('show');
};
ViewManager.prototype.displayUnit = function (unit) {
    //create holding div
    //create video
    //show description and title
    if(typeof(unit)=="object"){
        var cId ="unitContainer"+unit.getId(); // unit container
        var iId ="unit_"+unit.getId(); // response item
        var vId ="currentVideo_"+unit.getId();
        $("#appRowsDiv").append(
            $("<div>").prop("id",cId).prop("class","row justify-content-center m-2 bg-success")
            );
        $("#"+cId).load("html_templates/unitTemplate.html",evt=>{
            $("#"+cId+" *").addClass(iId);
            //load in the video and if their is a current load that in too
            $("#"+cId+" .mainResponse .videoPlayer").load("html_templates/video_template.html",(evt)=>{
                $("#"+cId+" .mainResponse .videoPlayer video").addClass(iId).prop("id",vId);
                // set to current vid if has one
                var settings = this.getOptions();
                setVideoPlayer(vId,settings.videoOptions);

            });
            $("#"+cId+" .mainResponse .unitTopic").text(unit.getTopic());
            $("#"+cId+" .mainResponse .unitDescr").text(unit.getDescription());
            //load in the prev video if exist
            $("#"+cId+" .prevResponses");
        });
        

    }  
};
ViewManager.prototype.getOptions=function(){
return this.settings;
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