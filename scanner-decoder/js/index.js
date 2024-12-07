
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const video = document.getElementById("camera");
const context = canvas.getContext("2d");
let size, cellHeight, cellWidth;
//https://srivastavayushmaan1347.medium.com/how-to-access-camera-and-capture-photos-using-javascript-80bf7b53b45d

navigator.mediaDevices
    //from https://stackoverflow.com/questions/65485170/getusermedia-detect-front-camera
    .getUserMedia({
        audio: false,
        video: {
            facingMode: 'environment'
        }
    })
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            //Was way too big so i removed
            // canvas.width = video.videoWidth;
            // canvas.height = video.videoHeight;
            const aspectRatio = video.videoWidth / video.videoHeight;

            const customWidth = 100;
            const customHeight = customWidth / aspectRatio;

            video.width = customWidth;
            video.height = customHeight;

            canvas.width = customWidth;
            canvas.height = customHeight;
        };
    })
    .catch((error) => {
        console.error("Error accessing the camera: ", error);
    });
//https://stackoverflow.com/questions/33834724/draw-video-on-canvas-html5

function drawGrid() {
    size = document.querySelector("input").value;
    cellWidth = canvas.width / size;
    cellHeight = canvas.height / size;
    context.strokeStyle = "black";
    context.lineWidth = 2;
    //drawing gird lines , copied my own code https://github.com/samTime101/Random-Tetris-Rain/
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            context.beginPath();
            context.rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            context.stroke();
        }
    }
}

function imageDataRetractor() {
    var data = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            //copying the pixels
            //https://www.geeksforgeeks.org/html-canvas-getimagedata-method/
            const imageData = context.getImageData(
                j * cellWidth,
                i * cellHeight,
                cellWidth,
                cellHeight
            );
            const pixels = imageData.data;
            console.log(pixels.length);
            //total pixels turned out to be 76800
            let totalBrightness = 0;
            for (let k = 0; k < pixels.length; k += 4) {
                //simply assigning the first pixel as red and next as blue and next as green
                const r = pixels[k];
                const g = pixels[k + 1];
                const b = pixels[k + 2];
                let brightness = (r + g + b) / 3;
                totalBrightness += brightness;
            }
            //so the more u divide by the more nicer the result , i am putting 4 but the best result is at 5 ,
            //found 4 being widely used but in my case 5 is giving best result , 4 means rgba as pixel attribute
            const avg_brightness = totalBrightness / (pixels.length / 4);
            const isDark = avg_brightness < 100;
            //displaying the darker pixels and so on

            if (isDark) {
                context.fillStyle = "black";
                context.fillRect(
                    j * cellWidth,
                    i * cellHeight,
                    cellWidth,
                    cellHeight
                );
                //all this text stuff direct copied from stackoverflow    
                context.font = `${Math.min(cellWidth, cellHeight) * 0.6}px Arial`;
                context.fillStyle = "white";
                context.textAlign = "center";
                context.textBaseline = "middle";


                context.fillText(
                    "0",
                    j * cellWidth + cellWidth / 2,
                    i * cellHeight + cellHeight / 2
                );
            }
            else {
                context.font = `${Math.min(cellWidth, cellHeight) * 0.6}px Arial`;
                context.fillStyle = "black";
                context.textAlign = "center";
                context.textBaseline = "middle";


                context.fillText(
                    "1",
                    j * cellWidth + cellWidth / 2,
                    i * cellHeight + cellHeight / 2
                );
            }
        }
    }
}

function update() {
    //i dont know but works without clear so i commented
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    drawGrid();
    imageDataRetractor();
    requestAnimationFrame(update);
}

update();
