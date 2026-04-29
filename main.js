board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
var turn = 0;
var score1 = 0;
var score2 = 0;
var gameEnd = 0;
var playerMode = 0;

function displayPlayer(mode) {
    var display = document.getElementById("display-player");
    if (mode == 0) {
        if (turn == 0) {
            display.innerHTML = "It's your turn, X.";
        } else {
            display.innerHTML = "It's your turn, O.";
        }
    } else if (mode == 1) {
        display.innerHTML = "Player X has won!"
    } else if (mode == 2) {
        display.innerHTML = "Player O has won!"
    } else if (mode == 3) {
        display.innerHTML = "It's a tie!"
    }
}

function makeMove(num, num_int) {
    if (gameEnd) return;
    if (board[num_int-1] != -1) return;
    var square = document.getElementById(num);
    if (turn == 0) {
        square.innerHTML = "X";
        board[num_int-1] = 0;
        turn = 1;
        if (playerMode) {
            setTimeout(function() {
                let aiMoveIndex = findBestMove(board);
                if (aiMoveIndex != -1) {
                    makeMove(String(aiMoveIndex + 1), aiMoveIndex + 1);
                }
            }, 1000);
        }
    } else {
        square.innerHTML = "O";
        board[num_int-1] = 1;
        turn = 0;
    }
    var win = checkWin();
    if (win == 1 || win == 2) {
        displayPlayer(win);
    } else if (checkEnd()) {
        displayPlayer(3)
    } else {
        displayPlayer(0);
    }
}

function setPlayerMode() {
    if (document.getElementById("ai").checked) {
        playerMode = 1;
    } else {
        playerMode = 0;
    }
}
function evaluateBoard(b) {
    // Check rows for a win
    for (let i = 0; i < 3; i++) {
        if (b[i*3] !== -1 && b[i*3] == b[i*3+1] && b[i*3+1] == b[i*3+2]) {
            return b[i*3] == 1 ? 10 : -10; // +10 for O (AI), -10 for X (Player)
        }
    }
    // Check columns for a win
    for (let i = 0; i < 3; i++) {
        if (b[i] != -1 && b[i] == b[i+3] && b[i+3] == b[i+6]) {
            return b[i] == 1 ? 10 : -10;
        }
    }
    // Check diagonals for a win
    if (b[0] != -1 && b[0] == b[4] && b[4] == b[8]) {
        return b[0] == 1 ? 10 : -10;
    }
    if (b[2] != -1 && b[2] == b[4] && b[4] == b[6]) {
        return b[2] == 1 ? 10 : -10;
    }
    return 0; // No winner
}

function isMovesLeft(b) {
    for (let i = 0; i < 9; i++) {
        if (b[i] == -1) return true;
    }
    return false;
}
function findBestMove(b) {
    let bestVal = -1000;
    let bestMoveIndex = -1;

    for (let i = 0; i < 9; i++) { // Runs through possibilities, 
        if (b[i] == -1) {
            b[i] = 1; 
            let moveVal = minimax(b, 0, false);
            b[i] = -1; 

            if (moveVal > bestVal) {
                bestMoveIndex = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMoveIndex;
}
function minimax(b, depth, isMax) {
    let score = evaluateBoard(b);

    if (score == 10) return score - depth; // AI, faster wins favored
    
    // If Player (X) has won the game, return evaluated score
    if (score == -10) return score + depth; // Player, delay loss favored
    
    if (!isMovesLeft(b)) return 0;

    //AI Turn
    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
            if (b[i] == -1) {
                b[i] = 1; // Make hypothetical AI move
                best = Math.max(best, minimax(b, depth + 1, !isMax));
                b[i] = -1; // Undo move!
            }
        }
        return best;
    } 
    //Player turn 
    else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
            if (b[i] == -1) {
                b[i] = 0; // Make hypothetical Player move
                best = Math.min(best, minimax(b, depth + 1, !isMax));
                b[i] = -1; // Undo move!
            }
        }
        return best;
    }
}
function displayScores() {
    var x = document.getElementById("score_x");
    var o = document.getElementById("score_o");
    x.innerHTML = score1;
    o.innerHTML = score2;
}

function checkWin() {
    var win = 0;
    for (var i = 0; i < 3; i++) {
        if (board[i] == 0 && board[i+3] == 0 && board[i+6] == 0) {
            score1++;
            win = 1;
        }
        if (board[i] == 1 && board[i+3] == 1 && board[i+6] == 1) {
            score2++;
            win = 2;
        }
    }
    for (var i = 0; i < 3; i++) {
        if (board[3*i] == 0 && board[3*i+1] == 0 && board[3*i+2] == 0) {
            score1++;
            win = 1;
        }
        if (board[3*i] == 1 && board[3*i+1] == 1 && board[3*i+2] == 1) {
            score2++;
            win = 2;
        }
    }
    if ((board[0] == 0 && board[4] == 0 && board[8] == 0) || (board[2] == 0 && board[4] == 0 && board[6] == 0)) {
        score1++;
        win = 1;
    }
    if ((board[0] == 1 && board[4] == 1 && board[8] == 1) || (board[2] == 1 && board[4] == 1 && board[6] == 1)) {
        score2++;
        win = 2;
    }
    if (win == 1) {
        displayScores();
        gameEnd = 1;
    } else if (win == 2) {
        displayScores();
        gameEnd = 1;
    }
    return win;
}

function checkEnd() {
    var end = true;
    for (var i = 0; i < 9; i++) {
        if (board[i] == -1) {
            end = false;
        }
    }
    if (end) {
        gameEnd = 1;
        return 1;
    } else {
        return 0;
    }
}

function newGame() {
    gameEnd = 0;
    turn = 0;
    for (var i = 0; i < 9; i++) {
        board[i] = -1;
    }
    document.getElementById("1").innerHTML = "";
    document.getElementById("2").innerHTML = "";
    document.getElementById("3").innerHTML = "";
    document.getElementById("4").innerHTML = "";
    document.getElementById("5").innerHTML = "";
    document.getElementById("6").innerHTML = "";
    document.getElementById("7").innerHTML = "";
    document.getElementById("8").innerHTML = "";
    document.getElementById("9").innerHTML = "";

    displayPlayer(0);
}

function reset() {
    newGame();
    score1 = 0;
    score2 = 0;
    displayScores();

}
// The functions designed for the Minimaxer AI approach were largely inspired by the GeeksforGeeks article on the topic. 