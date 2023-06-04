let game;
let delta;
let lastUpdateTime;
let onPageStarts = () => {

    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 10, 10);
    game = new Game(ctx, canvas.width, canvas.height);
    game.enableInput();
    game.start();

    lastUpdateTime = Date.now();
    window.requestAnimationFrame(gameLoop);
}

let gameLoop = (timestamp) => {
    window.requestAnimationFrame(gameLoop);
    delta = Date.now() - lastUpdateTime;

    game.increaseDelta(delta);
    game.draw();

    lastUpdateTime = Date.now();
}

document.addEventListener('DOMContentLoaded', onPageStarts);