// import Video from './Video.js';
// import Unit from "/class_modules/Units.js";
// import ViewManager from "/class_modules/ViewManager.js";
// import FileConverter from "/class_modules/FileConverter.js";
var VM;
var FC;

$(document).ready(function () {
    $("#appRowsDiv").append(
        $("<div>").prop("class","row justify-content-center m-2 ").append(
            $("<div>").prop("class","col-4 align-items-center").append(
                $("<button>").prop("class","btn btn-success btn-lg m-2 p-5 align-self-center").text("New").prop("id","newB").click(newPage),
                $("<button>").prop("class","btn btn-info btn-lg m-2 p-5 align-self-center").text("Load").prop("id","loadB").click(loadPage)
                )
        ));
        var p =$("#modalsHere");
        p.load("html_templates/modal-templates.html");

    //buildApp();
});
function saveUnit(evt){
    //alert("hi");
    var form =$("#newPageModal form");
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
    evt.preventDefault();
    evt.stopPropagation();
    if(validForm){
        VM.addUnit(inputMap);
        $('#newPageModal').modal('hide');
        // rename newpage to rest
        $("#newB").text("Reset");
        VM.showAllUnits();
        //display the unit
    }  
    //console.log(evt);
}
function loadPage(){
    console.log("loading");
}
function newPage(){
    console.log("New Page");
    VM= new ViewManager();
    VM.Initialize();
}
function setVideoPlayer(vidId,options){
    var player = videojs(vidId, options, function () {
        // print version information at startup
        var msg = 'Using video.js ' + videojs.VERSION +
            ' with videojs-record ' + videojs.getPluginVersion('record') +
            ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
    });
    // error handling
    player.on('deviceError', function () {
        console.log('device error:', player.deviceErrorCode);
    });
    player.on('error', function (element, error) {
        console.error(error);
    });
    // user clicked the record button and started recording
    player.on('startRecord', function () {
        console.log('started recording!');

    });
    // user completed recording and stream is available
    player.on('finishRecord', function () {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', player.recordedData);

        //keeps temorarily
        //stores immediately as a node 
        //on hover show a preview



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