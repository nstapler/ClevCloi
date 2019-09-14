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
          //console.log( content );
          this.FileContent = content;
          this.readFile();
       };
    
    };
    fileSelector.click();
};
FileConverter.prototype.readFile=function(){
    this.loadContents(this.FileContent);
};
FileConverter.prototype.saveToFile=function(){
    //VM.PrepSave();
    var VMstr = JSON.stringify(VM);
    var a = document.createElement("a");
    var file = new Blob([VMstr],{type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    var d = new Date();
    var m = d.getMonth()+1;
    a.download=("MirrorMeSave_"+
    m+"-"+
    d.getDate()+"-"+
    d.getFullYear()+".text");
    a.click();
};
FileConverter.prototype.saveToLocal=function(){
    var VMstr = JSON.stringify(VM);
    try {
        localStorage.setItem( 'MirrorMe_TempSave', VMstr );
    // quota exceeded
    } catch( error ) {
        // expire old data and try again
        localStorage.clear();
        try {
            localStorage.setItem( 'MirrorMe_TempSave', VMstr );
        } catch( error ) {
           //create alert
           var alert =$("#localStorageAlert");
           if(!alert.length || alert.length===0){
            //var h = $("nav.navbar").innerHeight();
            alert =$("<div>")
            .prop("class","alert alert-danger text-center")
            .prop("id","localStorageAlert")
            .attr("role","alert")
            .attr("data-dismiss","alert")
            .text("Please save to file, the data is too large for local/temporary storage. (click to dismiss)").css({
                //"top":h+5+"px",
                "z-index":"100",
                "width":"100%",
                "position":"relative"
            });
            $(".UIContainer").append(alert);
           }
           
           
        
        }
    }
};
FileConverter.prototype.loadLocal=function(){
    var tempSave = localStorage.getItem('MirrorMe_TempSave');
    if(tempSave){
        this.loadContents(tempSave);
    }
    
};
FileConverter.prototype.loadContents=function(contents){
    var fObject = JSON.parse(contents);
    console.log(fObject);
    if(VM){
        VM.resetDom();
    }
    if(fObject && typeof(fObject)=="object"){
        VM = new ViewManager(fObject);
        VM.Initialize();
    }
};

