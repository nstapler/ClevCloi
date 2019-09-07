function FileConverter(){
    this.LastFileRead=null;
    this.FileContent=null;
    this.LastFileSaved=null;
}
FileConverter.prototype.loadFile=function(){
    // https://stackoverflow.com/questions/16215771/how-open-select-file-dialog-via-js/40971885
    var fileSelector = document.createElement('input');
    fileSelector.type = 'file';
    
    fileSelector.onchange = e => { 
    
       // getting a hold of the file reference
       var file = e.target.files[0]; 
    
       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');
        this.LastFileRead=file;
       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          console.log( content );
          this.FileContent = content;
          this.readFile();
       };
    
    };
    fileSelector.click();
};
FileConverter.prototype.readFile=function(){
    var fObject = JSON.parse(this.FileContent);
    console.log(fObject);
    if(VM){
        VM.resetUnits();
    }
    if(fObject && typeof(fObject)=="object"){
        VM = new ViewManager(fObject);
        VM.Initialize();
    }
    //initialize
};
FileConverter.prototype.saveToFile=function(){
    //VM.PrepSave();
    var VMstr = JSON.stringify(VM);
    var a = document.createElement("a");
    var file = new Blob([VMstr],{type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    var d = new Date();
    a.download=("MirrorMeSave_"+
    (d.getMonth()+1)+"-"+
    d.getDate()+"-"+
    d.getFullYear()+".text");
    a.click();
};

