let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-cont") ;
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let recordFlag = false;

let recorder; 
let chunks = [];  

let constraints={
    audio:false,
    video:true,
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        let blob = new Blob(chunks,{ type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })

    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;

        recordFlag = !recordFlag;
        if(recordFlag){ 
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
            
        }else{
                recorder.stop();
                recordBtn.classList.remove("scale-record");
                stopTimer();
        }
    })


});


captureBtnCont.addEventListener("click",(e)=>{
   captureBtnCont.classList.add("scale-capture");

   let canvas=document.createElement("canvas");
   canvas.width=video.videoWidth;
   canvas.height=video.videoHeight;
   let imgURL=canvas.toDataURL("image/jpg");

   let tool=canvas.getContext("2d");
   tool.drawImage(video,0,0,canvas.width,canvas.height);

   let a=document.createElement('a');
   a.href=imgURL;
   a.download="image.png";
   a.click();
   setTimeout(()=>{
    captureBtnCont.classList.remove("scale-capture");
   },500)
})





let timerID;
let counter=0;
let timer=document.querySelector(".timer");
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        let totalseconds=counter;
        let hours=Number.parseInt(totalseconds/3600);
        totalseconds=totalseconds%3600;
        let minutes=Number.parseInt(totalseconds/60);
        totalseconds=totalseconds%60;
        let seconds=totalseconds;

        hours = (hours < 10) ? `0${hours}`:hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID=setInterval(displayTimer,1000);
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    counter=0;
    timer.style.display="none";        
}

let filter = document.querySelector(".filter-layer");

let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
});
