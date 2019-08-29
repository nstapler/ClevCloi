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
ViewManager.prototype.addUnit = function(topic){
    let unit = new Unit();
    unit.setTopic(topic);
    unit.setId(this.identifier++);
    this.changeUnits(unit);
};
ViewManager.prototype.changeUnits = function(unit){
    if(typeof(unit) === "object"){
        this.allUnits.push(unit);
    }
};
