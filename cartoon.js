const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

//Background
ctx.fillStyle = '#a9a9a9';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

//Sun
ctx.fillStyle = '#880808';
ctx.beginPath();
ctx.arc(myCanvas.width/2, 100, 150,  0, Math.PI * 2);
ctx.fill();

//Ground
ctx.fillStyle = '#964B00';
ctx.fillRect(0, 500, 1000, 100);


//Moutains
function createMountains(){
ctx.beginPath();
ctx.fillStyle = 'gray';
ctx.moveTo(100, 100);
ctx.lineTo(0, 500);
ctx.lineTo(200, 500);
ctx.closePath();
ctx.fill();
ctx.save();

for (let i = 0; i<5; i++){
ctx.beginPath();
ctx.fillStyle = 'gray';
ctx.moveTo(100, 100);
ctx.lineTo(0, 500);
ctx.lineTo(200, 500);
ctx.closePath();
ctx.fill();
ctx.translate(200, 0);
}
ctx.restore();
}

createMountains();

function createHouse(){
// "House" (Barad-dur)
ctx.fillStyle = 'black';
ctx.fillRect(700, 200, 100, 350);

ctx.fillStyle = 'brown';
ctx.fillRect(710, 450, 80, 100);

ctx.fillStyle = 'yellow';
ctx.fillRect(735, 300, 30, 50);


//Eye
ctx.fillStyle = 'orange';
ctx.beginPath();
ctx.arc(750, 130, 50,  0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.moveTo(750, 80);
ctx.lineTo(750, 180);
ctx.lineWidth = 5;
ctx.stroke();
}

createHouse();

//Text
function text () {
ctx.font = "48px serif";
ctx.fillText("Mordor", 10, 590);
}

text();