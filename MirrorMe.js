// import Video from './Video.js';
// import Unit from "/prototype_modules/Units.js";
// import ViewManager from "/prototype_modules/ViewManager.js";
// import FileConverter from "/prototype_modules/FileConverter.js";
var VM;
var FC;
var playerArr=[];
$(document).ready(function () {
    $("#appRowsDiv").before(
        $("<div>").prop("class", "row justify-content-center m-2")
    );
    if(!FC){
        FC= new FileConverter();
    }
    FC.loadLocal();
    $("#optionList").load(
        "html_templates/Buttons.html .pageButtons *", (evt)=>{
            $("#newPb").click(NewPage_B);
            $("#loadPb").click(LoadPage_B);
            $("#savePb").click(SavePage_B).css("display","none");
            $("#newUnitB").css("display","none");
            var options =$("#optionList").click((evt)=>{
                options.removeClass("show");
            });
            if(VM){
                $("#newPb").text("Reset Page").removeClass("btn-success btn-danger").addClass("btn-danger");
                $("#savePb").css("display","");
                var p =$("#modalsHere");
                var saveUnit = VM.saveUnit.bind(VM);
                var newUnit = promptNewUnit.bind(null,p,saveUnit);
                $("#newUnitB").css("display","").off("click").click(newUnit);
            }
        }
    );
    });
//modal related buttons
function SavePage_B(){
    if(!FC){
        FC= new FileConverter();
    }
    if(!VM){
        Vm =new ViewManager();
    }
    VM.PrepSave(FC.saveToFile);
}
function LoadPage_B(){
    console.log("loading");
    if(!FC){
        FC= new FileConverter();
    }
    FC.loadFile();
}
function NewPage_B(){
    console.log("New Page");
    if(!VM){
        VM= new ViewManager();
    }else{
        VM.resetAll();
    }
    
    var saveUnit = VM.saveUnit.bind(VM);
    var p =$("#modalsHere");
    
    //$("#appRowsDiv").empty();
    
    var newUnit = promptNewUnit.bind(null,p,saveUnit);
    var newUB = $("#newUnitB");
    if(newUB.css("display")==="none"){
        newUB.css("display","").off("click").click(newUnit);
    }
    
    $("#savePb").css("display","inherit");
    p.empty();
    newUnit();
}
function NewUnit_B(){
    var saveUnit = VM.saveUnit.bind(VM);
    var p =$("#modalsHere");
    promptNewUnit(p,saveUnit);
}
function promptNewUnit(pageNode,saveFunc){
    var p = pageNode;
    p.load("html_templates/modal-templates.html",(evt)=>{
        $('#modalTemplate .modal-header').empty().load("html_templates/New-Unit-Form.html #newUnitHeader *",(evt)=>{
            $('#modalTemplate .modal-body').empty().load("html_templates/New-Unit-Form.html #newUnitBody",(evt)=>{
                $('#modalTemplate #modalSave').text("Create Unit").off("click").click(saveFunc);
                $('#modalTemplate').modal('show');
            });
        });
    });  
}
function Save_B(unit){
    // open a modal with the data and with
    //caption text input
    var saveVideo = unit.saveVideo.bind(unit);
    var p = $("#modalsHere");
    p.load("html_templates/modal-templates.html",(evt)=>{
        $('#modalTemplate .modal-header').empty().load("html_templates/New-Video-Form.html #newVideoHeader *",(evt)=>{
            $('#modalTemplate .modal-body').empty().load("html_templates/New-Video-Form.html #newVideoBody",(evt)=>{
                var videoInfo = unit.getPrevTemp();
                if(videoInfo){
                    var detArea = $("#newVideoBody #videoDetails");
                    Object.keys(videoInfo).forEach((f)=>{
                        detArea.append(
                            $("<div>").prop("class","row border border-dark").append(
                                $("<div>").prop("class","col-4 border-right border-dark").append(
                                    $("<p>").prop("class","text-break").text(f)
                                        
                                ),
                                $("<div>").prop("class","col-8").append(
                                    $("<p>").text(videoInfo[f])
                                )
                            ) 
                        );
                    });
                    $('#modalTemplate #modalSave').text("Save Video").off("click").click(saveVideo);
                    $('#modalTemplate').modal('show');
                }
                
            });
        });
    });
    
}
function getFormInputs(){
    var form =$("#modalTemplate form");
    var validForm=true;
    var inputMap={};
    // form.submit(evt=>{
    // });// form.submit();
    var formDom = form[0];
    var inputs = formDom.elements;
    $(inputs).each((index, ele) => {
        if (ele.checkValidity()) {
            let field = $(ele).prev().text();
            let val = $(ele).val();
            inputMap[field] = val;
            $(ele).removeClass("is-invalid");
        } else {
            $(ele).removeClass("is-valid");
            $(ele).addClass("is-invalid");
            validForm = false;
        }
    });
    event.preventDefault();
    event.stopPropagation();
    if(validForm){
        return inputMap;
    }else{
        return null;
    }
}
function Delete_B(){

}
function setVideoPlayer(vidId,options){
    var player = videojs(vidId, options, function () {
        // print version information at startup
        var msg = 'Using video.js ' + videojs.VERSION +
            ' with videojs-record ' + videojs.getPluginVersion('record') +
            ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
        
    });
    playerArr.push({vid:player,id:vidId});
    // error handling
    player.on('deviceError', function () {
        console.log('device error:', player.deviceErrorCode);
    });
    player.on('error', function (element, error) {
        console.error(error);
    });
    // user clicked the record button and started recording
    player.on('enterPIP', function () {
        console.log('enterPIP');

    });
    player.on('leavePIP', function () {
        console.log('leavePIP!');

    });
    player.on('startRecord', function() {
        console.log('started recording!');
    });
    // user completed recording and stream is available
    player.on('finishRecord', function () {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', player.recordedData);
        var playerInfo = player.tagAttributes; //.class .id
        var vidId = playerInfo.id;
        var id = vidId.split("_")[1];
        var unit = VM.getUnit(id);
        unit.savePrevTemp(player.recordedData);
        $("#unitContainer_"+id+" .mainResponse .videoSaveButton").css("display","inherit");
        //reveal save button?
        //keeps temorarily
        //stores immediately as a node 
        //on hover show a preview
    });
}
//**dataURL to blob**
function dataURLtoBlob(dataurl) {
    if(!dataurl){
        return null;
    }
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//**blob to dataURL**
function blobToDataURL(blob, callback) {
    return new Promise((resolve,reject)=>{
        var a = new FileReader();
        a.onload = function(e) {resolve(
            callback(e.target.result)
            );
        };
        a.readAsDataURL(blob);
    });
    
}
//download all the htmls
//write as files
//save to file
//folder
//folders

//multiple videos to a folder
//app folder-> category folder -> question folder
//info about topic
//videos about the topic

//create objs for holding the videos and the data