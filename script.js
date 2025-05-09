const container = document.querySelector(".fields-container");
const addPlayersDialog = document.getElementById("dialog");
const gameOverDialog = document.getElementById("game-over-dialog");
const form = document.getElementById("player-names-form");
const skipDialogBtn = document.querySelector(".skip-dialog-btn");
const restartGameBtn = document.querySelector(".restart-game-btn");

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("body-blocked-scrolling");
  addPlayersDialog.showModal();
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
  const resetPlayer1Pts = () => player1Pts = 0;
  const resetPlayer2Pts = () => player2Pts = 0;
  
  return { player1name, player2name, 
    addPlayer1Pts, addPlayer2Pts, 
    showPlayer1Pts, showPlayer2Pts,
    resetPlayer1Pts, resetPlayer2Pts };
}

skipDialogBtn.addEventListener("click", () => {
  form.reset();
  gameController();
  displayController.showGameboard();
  setTimeout(() => {
    document.body.classList.remove("body-blocked-scrolling");
    addPlayersDialog.close();
  }, 300);
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  displayController.showGameboard();
  gameController();
  form.reset();
  setTimeout(() => {
    document.body.classList.remove("body-blocked-scrolling");
    addPlayersDialog.close();
  }, 300);
});

restartGameBtn.addEventListener("click", () => {
  displayController.resetScores();
  setTimeout(() => {
    gameboard.unblockScrolling();
    gameOverDialog.close();
  }, 300);
});

const displayController = (function() {
  const pl1NameSpan = document.querySelector(".pl1-name-span");
  const pl2NameSpan = document.querySelector(".pl2-name-span");
  const pl1ScoreSpan = document.querySelector(".pl1-score");
  const pl2ScoreSpan = document.querySelector(".pl2-score");
  const displayStatus = document.querySelector(".display-status");
  const fields = document.querySelectorAll(".field");
  const pl1GameOverName = document.querySelector(".pl1-game-over-name");
  const pl1GameOverScore = document.querySelector(".pl1-game-over-score");
  const pl2GameOverName = document.querySelector(".pl2-game-over-name");
  const pl2GameOverScore = document.querySelector(".pl2-game-over-score");
  const fieldsContainer = document.querySelector(".fields-container");
  const displayScore = document.querySelector(".display-score");
  const player1IconDiv = document.querySelector(".pl1-icon-div");
  const player2IconDiv = document.querySelector(".pl2-icon-div");

  const showGameboard = () => {
    fieldsContainer.classList.add('active');
    displayScore.classList.add('active');
  }
  
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
  
  const markCurrentPlayer = (playerNum) => {
    setTimeout(() => {
      const playerIconDiv = playerNum === 1 ? player1IconDiv : player2IconDiv;
      playerIconDiv.classList.add("player-active");
    }, 100);
  }

  const unmarkCurrentPlayer = (playerNum) => {
    const playerIconDiv = playerNum === 1 ? player1IconDiv : player2IconDiv;
    playerIconDiv.classList.remove("player-active");
  }
  
  const updateGameStatus = (message, player, players) => {  
    const resetPlayerPts = () => {
      players.resetPlayer1Pts();
      players.resetPlayer2Pts();
    }

    const updateStatusMsg = (msg) => displayStatus.textContent = msg;
    
    const showGameOverScore = () => {
      if (pl1GameOverName && pl2GameOverName && gameOverDialog) {
        pl1GameOverName.textContent = players.player1name + ":";
        pl1GameOverScore.textContent = players.showPlayer1Pts();
        pl2GameOverName.textContent = players.player2name + ":";
        pl2GameOverScore.textContent = players.showPlayer2Pts();
      }
    }
    
    if (message === "It's a draw!") {
      updateStatusMsg(message);
    } else {
      updateStatusMsg(message);
      const winningPlayer = player === "x" ? "player1" : "player2";
      const newScore = winningPlayer === "player1" ? players.addPlayer1Pts() : 
      players.addPlayer2Pts();
      
      if (newScore === 5) {
        winningPlayer === "player1" ? displayController.updatePlayer1Score(newScore) : 
        displayController.updatePlayer2Score(newScore);
        displayStatus.textContent = message;

        setTimeout(() => {
          gameOverDialog.showModal();
        }, 1500);
        
        showGameOverScore();
        resetPlayerPts();
        gameboard.blockScrolling();
      } else {
        winningPlayer === "player1" ? displayController.updatePlayer1Score(newScore) : 
        displayController.updatePlayer2Score(newScore);
      }
    }
  }
  return { markCurrentPlayer, unmarkCurrentPlayer,
    updatePlayer1Name, updatePlayer2Name, 
    updatePlayer1Score, updatePlayer2Score, 
    resetScores, updateGameStatus, 
    resetFields, clearGameStatus, showGameboard };
})();


function gameController() {
  const game = createGame();
  
  const { player1, player2 } = game.processFormData();
  const players = addPlayers(player1, player2);
  displayController.updatePlayer1Name(players.player1name);
  displayController.updatePlayer2Name(players.player2name);
  displayController.resetScores();
  displayController.markCurrentPlayer(1);
  
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
  
    if (typeof gameboard[targetCapitalized] === "function") {
      if (game.markCounter % 2 === 1) {
        gameboard[targetCapitalized](x);
        game.markCounter++;
        drawMark(x);
        displayController.unmarkCurrentPlayer(1);
        displayController.markCurrentPlayer(2);
        
      } else if (game.markCounter % 2 === 0) {
        gameboard[targetCapitalized](o);
        game.markCounter++;
        drawMark(o);
        displayController.unmarkCurrentPlayer(2);
        displayController.markCurrentPlayer(1);
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

  const blockScrolling = () => {
    document.body.classList.add("body-blocked-scrolling");
  }

  const unblockScrolling = () => {
    document.body.classList.remove("body-blocked-scrolling");
  }

  const blockContainerTimedToggle = () => {
    container.classList.add("inert");
    blockScrolling();
    setTimeout(() => {
      container.classList.remove("inert");
      displayController.resetFields();
      displayController.clearGameStatus();
      gameboard.resetBoard();
      console.log(gameboard.row);
    }, 2000);
    return true;
  }
  
  return { 
    row, 
    setTopLeft, setTopMid, setTopRight,
    setMidLeft, setMidMid, setMidRight,
    setLowLeft, setLowMid, setLowRight, 
    resetBoard, blockContainerTimedToggle,
    blockScrolling,unblockScrolling
  };
})();

function createGame() {
  const v1 = document.querySelectorAll(".top-left, .mid-left, .low-left");
  const v2 = document.querySelectorAll(".top-mid, .mid-mid, .low-mid");
  const v3 = document.querySelectorAll(".top-right, .mid-right, .low-right");
  const h1 = document.querySelectorAll(".top-left, .top-mid, .top-right");
  const h2 = document.querySelectorAll(".mid-left, .mid-mid, .mid-right");
  const h3 = document.querySelectorAll(".low-left, .low-mid, .low-right");
  const d1 = document.querySelectorAll(".top-left, .mid-mid, .low-right");
  const d2 = document.querySelectorAll(".top-right, .mid-mid, .low-left");
  
  const processFormData = () => {
    const player1 = document.getElementById("player1").value.trim() || "Player X";
    const player2 = document.getElementById("player2").value.trim() || "Player O";
    return { player1, player2 };
  }
  
  let markCounter = 1;
  function checkWin(player, players) {
    const gb = gameboard.row;
    
    const logScore = () => {
      const msg = " wins!";
      const winMsg = player === "x" ? players.player1name + msg : players.player2name + msg;
      displayController.updateGameStatus(winMsg, player, players);
      gameboard.blockContainerTimedToggle();
      return true;
    };
    
    const checkDraw = () => {
      return gb.flat().every(cell => cell !== "");
    };
  
    const logDraw = () => {
      displayController.updateGameStatus("It's a draw!");
      gameboard.blockContainerTimedToggle();
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
  return { checkWin, markCounter, processFormData };
}