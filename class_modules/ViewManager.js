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
        this.settings = {};
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
        var cId ="unitContainer"+unit.getId();
        var iID ="unit_"+unit.getId();
        $("#appRowsDiv").append(
            $("<div>").prop("id",cId).prop("class","row justify-content-center m-2 bg-success")
            );
        $("#"+cId).load("html_templates/unitTemplate.html",evt=>{
            $("#"+cId+" *").addClass(iID);
        });
        

    }
    
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