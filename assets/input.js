class Input {

    constructor(game){

        document.addEventListener('keyup', (event) => {

            if (event.key == 'ArrowUp'){
                game.rotate()   
            }

            if (event.key == 'ArrowLeft'){
                game.leftReleased();
            }

            if (event.key == 'ArrowRight'){
                game.rightReleased();   
            }

            if (event.key == 'ArrowDown'){
                game.downReleased();   
            }

            if (event.code == 'Space'){
                game.spaceReleased();
            }

            if (event.code == 'Enter'){
                game.enterRelease();
            }

        });

        document.addEventListener('keydown', (event) => {

            if (event.key == 'ArrowLeft'){
                game.leftPressed();
            }

            if (event.key == 'ArrowRight'){
                game.rightPressed();   
            }

            if (event.key == 'ArrowDown'){
                game.downPressed();   
            }

        });        

    }
}