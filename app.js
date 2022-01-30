var gameBtns = document
  .getElementById("grid-container")
  .querySelectorAll("button");

var btnOne = document.getElementById("box1");
var btnTwo = document.getElementById("box2");
var btnThree = document.getElementById("box3");
var btnFour = document.getElementById("box4");
var btnFive = document.getElementById("box5");
var btnSix = document.getElementById("box6");
var btnSeven = document.getElementById("box7");
var btnEight = document.getElementById("box8");
var btnNine = document.getElementById("box9");

var btnPlayWithFriend = document.querySelector("#play-with-friend-btn");
var btnPlayWithComputer = document.querySelector("#play-with-computer-btn");
var symbolSpan = document.querySelector(".symbol-span");
var resultPlayerOne = document.querySelector(".result-player-one");
var resultPlayerTwo = document.querySelector(".result-player-two");

var messageDiv = document.querySelector(".message-div");

var gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

function fillGameBoardArray(userClickedBtn) {
  const row = userClickedBtn.dataset.row;
  const col = userClickedBtn.dataset.col;
  gameBoard[row][col] = userClickedBtn.dataset.state;
}

function disableBoard() {
  gameBtns.forEach((box) => {
    box.disabled = true;
  });
}

function hasMovesLeft(board) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] == "") {
        return true;
      }
    }
  }
  return false;
}

function checkPlayerVictory(board) {
  //checking every row for winning combination
  for (let r = 0; r < 3; r++) {
    if (board[r][0] == board[r][1] && board[r][1] == board[r][2]) {
      if (board[r][0] == maximisersChar) {
        return +10;
      } else if (board[r][0] == humanUsersChar) {
        return -10;
      }
    }
  }

  //checking every column for wining combination
  for (c = 0; c < 3; c++) {
    if (board[0][c] == board[1][c] && board[1][c] == board[2][c]) {
      if (board[0][c] == maximisersChar) {
        return +10;
      } else if (board[0][c] == humanUsersChar) {
        return -10;
      }
    }
  }

  //checking first diagnal for winning combination
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
    if (board[0][0] == maximisersChar) {
      return +10;
    } else if (board[0][0] == humanUsersChar) {
      return -10;
    }
  }

  //checking second diagnal for winning combination
  if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
    if (board[0][2] == maximisersChar) {
      return +10;
    } else if (board[0][2] == humanUsersChar) {
      return -10;
    }
  }

  //None of the players won

  return 0;
}

function minimax(board, isMax, depth) {
  var score = checkPlayerVictory(board);
  if (score == 10 || score == -10) {
    return score;
  }

  if (hasMovesLeft(board) == false) {
    return 0;
  }

  //if this is maximizer

  if (isMax) {
    let best = -1000;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] == "") {
          board[r][c] = maximisersChar;

          //call minimax recursively

          best = Math.max(best, minimax(board, !isMax, depth + 1));

          //undo the move to bring the board back to original state
          board[r][c] = "";
        }
      }
    }
    console.log("best is ", best);
    return best;
  }
  //if this is minimizer
  else {
    let best = 1000;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] == "") {
          board[r][c] = humanUsersChar;
          best = Math.min(best, minimax(board, !isMax, depth + 1));
          //undo the move to bring the board back to original state
          board[r][c] = "";
        }
      }
    }
    console.log("best is ", best);
    return best;
  }
}

//return best possible move for the player
function findBestMove(board) {
  let bestValue = -1000;
  let bestMove = {
    row: -1,
    col: -1,
  };

  //go through all cells , find empty cells and find the optimal move
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] == "") {
        board[r][c] = maximisersChar;

        let currentMoveValue = minimax(board, false, 0);

        //undo the move
        board[r][c] = "";

        // if the value of the currentMoveValue is more than the best value then update best value
        if (currentMoveValue > bestValue) {
          bestValue = currentMoveValue;
          bestMove.row = r;
          bestMove.col = c;
        }
      }
    }
  }

  return bestMove;
}

function isGameBoardFull() {
  var isBoardFull = true;

  gameBtns.forEach((gameBtn) => {
    if (gameBtn.dataset.state == emptyChar) {
      isBoardFull = false;
    }
  });

  return isBoardFull;
}

function makeButtonsDisabled(flag) {
  gameBtns.forEach((box) => (box.disabled = flag));
}

function resetGame() {
  swap = false;
  isMaximisersMove = false;

  gameBtns.forEach((box) => {
    box.disabled = false;
    box.dataset.state = emptyChar;
  });

  gameBtns.forEach((gameBtn) => {
    gameBtn.classList.remove("image-kitty");
    gameBtn.classList.remove("image-numnom");
  });
  if (playWithComputer) {
    messageDiv.textContent = "Your turn to make a move";
  } else {
    messageDiv.textContent = "";
  }

  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

function printWinMessage(char) {
  let message;

  if (char == "X") {
    countWinX++;

    if (playWithComputer) {
      message = "Computer Wins!";
    } else {
      message = "Hello Kitty Wins!";
    }
  } else if (char == "O") {
    message = "NumNom Wins!";
    countWinO++;
  }

  messageDiv.textContent = message;
  // todo: increment the correct one.
  resultPlayerOne.textContent = countWinX;
  resultPlayerTwo.textContent = countWinO;
}

function printDrawMessage() {
  messageDiv.textContent = `It's a draw!`;
}

function printMessage(message) {
  messageDiv.textContent = message;
}

function makeAutomaticMoveByMinimax() {
  printMessage("Computer is thinking...");
  setTimeout(() => {
    makeMove(findBestMove(gameBoard), maximisersChar);
    printMessage("Your turn to make a move!");
    makeButtonsDisabled(false);
    if (Math.abs(checkPlayerVictory(gameBoard)) == 10) {
      printWinMessage(maximisersChar);
      makeButtonsDisabled(true);
    } else if (!isGameBoardFull()) {
      // unblock the board, and wait for user to click
      console.log("users move");
    } else {
      printDrawMessage();
      makeButtonsDisabled(true);
    }
  }, 10);
}

function makeMove(move, char) {
  gameBoard[move.row][move.col] = char;
  const btnOfInterest = document.getElementById(`box_${move.row}_${move.col}`);
  btnOfInterest.dataset.state = char;
  renderBoxTicked(btnOfInterest, "image-kitty");
}

function makeHumansMove(char) {
  // If someone has won.
  if (Math.abs(checkPlayerVictory(gameBoard)) == 10) {
    printWinMessage(char);
    makeButtonsDisabled(true);
    return;
  }

  // If moves left
  if (!isGameBoardFull()) {
    if (playWithComputer) {
      isMaximisersMove = true;
      makeAutomaticMoveByMinimax();
    }
  } else {
    printDrawMessage();
    makeButtonsDisabled(true);
  }
}

function renderBoxTicked(box, className) {
  box.classList.add(className);
}
function clearBox(box) {
  box.classList.remove("image-kitty", "image-numnom");
}

let swap = false;
function handleUserClick(event) {
  // if human user, swap the turn
  // if computers vs human, trigger computers turn
  const userClickedBtn = event.target;

  let char = playerTwoChar;
  if (!playWithComputer) {
    char = swap ? playerOneChar : playerTwoChar;
    swap = !swap;
  }

  userClickedBtn.dataset.state = char;
  const className = swap ? "image-kitty" : "image-numnom";
  renderBoxTicked(userClickedBtn, className);

  // hack to wait for render

  fillGameBoardArray(userClickedBtn);
  // this can only be called because it was humans chance
  setTimeout(() => makeHumansMove(swap ? playerOneChar : playerTwoChar), 10);
}

const playerOneChar = "X";
const playerTwoChar = "O";
const emptyChar = "";

let isMaximisersMove = false;
const maximisersChar = playerOneChar;
const humanUsersChar = playerTwoChar;
let playWithComputer = false;

var countWinO = 0;
var countWinX = 0;

function startGame() {
  resetGame();
}

function handlePlayWithAFriend() {
  if (playWithComputer) {
    countWinX = countWinO = 0;
    resultPlayerOne.textContent = countWinX;
    resultPlayerTwo.textContent = countWinO;
  }
  playWithComputer = false;
  startGame();
}

function handlePlayWithComputer() {
  if (!playWithComputer) {
    countWinX = countWinO = 0;
    resultPlayerOne.textContent = countWinX;
    resultPlayerTwo.textContent = countWinO;
  }
  playWithComputer = true;
  startGame();
}

gameBtns.forEach((gameBtn) =>
  gameBtn.addEventListener("click", handleUserClick)
);

btnPlayWithFriend.addEventListener("click", handlePlayWithAFriend);
btnPlayWithComputer.addEventListener("click", handlePlayWithComputer);

disableBoard();
