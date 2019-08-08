$(document).ready(function(){
    buildApp()
})
function buildApp(){
    //var div = $("#appRowDiv")
    var vidId = "video"+1
    var row = $("<div></div>").prop("class","row my-5 py-3 px-5 bg-danger")
    //var col = $("<div></div>").prop("class","col-12 align-items-center")
    var vid =$("<video id='"+vidId+"' playsinline class='video-js vjs-default-skin col-4'></video>")
    var info =$("<div></div>").prop("class","col-8 px-5")
    var title = $("<div></div>").prop("class","bg-primary").append($("<h3>Title</h3>").prop("class","font-weight-bold text-dark"))
    var descr = $("<div></div>").prop("class","bg-primary").append($("<p>Description</p>").prop("class","text-left text-dark"))
    $("#appRowsDiv").after(row)
    var button =$("<button></button>").prop("class","btn btn-success").text("Start")
    var b2 = button.clone(true).prop("class","btn btn-dark").text("Stop")
    var b3 = button.clone(true).prop("class","btn btn-light").text("Download")
    vid.appendTo(row)
    info.appendTo(row)
    title.appendTo(info)
    descr.appendTo(info)
    button.appendTo(info)
    b2.appendTo(info)
    b3.appendTo(info)
    
    var options = {
        controls: true,
        width: 320,
        height: 240,
        fluid: false,
        plugins: {
            record: {
                audio: true,
                video: true,
                maxLength: 10,
                debug: true
            }
        }
    };
    var player = videojs(vidId, options, function() {
        // print version information at startup
        var msg = 'Using video.js ' + videojs.VERSION +
            ' with videojs-record ' + videojs.getPluginVersion('record') +
            ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
    });
    // error handling
    player.on('deviceError', function() {
        console.log('device error:', player.deviceErrorCode);
    });
    player.on('error', function(element, error) {
        console.error(error);
    });
    // user clicked the record button and started recording
    player.on('startRecord', function() {
        console.log('started recording!');
    });
    // user completed recording and stream is available
    player.on('finishRecord', function() {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', player.recordedData);
    });
    
}
function recordVideo(location){
    
}