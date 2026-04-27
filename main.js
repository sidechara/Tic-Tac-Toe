board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
var turn = 0;
var score1 = 0;
var score2 = 0;
var gameEnd = 0;

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
    if (win == 1 || win == 2) {
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