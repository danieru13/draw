function init() {
    
    let mouse = {
        click: false,
        move: false,
        pos: {x: 0, y: 0},
        prev_pos: false
    }

    // Canvas
    const canvas = document.getElementById('draw');
    const context = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const socket = io();

    const color = "#"+((1<<24)*Math.random()|0).toString(16);

    canvas.addEventListener('mousedown', (e) => {
        mouse.click = true;
    });

    canvas.addEventListener('mouseup', (e) => {
        mouse.click = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    });

    socket.on('draw_line', data => {
        const line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = line[2];
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    function mainLoop(){
        if(mouse.click && mouse.move && mouse.prev_pos){
            socket.emit('draw_line', {line: [mouse.pos, mouse.prev_pos, color]});
            mouse.move = false;
        }
        mouse.prev_pos = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }

    mainLoop();
}
document.addEventListener('DOMContentLoaded', init);