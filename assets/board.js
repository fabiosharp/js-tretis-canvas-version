class Board{
    constructor(game){
        this.board = null;;

        this.game = game;

        this.size = {
            width: this.game.boardDimension.width,
            height: this.game.boardDimension.height
        }

        this.position = {
            x: this.game.boardDimension.x,
            y: this.game.boardDimension.y
        }

        this.blockSize = this.game.blockSize;
        this.context = game.context;
        this.tetronimo = null;
        this.nextTetromino = Math.floor(Math.random() * 4);
        this.tetronimoPosition = {
            x: 4,
            y: 0
        }
    }

    startGame(){
        this.resetBoard();
        this.newTetromino();
    }

    resetBoard(){
        this.board = new Array(10);

        for(let i = 0; i < this.board.length; i++){
            this.board[i] = [null, null, null, null, null, null, null, null, null, null,
                             null, null, null, null, null, null, null, null, null, null,
                             null, null, null];
        }
    }

    newTetromino() {

        this.tetronimo = new Tetromino(this.nextTetromino);
        this.nextTetromino = Math.floor(Math.random() * 4);
        
        this.tetronimoPosition = {
            x: 4,
            y: 0
        };  

        let allowed = this.tetronimo.setPosition(this.board, this.tetronimoPosition);
        if (!allowed) { // Game Over
            this.game.gameOver();
        }
    }
    
    fallBlock() {
        
        let newPosition = {x: this.tetronimoPosition.x, y: this.tetronimoPosition.y + 1};
        if (this.tetronimo.hasAvaliableSpace(this.board, newPosition)) {
            this.clearTetromino();
            this.tetronimoPosition.y++;
            this.tetronimo.setPosition(this.board, this.tetronimoPosition);

        } else if ( this.tetronimo.reachedTheBottom(this.board, newPosition) ) {
            this.transferTetraminoToBoard();
            this.clearFullRows();
            this.newTetromino();
        }
          
    }

    leftShift(){
        let newPosition = {x: this.tetronimoPosition.x -1, y: this.tetronimoPosition.y};
        if (this.tetronimo.hasAvaliableSpace(this.board, newPosition)) {
            this.clearTetromino();
            this.tetronimoPosition.x--;
            this.tetronimo.setPosition(this.board, this.tetronimoPosition);

        }
    }
    
    rightShift(){
        let newPosition = {x: this.tetronimoPosition.x +1, y: this.tetronimoPosition.y};
        if (this.tetronimo.hasAvaliableSpace(this.board, newPosition)) {
            this.clearTetromino();
            this.tetronimoPosition.x++;
            this.tetronimo.setPosition(this.board, this.tetronimoPosition);

        }
    }

    draw(gameState) {
        
        let ctx = this.context;
        
        ctx.strokeStyle = '#8ecae6';
        ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);

        // Y Axis
        for(let i = 0; i < this.board.length; i++){
            ctx.beginPath();
            ctx.lindWidth = 1;

            ctx.moveTo(this.position.x + i * this.blockSize, this.position.y);
            ctx.lineTo(this.position.x + i * this.blockSize, this.position.y + this.size.height);
            ctx.stroke();

        }
        
        // X Axis
        for(let i = 0; i < this.board[0].length -3; i++){
            ctx.beginPath();
            ctx.lindWidth = 1;

            ctx.moveTo(this.position.x, this.position.y + i * this.blockSize);
            ctx.lineTo(this.position.x + this.size.width, this.position.y + i * this.blockSize);
            ctx.stroke();
        }
        
        for(let x = 0; x < this.board.length; x++){
            for(let y = 3; y < this.board[x].length; y++){
                if (this.board[x][y] != null){
                    this.drawSquare(this.position.x + x * this.blockSize, this.position.y + (y - 3) * this.blockSize, this.board[x][y]);
                }
            }
        } 
        
    }
    
    drawSquare(x, y, block) {
        let ctx = this.context;
        ctx.fillStyle = block.color;
        ctx.fillRect(x + 1, y + 1, this.blockSize - 2, this.blockSize - 2);
    }
    
    rotateTetromino(){
        this.tetronimo.rotate();
    }

    clearTetromino() {
        
        for(let x = 0; x < this.board.length; x++){
            for(let y = 0; y < this.board[x].length; y++){
                if (this.board[x][y] != null && this.board[x][y].type === 'T'){
                    this.board[x][y] = null;
                }
            }
        }        

    }

    transferTetraminoToBoard() {

        for(let x = 0; x < this.board.length; x++){
            for(let y = 0; y < this.board[x].length; y++){
                if (this.board[x][y] != null && this.board[x][y].type === 'T'){
                    this.board[x][y] = {
                        type: 'B',
                        color: this.board[x][y].color
                    };
                }
            }
        }        
    }

    clearFullRows() {

        for(let y = 0; y < this.board[0].length; y++){
            let fullRow = true;
            for(let x = 0; x < this.board.length; x++){
                if (this.board[x][y] === null || this.board[x][y].type !== 'B'){
                    fullRow = false;
                    break;
                }
            }

            if (fullRow){
                for(let recursiveY = y; recursiveY > 0; recursiveY--){
                    for(let x = 0; x < this.board.length; x++){
                        this.board[x][recursiveY] = this.board[x][recursiveY - 1];
                    }
                }

                for(let last = 0; last < this.board.length; last++){
                    this.board[last][0] = null;
                }
            }
        }                
    }

}