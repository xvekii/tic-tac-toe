const container = document.querySelector(".fields-container");

const v1 = document.querySelectorAll(".top-left, .mid-left, .low-left");
const v2 = document.querySelectorAll(".top-mid, .mid-mid, .low-mid");
const v3 = document.querySelectorAll(".top-right, .mid-right, .low-right");
const h1 = document.querySelectorAll(".top-left, .top-mid, .top-right");
const h2 = document.querySelectorAll(".mid-left, .mid-mid, .mid-right");
const h3 = document.querySelectorAll(".low-left, .low-mid, .low-right");
const d1 = document.querySelectorAll(".top-left, .mid-mid, .low-right");
const d2 = document.querySelectorAll(".top-right, .mid-mid, .low-left");

const gameboard = (function() {
  const row = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  const printBoard = () => row.forEach(item => console.log(item));
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
  
  return { 
    row, printBoard, 
    setTopLeft, setTopMid, setTopRight,
    setMidLeft, setMidMid, setMidRight,
    setLowLeft, setLowMid, setLowRight, 
  };
})();


function createGame() {
  let markCounter = 1;
  function checkWin(player) {
    
    const gb = gameboard.row;
    const logScore = () => {
      console.log(`${player} wins!`);
      container.classList.add("inert");
      return true;
    };
    
    const checkDraw = () => {
      return gb.flat().every(cell => cell !== "");
    };
  
    const logDraw = () => {
      console.log("It's a draw!");
      container.classList.add("inert");
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

container.addEventListener("click", function(e) {
  const x = "x";
  const o = "o";
  let target = e.target;
  if (!target.classList.contains("field")) return;
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
    gameboard.printBoard();
    game.checkWin(mark);
  } 
  
});

const game = createGame();