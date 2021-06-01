let timings = document.querySelector(".timing");
let counter = 0;
let clearObj;
let videoElem=document.querySelector(".video");
let recordingBtn=document.querySelector(".record-btn");
let galleryBtn=document.querySelector(".gallery");
let captureBtn=document.querySelector(".capture");
let none=document.querySelector(".none");
let sepia=document.querySelector(".sepia");
let saturate=document.querySelector(".saturate");
let grayscale=document.querySelector(".grayscale");
let blurf=document.querySelector(".blur");
let selectedFilter="none";
let zoomin=document.querySelector(".zoomin");
let zoomout=document.querySelector(".zoomout");
let fac=1;

//requirements -> audio & video
let constraints={ video: true, audio: true };

//to store the recording
let recording=[];
let isRecording=false;
let userMedia=navigator.mediaDevices.getUserMedia(constraints);
let mediarecordingObjectForCurrStream;

userMedia.then(function(stream){
    //show feed on ui
    videoElem.srcObject=stream;

    //for recording
    mediarecordingObjectForCurrStream= new MediaRecorder(stream);

    //when stream is available on buffer add it to recording
    mediarecordingObjectForCurrStream.addEventListener("dataavailable",function(r){
        recording.push(r.data);
    });

    //when recording stopped
    mediarecordingObjectForCurrStream.addEventListener("stop",function(){
        // recording -> url convert 
        // type -> MIME type (extension)
        const blob = new Blob(recording, { type: 'video/mp4' });
        addMediaToGallery(blob, "video");
        recording = [];
    })
}).catch(function(err){
    console.log(err);
    alert("Please provide necessary camera and microphone permissions.");
})

//recording on/off
recordingBtn.addEventListener("click",function(e){
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }else if(isRecording){
        mediarecordingObjectForCurrStream.stop();
        stopTimer();
        recordingBtn.classList.remove("record-animation");
    }else{
        mediarecordingObjectForCurrStream.start();
        startTimer();
        recordingBtn.classList.add("record-animation");      
    }
    isRecording=!isRecording;
})

//capture image
captureBtn.addEventListener("click",function(){
    captureBtn.classList.add("capture-animation");
    // canvas create 
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    tool.filter = selectedFilter; 
    // scaling
    // top left corner
    tool.scale(fac, fac);
    const x = (tool.canvas.width / fac - videoElem.videoWidth) / 2;
    const y = (tool.canvas.height / fac - videoElem.videoHeight) / 2;
    tool.drawImage(videoElem, x, y);
    let url = canvas.toDataURL();
    addMediaToGallery(url, "img");
})


// Applying filters
function removeBorder(){
    let filters=document.querySelectorAll(".filters");
    filters.forEach(function (filter) {
        filter.classList.remove("active");
    })
}
none.addEventListener("click",function(){
    videoElem.style.filter="none";
    selectedFilter="none";
    removeBorder();
    none.classList.add("active");
})

grayscale.addEventListener("click",function(){
    videoElem.style.filter="grayscale(100%)";
    selectedFilter="grayscale(100%)";
    removeBorder();
    grayscale.classList.add("active");
})

sepia.addEventListener("click",function(){
    videoElem.style.filter="sepia(0.4)";
    selectedFilter="sepia(0.4)";
    removeBorder();
    sepia.classList.add("active");
})

blurf.addEventListener("click",function(){
    videoElem.style.filter="blur(10px)";
    selectedFilter="blur(10px)";
    removeBorder();
    blurf.classList.add("active");
})

saturate.addEventListener("click",function(){
    videoElem.style.filter="saturate(4)";
    selectedFilter="saturate(4)";
    removeBorder();
    saturate.classList.add("active");
})

//timer
function startTimer() {
    timings.style.display = "block";
    function fn() {
        // hours
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timings.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }
    clearObj = setInterval(fn, 1000);
}
function stopTimer() {
    timings.style.display = "none";
    clearInterval(clearObj);
}


//zoomin
zoomin.addEventListener("click",function(){
    if(fac<2)
    fac=fac+0.1;
    // console.log(scale);
    // console.log("zoomin")
    videoElem.style.transform = `scale(${fac})`;
});

//zoom out
zoomout.addEventListener("click",function(){
    if(fac>1)
    fac=fac-0.1;
    // console.log(SVGFEColorMatrixElement)
    videoElem.style.transform=`scale(${fac})`;
})


//gallery button
galleryBtn.addEventListener("click",function(){
    location.assign("gallery.html");
})