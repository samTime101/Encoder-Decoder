//https://srivastavayushmaan1347.medium.com/how-to-access-camera-and-capture-photos-using-javascript-80bf7b53b45d
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const video = document.getElementById('camera');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
    })
    .catch((error) => {
        console.error("Error accessing the camera: ", error);
    });
//https://stackoverflow.com/questions/33834724/draw-video-on-canvas-html5
function drawGrid() {
    var size = document.querySelector('input').value
    const cellWidth = canvas.width / size;
    const cellHeight = canvas.height / size;
    context.strokeStyle = 'black';
    context.lineWidth = 2;
//drawing gird lines
for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        context.beginPath();
        context.rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        context.stroke();
    }
}
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    drawGrid();
    requestAnimationFrame(update);
}

update();

