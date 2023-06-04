const DELTA_FALL_BLOCK = 1000;
const DELTA_BLOCK_SHIFT = 100;
const DELTA_FRAMES_PER_SECOND = 1000;
const MIN_BLOCK_SIZE = 5;

const GAMESTATE = {
    RUNNING: 0,
    PAUSED: 1,
    GAMEOVER: 2,
    STARTSCREEN: 3
}

class Game{

    constructor(context, width, height) {

        this.blockSize = MIN_BLOCK_SIZE;
        this.context = context;
        this.gameState = GAMESTATE.STARTSCREEN;

        // canvas size
        this.windowSize = {
            width,
            height
        };

        // dimension of the board where tetrominoes will be drawn
        this.boardDimension = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };

        // height of the board
        if (this.windowSize.height > 50 ) {
            this.boardDimension.height = this.windowSize.height - 20;
            this.boardDimension.y = 10;
            if (this.boardDimension.height / 20 > MIN_BLOCK_SIZE){
                this.blockSize  = Math.floor(this.boardDimension.height / 20);
            } else {
                this.blockSize = 0;
            }
        }

        // width of the board
        if (this.blockSize != 0){
            if (this.blockSize * 10 + 10 < this.windowSize.width) {
                this.boardDimension.width = Math.floor(this.blockSize * 10);
                this.boardDimension.x = (this.windowSize.width - this.boardDimension.width) / 2;
            } else {
                this.blockSize = 0;
            }
        }


        this.board = new Board(this);
        this.acumulateFallBlockDelta = 0;
        this.acumulateBlockShift = 0;
        this.acumulateFrames = 0;
        this.currentTotalFrames = 0;
        this.countTotalFrames = 0;
        this.input = null;
        this.shiftLeft = false;
        this.shiftRight = false;
        this.shiftDown = false;
        this.shifted = false;
    }

    start(){
        this.gameState = GAMESTATE.STARTSCREEN;
    }

    newGame(){
        this.board.startGame();
        this.gameState = GAMESTATE.RUNNING;
    }
    
    gameOver() {
        this.gameState = GAMESTATE.GAMEOVER;
    }

    rotate(){
        this.board.rotateTetromino();
    }

    enterRelease(){
        if (this.gameState === GAMESTATE.STARTSCREEN){
            this.newGame();
        }

        if (this.gameState === GAMESTATE.GAMEOVER){
            this.gameState = GAMESTATE.STARTSCREEN;
        }

    }

    spaceReleased(){
        if (this.gameState === GAMESTATE.RUNNING || this.gameState === GAMESTATE.PAUSED){
            this.togglePause();
        }

        if (this.gameState === GAMESTATE.STARTSCREEN){
            this.newGame();
        }

        if (this.gameState === GAMESTATE.GAMEOVER){
            this.gameState = GAMESTATE.STARTSCREEN;
        }        
    }

    togglePause(){

        if (this.gameState === GAMESTATE.RUNNING)
            this.gameState = GAMESTATE.PAUSED;
        else
            this.gameState = GAMESTATE.RUNNING;
    }

    enableInput(){
        this.input = new Input(this);
    }

    leftPressed(){
        this.shiftLeft = true;
        this.shifted = false;
    }

    leftReleased(){
        if (this.acumulateBlockShift < DELTA_BLOCK_SHIFT && !this.shifted){
            this.acumulateBlockShift = 0;
            this.board.leftShift();
        }        
        this.shiftLeft = false;
    }

    rightPressed(){
        this.shiftRight = true;
        this.shifted = false;
    }

    rightReleased(){
        if (this.acumulateBlockShift < DELTA_BLOCK_SHIFT && !this.shifted){
            this.acumulateBlockShift = 0;
            this.board.rightShift();
        }
        this.shiftRight = false;
    }

    downPressed(){
        this.shiftDown = true;
        this.shifted = false;
    }

    downReleased(){
        if (this.acumulateBlockShift < DELTA_BLOCK_SHIFT && !this.shifted){
            this.acumulateBlockShift = 0;
            this.board.fallBlock();
        }
        this.shiftDown = false;
    }

    increaseDelta(delta) {
        this.acumulateFallBlockDelta += delta;
        this.acumulateBlockShift += delta;
        this.acumulateFrames += delta;
        this.countTotalFrames++;
        
        if (this.acumulateFrames >= DELTA_FRAMES_PER_SECOND) {
            this.currentTotalFrames = this.countTotalFrames;
            this.acumulateFrames = 0;
            this.countTotalFrames = 0;
        }

        if (this.acumulateFallBlockDelta >= DELTA_FALL_BLOCK && this.gameState === GAMESTATE.RUNNING) {
            this.acumulateFallBlockDelta = 0;
            this.board.fallBlock();
        }

        if (this.acumulateBlockShift >= DELTA_BLOCK_SHIFT && this.gameState === GAMESTATE.RUNNING) {
            this.acumulateBlockShift = 0;
            
            if ( this.shiftLeft ){
                this.board.leftShift();
            }
            
            if ( this.shiftRight ){
                this.board.rightShift();
            }

            if ( this.shiftDown ){
                this.board.fallBlock();
            }

            this.shifted = true;
        }
        
    }

    draw() {

        if (this.gameState == GAMESTATE.STARTSCREEN){
            this.drawStartScreen();
            return;
        }

        let ctx = this.context;
        ctx.clearRect(0, 0, this.windowSize.width, this.windowSize.height);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#999';
        ctx.font = '10px Verdana';
        ctx.fillText('FPS: ' + Math.floor(this.currentTotalFrames).toString(), 5, 20);

        this.board.draw(this.gameState);

        if (this.gameState === GAMESTATE.GAMEOVER) {
            this.drawGameOver();
        }

        if (this.gameState === GAMESTATE.PAUSED) {
            this.drawGamePaused();
        }
        
    }
    
    drawGameOver(){
        let ctx = this.context;
        ctx.fillStyle = 'rgba(0,0,0, 0.5)'
        ctx.fillRect(this.boardDimension.x, 
                    this.boardDimension.y,
                    this.boardDimension.width,
                    this.boardDimension.height);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Verdana';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);
        ctx.font = 'bold 30px Verdana';
        ctx.strokeStyle = '#fff';
        ctx.strokeText('GAME OVER', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);

        ctx.fillStyle = '#111';
        ctx.font = 'bold 10px Verdana';
        ctx.textAlign = 'center';
        ctx.fillText('Presse ENTER to continue...', 
                    this.boardDimension.x + this.boardDimension.width / 2, 
                    this.boardDimension.y + this.boardDimension.height / 2 + 30);            
    }

    drawGamePaused(){

        let ctx = this.context;
        ctx.fillStyle = 'rgba(255, 183, 3, 0.5)'
        ctx.fillRect(this.boardDimension.x, 
                    this.boardDimension.y,
                    this.boardDimension.width,
                    this.boardDimension.height);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Verdana';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);
        ctx.font = 'bold 30px Verdana';
        ctx.strokeStyle = '#fff';
        ctx.strokeText('PAUSED', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);

        ctx.fillStyle = '#111';
        ctx.font = 'bold 10px Verdana';
        ctx.textAlign = 'center';
        ctx.fillText('Presse SPACE to continue...', 
                    this.boardDimension.x + this.boardDimension.width / 2, 
                    this.boardDimension.y + this.boardDimension.height / 2 + 30);            

    }

    drawStartScreen(){
        let ctx = this.context;
        ctx.clearRect(0, 0, this.windowSize.width, this.windowSize.height);        
        ctx.fillStyle = 'rgba(255, 183, 3, 0.5)'
        ctx.fillRect(0, 0, this.windowSize.width, this.windowSize.height);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Javascript TETRIS', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);
        ctx.font = 'bold 30px Arial';
        ctx.strokeStyle = '#fff';
        ctx.strokeText('Javascript TETRIS', 
                    this.boardDimension.x + this.boardDimension.width / 2 , 
                    this.boardDimension.y + this.boardDimension.height / 2);

        ctx.fillStyle = '#111';
        ctx.font = 'bold 10px Verdana';
        ctx.textAlign = 'center';
        ctx.fillText('Presse ENTER to start...', 
                    this.boardDimension.x + this.boardDimension.width / 2, 
                    this.boardDimension.y + this.boardDimension.height / 2 + 30);            
       
    }
}