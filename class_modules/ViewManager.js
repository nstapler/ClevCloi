//Display Models
//shuffle units
//hide elements
//create the related html
//-change the related html
//-- connect html to models

//Control Extra Looks
function ViewManager(VM=null) {
    if(VM && typeof(VM)==="object"){
        this.identifier=VM.identifier;
        this.settings =VM.settings;
        this.allUnits =VM.allUnits;
        this.unitPlacements=VM.unitPlacements;
    }else{
        this.identifier=0;
        this.settings ={};
        this.allUnits =[];
        this.unitPlacements={};
    }
}
ViewManager.prototype.addUnit = function(topic,desc,tags){
    let unit = new Unit();
    unit.setTopic(topic);
    unit.setDescription(desc);
    unit.setTags(tags);
    unit.setId(this.identifier++);
    this.changeUnits(unit);
};
ViewManager.prototype.changeUnits = function(unit){
    if(typeof(unit) === "object"){
        this.allUnits.push(unit);
    }
};
ViewManager.prototype.Initialize = function(){
    // create modal
    // create first unit
    // get topic from form
    //https://stackoverflow.com/questions/30298041/capture-close-event-on-bootstrap-modal/30303312
    $('#newPageModal .modal-header').empty().load("New-Unit-Form.html #newUnitHeader *");
    $('#newPageModal .modal-body').load("New-Unit-Form.html #newUnitBody");
    $('#newPageModal').modal('show');
};
ViewManager.prototype.displayUnit = function(unit){
    //create holding div
    //create video
    //show description and title
};
