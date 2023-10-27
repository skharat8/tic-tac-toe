function Player(id, sign) {
  return { id, sign };
}

function Cell() {
  let currentValue = "";

  const getValue = () => currentValue;
  const setValue = value => (currentValue = value);

  return { getValue, setValue };
}

const gameBoard = (function () {
  const [MAX_ROWS, MAX_COLS] = [3, 3];
  let board = [];

  for (let i = 0; i < MAX_ROWS; ++i) {
    board[i] = [];
    for (let j = 0; j < MAX_COLS; ++j) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const getMark = (row, col) => board[row][col].getValue();

  const addMark = (row, col, sign) => {
    const cell = board[row][col];
    cell.setValue(sign);
  };

  return { getBoard, getMark, addMark, MAX_ROWS, MAX_COLS };
})();

const gameController = (function () {
  const MAX_NUM_ROUNDS = 9;

  const [player1, player2] = [Player(1, "X"), Player(2, "O")];
  let currentPlayer = player1;
  let currentRound = 1;

  const playRound = (row, col) => {
    gameBoard.addMark(row, col, currentPlayer.sign);

    if (gameOver(row, col)) alert(`${currentPlayer.sign} won!`);
    if (++currentRound > MAX_NUM_ROUNDS) alert("Its a tie!");

    switchPlayer();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayController.updateCurrentPlayer(currentPlayer);
  };

  const gameOver = (row, col) => {
    const winnerSign = currentPlayer.sign;

    for (let currCol = 0; currCol <= gameBoard.MAX_COLS; ++currCol) {
      if (currCol === gameBoard.MAX_COLS) return true;
      if (!isValid(row, col)) continue;
      if (gameBoard.getMark(row, currCol) !== winnerSign) break;
    }

    for (let currRow = 0; currRow <= gameBoard.MAX_ROWS; ++currRow) {
      if (currRow === gameBoard.MAX_ROWS) return true;
      if (!isValid(row, col)) break;
      if (gameBoard.getMark(currRow, col) !== winnerSign) break;
    }

    if (isDiagonal(row, col)) {
      for (let i = 0; i <= gameBoard.MAX_ROWS; ++i) {
        if (i === 3) return true;
        if (gameBoard.getMark(i, i) !== winnerSign) break;
      }
    }

    if (isAntiDiagonal(row, col)) {
      for (let i = 0; i <= gameBoard.MAX_ROWS; ++i) {
        if (i === 3) return true;
        if (gameBoard.getMark(i, gameBoard.MAX_ROWS - i - 1) !== winnerSign)
          break;
      }
    }

    return false;
  };

  const isValid = (row, col) => 0 <= row < 3 && 0 <= col < 3;
  const isDiagonal = (row, col) => row === col;
  const isAntiDiagonal = (row, col) => row + col === gameBoard.MAX_ROWS - 1;

  const getCurrentPlayer = () => currentPlayer;

  return { playRound, getCurrentPlayer };
})();

const displayController = (function () {
  const board = document.querySelector(".game-container");
  const currPlayerDiv = document.querySelector(".current-player");

  const handleBoardClick = e => {
    // Return if empty space between cells was clicked or if the cell is already filled
    if (e.target.dataset.row === undefined || e.target.textContent) return;

    updateGameCell(e.target, gameController.getCurrentPlayer());
    gameController.playRound(
      parseInt(e.target.dataset.row),
      parseInt(e.target.dataset.col)
    );
  };

  board.addEventListener("click", handleBoardClick);

  const updateGameCell = (cellButton, player) => {
    const signColor = player.id === 1 ? "maroon" : "darkgreen";

    cellButton.textContent = player.sign;
    cellButton.style.color = signColor;
  };

  const updateCurrentPlayer = player => {
    const currPlayer =
      player.id === 1
        ? currPlayerDiv.firstElementChild
        : currPlayerDiv.lastElementChild;
    const otherPlayer =
      currPlayer === currPlayerDiv.firstElementChild
        ? currPlayerDiv.lastElementChild
        : currPlayerDiv.firstElementChild;

    const signColor = player.id === 1 ? "brown" : "olivedrab";

    currPlayer.style.backgroundColor = signColor;
    currPlayer.style.opacity = 1;

    otherPlayer.style.backgroundColor = "gainsboro";
    otherPlayer.style.opacity = 0.5;
  };

  updateCurrentPlayer(gameController.getCurrentPlayer());

  return { updateCurrentPlayer };
})();
