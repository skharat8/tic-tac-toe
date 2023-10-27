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
  const [rows, cols] = [3, 3];
  let board = Array.from({ length: rows }, () => Array(cols).fill(Cell()));

  const getBoard = () => board;
  const getMark = (row, col) => board[row][col].getValue();

  const addMark = (row, col, sign) => {
    const cell = board[row][col];
    cell.setValue(sign);
  };

  return { getBoard, getMark, addMark };
})();

const gameController = (function () {
  const [player1, player2] = [Player(1, "X"), Player(2, "O")];
  let currentPlayer = player1;

  const playRound = (row, col) => {
    gameBoard.addMark(row, col, currentPlayer.sign);

    // Check winning condition

    switchPlayer();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayController.updateCurrentPlayer(currentPlayer);
  };

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
    gameController.playRound(e.target.dataset.row, e.target.dataset.col);
  };

  board.addEventListener("click", handleBoardClick);

  const updateGameCell = (cellButton, player) => {
    cellButton.textContent = player.sign;
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

    const bodyStyle = getComputedStyle(document.body);
    currPlayer.style.backgroundColor =
      bodyStyle.getPropertyValue("--accent-color");
    currPlayer.style.opacity = 1;

    otherPlayer.style.backgroundColor = "gainsboro";
    otherPlayer.style.opacity = 0.5;
  };

  updateCurrentPlayer(gameController.getCurrentPlayer());

  return { updateCurrentPlayer };
})();
