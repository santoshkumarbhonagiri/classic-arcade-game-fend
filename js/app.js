//Variables like buttons
const players = document.getElementsByName('players');
const btnStart = document.querySelector('.btn__new__game');
const btnRestart = document.querySelector('.btn__restart__game');
const btnRestart2 = document.querySelector('.btn__restart__game2');

// DIVs and Layout-Elements
const gameStart = document.querySelector('.game__start');
const canvas = document.querySelector('.canvas__board');
const gameEnd = document.querySelector('.game__end');

//Scoring
let playersMessage = document.querySelector('.players__message');
let message = document.querySelector('.message');
let lives = document.querySelectorAll('.lives');
let score = document.querySelectorAll('.score');
let collisionCount = 0;
let bonusCount = 0;
//others
let allEnemies = [];
let allBonus = [];
let positions = [];

function randomize() {
    return Math.floor(Math.random() * 3) + 1;
}

const Game = function() {
    this.width = 505;
    this.height = 606;
    this.colWidth = 101;
    this.colHeight = 83;
    this.xPos = 200;
    this.yPos = 400;
    this.newxPos = 200;
    this.newyPos = 400;
    this.isMoving = false;
};

const game = new Game();

// basic acions required to start the game
Game.prototype.start = function() {
    gameStart.classList.add('hide');
    canvas.classList.remove('hide');
    buttonRestartGame();
    keyOnGame();
    player.choosePlayer();
    player.move [0, 0];
    createEnemies();
    allBonusPositions(shuffle.array);
    createBonus(3); // total of 3 GemStones on canvas
    collisionCount = 0;
    checkCollisions();
    bonusCount = 0;
    lives[0].innerText = 'LIVES: ' + (3-collisionCount);
    lives[1].innerText = 'LIVES: ' + (3-collisionCount);
    score[0].innerText = 'POINTS: ' + bonusCount;
    score[1].innerText = 'POINTS: ' + bonusCount;
};

// Restart Game: reset all settings to original state, after clicking the button on the canvas
Game.prototype.restart = function() {
    gameStart.classList.remove('hide');
    canvas.classList.add('hide');
    restartActions();
};

// Restart Game: reset all settings to original state , after clicking the button on final message div
Game.prototype.restart2 = function() {
    gameStart.classList.remove('hide');
    gameEnd.classList.add('hide');
    restartActions();
};

// Game over: display the final messages and prepare for a new game
Game.prototype.over = function() {
    gameEnd.classList.remove('hide');
    canvas.classList.add('hide');
    buttonRestartGame2();
};

function restartActions() {
    player.xPos = 200;
    player.yPos = 400;
    player.newyPos = player.yPos;
    player.newxPos = player.xPos;
    allEnemies = [];
    allBonus = [];
    buttonStartGame();
}

/**
* @description ENEMY settings and functionalities
* @constructor Enemy class
*/
const Enemy = function(xPos, yPos, speed, sprite) {
    this.xPos = xPos;
    this.yPos =  yPos;
    this.speed = speed;
    this.sprite = 'images/' + sprite + '.png';
};

// create enemies and push them into the allEnemies array
function createEnemies() {
    const enemy_1 = new Enemy( -320, 141, 63, 'enemy-bug');
    const enemy_2 = new Enemy( -200, 58, 145, 'enemy-bug');
    const enemy_3 = new Enemy( -500, 224, 227, 'enemy-bug');
    const enemy_4 = new Enemy( game.width + 100, 141, -120, 'enemy-bug-b');

    allEnemies.push(enemy_1, enemy_2, enemy_3, enemy_4);
}

// Update the enemy's position
Enemy.prototype.update = function(dt) {
    this.xPos += this.speed * dt;
    if (this.xPos > game.width && this.speed > 0) {
       this.xPos =  - 150; // enemy "runs" out of canvas and "returns" again on left side
    }
    if (this.xPos < -100 && this.speed < 0) {
       this.xPos =  game.width + 100; // enemy "runs" out of canvas and "returns" again on right side
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};


/**
* @description PLAYER settings and functionalities
* @constructor Player class
*/
const Player = function() {
    this.xPos = 200;
    this.yPos = 400;
    this.newxPos = 200;
    this.newyPos = 400;
    this.isMoving = false;
    this.move = [0, 0];
    this.sprite = 'images/char-boy.png';
}

const player = new Player();

// select (change) the image of the player
Player.prototype.choosePlayer = function() {
    for (let i = 0; i < players.length; i++) {
        if (players[i].checked) {
            this.sprite = 'images/' + players[i].id + '.png';
        }
    }
};

// draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};

// Move the player after listening to keyboar event
Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case "left": {
            if (this.newxPos > 0) {
                this.move[0] = game.colWidth;
            }
            break;
        }
        case "right": {
            if (this.newxPos < 400) {
                this.move[0] = -game.colWidth;
            }
            break;
        }
        case "up": {
            if (this.newyPos > 0) {
                this.move[1] = game.colHeight;
            }
            break;
        }
        case "down": {
            if (this.newyPos < 400) {
                this.move[1] = -game.colHeight;
            }
        }
    }
};

// Update players move and reset
Player.prototype.checkMoves = function() {
    if(!this.isMoving) {
        this.newxPos = this.xPos;
        this.newyPos = this.yPos;
        this.newxPos -= this.move[0];
        this.newyPos -= this.move[1];
        this.move = [0, 0];
    }
};

// Linking a player move to a mouse click. Several quick mouse clicks followed by a series of player moves should be prevented ( 1 click = 1 move)
Player.prototype.doMoves = function() {
    if (this.newxPos != this.xPos || this.newyPos != this.yPos) {
        this.isMoving = true;
        if (player.xPos >= player.newxPos-5 && player.xPos <= player.newxPos + 5)
            this.xPos = this.newxPos;
        if (player.yPos >= player.newyPos-5 && player.yPos <= player.newyPos + 5)
            this.yPos = this.newyPos;
        this.xPos += (this.newxPos-this.xPos)*0.2; // smooth moving
        this.yPos += (this.newyPos-this.yPos)*0.2;
    } else {
        if (this.isMoving)
            this.isMoving = false;
    }

};

// Update the players position
Player.prototype.update = function() {
    this.checkMoves();
    this.doMoves();
    winGame();
};


/**
* @description  BONUS settings and functionalities
* @constructor Bonus class
*/

const Bonus = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.sprite = 'images/' + randomize() +'.png';
};

Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};

function countBonus() {
    allBonus.forEach(function(bonus) {
        if((player.yPos >= bonus.yPos - 10 && player.yPos <= bonus.yPos + 10)) {
            if (player.xPos >= bonus.xPos - 40 && player.xPos <= bonus.xPos + 40) {
                bonusCount++;
                score[0].innerText = 'POINTS: ' + bonusCount;
                score[1].innerText = 'POINTS: ' + bonusCount;
                allBonus=allBonus.filter(function(boni) { // remove the bonus where the player is on
                    if ( boni.yPos === bonus.yPos && boni.xPos === bonus.xPos ) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        }
    });
}

// generate all possible positions of the GemStones
function allBonusPositions() {
    for ( let i = 0; i < game.width; i+= game.colWidth ) {
        for ( let j = game.colHeight-10; j < game.height - (4 * game.colHeight); j += game.colHeight ) {
            positions.push([i,j]);
        }
    }
    shuffle(positions);
}

// shuffle function in order to create random positions of the GemStones
function shuffle(array) {
    for (let i = array.length-1; i > 0; i-- ) {
        let b = Math.floor(Math.random() * (i + 1));
        let a = array[i];
        array[i] = array[b];
        array[b] = a;
    }
    return array;
}

// create the defined amount of GemStones
function createBonus( size) {
    for ( let i = 0; i < size; i++ ) {
        allBonus.push(new Bonus( positions[i][0], positions[i][1]));
    }
}

// Collision Check
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if((player.yPos >= enemy.yPos-15 && player.yPos <= enemy.yPos +15)) {
            if (player.xPos >= enemy.xPos-45 && player.xPos <= enemy.xPos +45) {
                player.xPos = 200;
                player.yPos = 400;
                player.newxPos = 200;
                player.newyPos = 400;
                collisionCount++;
                lives[0].innerText = 'LIVES: ' + (3-collisionCount);
                lives[1].innerText = 'LIVES: ' + (3-collisionCount);
                if (collisionCount === 3) {
                    game.over();
                    message.innerText = 'Game over';
                    playersMessage.innerHTML = `<img src="${player.sprite}" alt="player">`;
                }
            }
        }
    });
}

// Player wins game
function winGame() {
    if (player.yPos <= -15 && bonusCount >= 3 ) {
        game.over();
        playersMessage.innerHTML = `<image src="${player.sprite}" alt="player">`;
        message.innerText = 'Congratulations you won!';
    }
}

// Event listener to choose a player and start a game
function buttonStartGame() {
    btnStart.addEventListener('click', Game.prototype.start);
}

buttonStartGame();

// Event listener to reset a game
function buttonRestartGame() {
    btnRestart.addEventListener('click', Game.prototype.restart);
}

// Event listener to reset a game
function buttonRestartGame2() {
    btnRestart2.addEventListener('click', Game.prototype.restart2);
}

// This listens for key presses and sends the keys to your player.handleInput() method. You don't need to modify this.
function keyOnGame() {
    document.addEventListener('keyup', function(e) {
        const allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
   });
}
