//set up canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let Height = 3;
let height = window.innerHeight * Height;
context.canvas.width = width;
context.canvas.height = height;

let w = 50;
let wScale = width / w;
let h = 50 * Height;
let hScale = height / h;
let scale = 5;

setInterval(function () {
    //clear canvas
    //context.clearRect(0, 0, width, height);
    context.fillStyle = "#002";
    context.globalAlpha = 0.33;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    context.fillStyle = "#999"

    for (let i = 1; i < w; i++) {
        for (let j = 1; j < h; j++) {
            let size = scale * (Math.sin((Date.now() / 1000 + j/9) + Math.sin(i * j)) - .25);
            if (size < 0)
                continue;
            let x = i * wScale;
            x += j%2==0 ? wScale * 1/4 : -wScale * 1/4;
            let y = j * hScale;
            context.fillRect(x - size / 2, y - size / 2, size, size);
        }
    }

    context.stroke();
}, 20);