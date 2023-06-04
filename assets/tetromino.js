TETRONIMO_TYPES = {
    L:0,
    T:1,
    Z:2,
    O:3,
    I:4
}
class Tetromino {

    constructor(type) {
        
        if (type == TETRONIMO_TYPES.L){
            this.color = 'orange';
        }

        if (type == TETRONIMO_TYPES.T){
            this.color = 'pink';
        }

        if (type == TETRONIMO_TYPES.Z){
            this.color = 'green';
        }

        if (type == TETRONIMO_TYPES.O){
            this.color = 'yellow';
        }

        if (type == TETRONIMO_TYPES.I){
            this.color = 'blue';
        }
        

        this.currentRotation = 0;
        this.rotation = [];
        
        if (type == TETRONIMO_TYPES.L){
            this.rotation[0] = [[0,0], [0,1], [0,2], [1,2]];
            this.rotation[1] = [[0,0], [1,0], [2,0], [0,1]];
            this.rotation[2] = [[0,0], [1,0], [1,1], [1,2]];
            this.rotation[3] = [[0,1], [1,1], [2,1], [2,0]];
        }
        if (type == TETRONIMO_TYPES.T){
            this.rotation[0] = [[0,0], [1,0], [2,0], [1,1]];
            this.rotation[1] = [[0,1], [1,1], [2,1], [1,0]];
            this.rotation[2] = [[0,0], [0,1], [0,2], [1,1]];            
            this.rotation[3] = [[1,0], [1,1], [1,2], [0,1]];
        }
        if (type == TETRONIMO_TYPES.Z){
            this.rotation[0] = [[0,0], [0,1], [1,1], [1,2]];
            this.rotation[1] = [[1,0], [2,0], [0,1], [1,1]];
        }
        if (type == TETRONIMO_TYPES.I){
            this.rotation[0] = [[0,0], [0,1], [0,2], [0,3]];
            this.rotation[1] = [[0,0], [1,0], [2,0], [3,0]];
        }
        if (type == TETRONIMO_TYPES.O){
            this.rotation[0] = [[0,0], [1,0], [0,1], [1,1]];
        }

    }

    get type(){
        return 'T';
    }

    rotate() {
        this.currentRotation++;
        if (this.currentRotation == this.rotation.length)
            this.currentRotation = 0;
    }

    setPosition(board, position) {

        if ( this.hasAvaliableSpace(board, position) ) {
            this.rotation[this.currentRotation].forEach((el) => {
                board[position.x + el[0]][position.y + el[1]] = this
            });
            return true;
        }

        return false;
    }

    hasAvaliableSpace(board, position){
        let itHasSpace = this.rotation[this.currentRotation].every( (el, index) => {

            if (position.x < 0 || position.y < 0){
                return false;
            }

            if(position.x + el[0] >= board.length || position.y + el[1] >= board[0].length)
                return false;

            return board[position.x + el[0]][position.y + el[1]] == null
                || board[position.x + el[0]][position.y + el[1]].type === 'T';
        });

        return itHasSpace;
    }

    reachedTheBottom(board, position){
        let itHasReached = this.rotation[this.currentRotation].some( (el) => {
            
            if(position.y + el[1] >= board[0].length || position.y + el[1] + 1 >= board[0].length)
                return true;

            return board[position.x + el[0]][position.y + el[1] + 1] != null
                && board[position.x + el[0]][position.y + el[1] + 1].type != 'T';
        });

        return itHasReached;
    }
}