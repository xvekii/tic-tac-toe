const container = document.querySelector(".fields-container");

const v1 = document.querySelectorAll(".top-left, .mid-left, .low-left");
const v2 = document.querySelectorAll(".top-mid, .mid-mid, .low-mid");
const v3 = document.querySelectorAll(".top-right, .mid-right, .low-right");
const h1 = document.querySelectorAll(".top-left, .top-mid, .top-right");
const h2 = document.querySelectorAll(".mid-left, .mid-mid, .mid-right");
const h3 = document.querySelectorAll(".low-left, .low-mid, .low-right");
const d1 = document.querySelectorAll(".top-left, .mid-mid, .low-right");
const d2 = document.querySelectorAll(".top-right, .mid-mid, .low-left");
const dialog = document.getElementById("dialog");
const form = document.getElementById("player-names-form");
const skipDialogBtn = document.querySelector(".skip-dialog-btn");


document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("body-blocked-scrolling");
  dialog.showModal();
});

function addPlayers(name1, name2) {
  const player1name = name1;
  const player2name = name2;

  let player1Pts = 0;
  let player2Pts = 0;

  const addPlayer1Pts = () => ++player1Pts;
  const addPlayer2Pts = () => ++player2Pts;
  const showPlayer1Pts = () => player1Pts;
  const showPlayer2Pts = () => player2Pts;
  
  return { player1name, player2name, 
    addPlayer1Pts, addPlayer2Pts, 
    showPlayer1Pts, showPlayer2Pts };
}

skipDialogBtn.addEventListener("click", () => {
  gameController();
  form.reset();
  setTimeout(() => {
    document.body.classList.remove("body-blocked-scrolling");
    dialog.close();
  }, 300);
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  gameController();
  form.reset();
  setTimeout(() => {
    document.body.classList.remove("body-blocked-scrolling");
    dialog.close();
  }, 300);
});

const displayController = (function() {
  const pl1NameSpan = document.querySelector(".pl1-name-span");
  const pl2NameSpan = document.querySelector(".pl2-name-span");
  const pl1ScoreSpan = document.querySelector(".pl1-score");
  const pl2ScoreSpan = document.querySelector(".pl2-score");
  const displayStatus = document.querySelector(".display-status");
  const fields = document.querySelectorAll(".field");
  
  const updatePlayer1Name = (text) => pl1NameSpan.textContent = text;
  const updatePlayer2Name = (text) => pl2NameSpan.textContent = text;
  
  const updatePlayer1Score = (score) => pl1ScoreSpan.textContent = score;
  const updatePlayer2Score = (score) => pl2ScoreSpan.textContent = score;

  const resetScores = () => {
    pl1ScoreSpan.textContent = 0;
    pl2ScoreSpan.textContent = 0;
  }

  const resetFields = () => {
    fields.forEach(field => {
      if (field.firstChild) {
        field.removeChild(field.firstChild);
        if (field.classList.contains("win")) {
          field.classList.remove("win");
        }
      }
    });
  }
  
  const clearGameStatus = () => displayStatus.textContent = "";
  
  const updateGameStatus = (message, player, players) => {
    if (message === "It's a draw!") {
      displayStatus.textContent = message;
    } else {
      displayStatus.textContent = message;
    const winningPlayer = player === "x" ? "player1" : "player2";
    const newScore = winningPlayer === "player1" ? players.addPlayer1Pts() : players.addPlayer2Pts();
    return winningPlayer === "player1" ? displayController.updatePlayer1Score(newScore) : 
    displayController.updatePlayer2Score(newScore);
    }
  }

  return { updatePlayer1Name, updatePlayer2Name, 
    updatePlayer1Score, updatePlayer2Score, 
    resetScores, updateGameStatus, 
    resetFields, clearGameStatus };
})();

function gameController() {
  const game = createGame();
  
  function processFormData() {
    const player1 = document.getElementById("player1").value.trim() || "Player 1";
    const player2 = document.getElementById("player2").value.trim() || "Player 2";
  
    return { player1, player2 };
  }

  const { player1, player2 } = processFormData();
  const players = addPlayers(player1, player2);
  displayController.updatePlayer1Name(players.player1name);
  displayController.updatePlayer2Name(players.player2name);
  
  displayController.resetScores();

  container.addEventListener("click", function(e) {
    const x = "x";
    const o = "o";
    let target = e.target;
    
    if (!target.classList.contains("field") || target.firstChild) {
      return;
    }
  
    let targetSplit = target.classList[0].split("-");
    let targetCapitalized = "set" +
                            targetSplit[0].charAt(0).toUpperCase() + targetSplit[0].slice(1) + 
                            targetSplit[1].charAt(0).toUpperCase() + targetSplit[1].slice(1);
    console.log(targetCapitalized);
  
    if (typeof gameboard[targetCapitalized] === "function") {
      if (game.markCounter % 2 === 1) {
        gameboard[targetCapitalized](x);
        game.markCounter++;
        drawMark(x);
      } else if (game.markCounter % 2 === 0) {
        gameboard[targetCapitalized](o);
        game.markCounter++;
        drawMark(o);
      }
    } else {
      console.error(`Method ${targetCapitalized} does not exist on gameboard.`);
    }
    
    function drawMark(mark) {
      const newDiv = document.createElement("div");
      newDiv.classList.add(mark);
      target.appendChild(newDiv);
      game.checkWin(mark, players);
    } 
  });
}

const gameboard = (function() {
  const row = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  // const printBoard = () => row.forEach(item => console.log(item));
  // Top row
  const setTopLeft = (mark) => row[0][0] = mark;
  const setTopMid = (mark) => row[0][1] = mark;
  const setTopRight = (mark) => row[0][2] = mark;
  // Mid row
  const setMidLeft = (mark) => row[1][0] = mark;
  const setMidMid = (mark) => row[1][1] = mark;
  const setMidRight = (mark) => row[1][2] = mark;
  // Bottom row
  const setLowLeft = (mark) => row[2][0] = mark;
  const setLowMid = (mark) => row[2][1] = mark;
  const setLowRight = (mark) => row[2][2] = mark;

  const resetBoard = () => row.forEach(r => {
    for (let i = 0; i < r.length; i++) {
      r[i] = "";
    }
  });
  
  return { 
    row, 
    setTopLeft, setTopMid, setTopRight,
    setMidLeft, setMidMid, setMidRight,
    setLowLeft, setLowMid, setLowRight, 
    resetBoard
  };
})();

function createGame() {
  let markCounter = 1;
  function checkWin(player, players) {
    const gb = gameboard.row;
    
    const logScore = () => {
      const msg = " wins!";
      const winMsg = player === "x" ? players.player1name + msg : players.player2name + msg;
      displayController.updateGameStatus(winMsg, player, players);
      blockContainerTimedToggle();
      return true;
    };
    
    const checkDraw = () => {
      return gb.flat().every(cell => cell !== "");
    };
  
    const logDraw = () => {
      displayController.updateGameStatus("It's a draw!");
      blockContainerTimedToggle();
      return true;
    }

    const blockContainerTimedToggle = () => {
      container.classList.add("inert");
      setTimeout(() => {
        container.classList.remove("inert");
        displayController.resetFields();
        displayController.clearGameStatus();
        gameboard.resetBoard();
        console.log(gameboard.row);
      }, 2000);
      return true;
    }

    const markWinLeftVert = () => v1.forEach(e => e.classList.add("win"));
    const markWinMidVert = () => v2.forEach(e => e.classList.add("win"));
    const markWinRightVert = () => v3.forEach(e => e.classList.add("win"));
    const markWinTopHor = () => h1.forEach(e => e.classList.add("win"));
    const markWinMidHor = () => h2.forEach(e => e.classList.add("win"));
    const markWinLowHor = () => h3.forEach(e => e.classList.add("win"));
    const markWinDiagTL2LR = () => d1.forEach(e => e.classList.add("win"));
    const markWinDiagTR2LL = () => d2.forEach(e => e.classList.add("win"));
    
    if (gb[0][0] === player && gb[1][0] === player && gb[2][0] === player) {
      markWinLeftVert();
      return logScore();
    } else if (gb[0][1] === player && gb[1][1] === player && gb[2][1] === player) {
      markWinMidVert();
      return logScore();
    } else if (gb[0][2] === player && gb[1][2] === player && gb[2][2] === player) {
      markWinRightVert();
      return logScore();
    } else if (gb[0][0] === player && gb[0][1] === player && gb[0][2] === player) {
      markWinTopHor();
      return logScore();
    } else if (gb[1][0] === player && gb[1][1] === player && gb[1][2] === player) {
      markWinMidHor();
      return logScore();
    } else if (gb[2][0] === player && gb[2][1] === player && gb[2][2] === player) {
      markWinLowHor();
      return logScore();
    } else if (gb[0][0] === player && gb[1][1] === player && gb[2][2] === player) {
      markWinDiagTL2LR();
      return logScore();
    } else if (gb[0][2] === player && gb[1][1] === player && gb[2][0] === player) {
      markWinDiagTR2LL();
      return logScore();
    } else {
      if (checkDraw()) {
        return logDraw();
      }
      return false;
    }
  }
  return { checkWin, markCounter };
}