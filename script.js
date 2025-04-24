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

function checkWin(player) {
  const gb = gameboard.row;
  const logScore = () => {
    console.log(`${player} wins!`);
    return true;
  };
  
  const checkDraw = () => {
    return gb.flat().every(cell => cell !== "");
  };

  const logDraw = () => {
    console.log("It's a draw!");
    return true;
  }

  if (gb[0][0] === player && gb[1][0] === player && gb[2][0] === player) {
    return logScore();
  } else if (gb[0][1] === player && gb[1][1] === player && gb[2][1] === player) {
    return logScore();
  } else if (gb[0][2] === player && gb[1][2] === player && gb[2][2] === player) {
    return logScore();
  } else if (gb[0][0] === player && gb[0][1] === player && gb[0][2] === player) {
    return logScore();
  } else if (gb[1][0] === player && gb[1][1] === player && gb[1][2] === player) {
    return logScore();
  } else if (gb[2][0] === player && gb[2][1] === player && gb[2][2] === player) {
    return logScore();
  } else if (gb[0][2] === player && gb[1][1] === player && gb[2][0] === player) {
    return logScore();
  } else if (gb[0][0] === player && gb[1][1] === player && gb[2][2] === player) {
    return logScore();
  } else {
    if (checkDraw()) {
      return logDraw();
    }
    return false;
  }
}

gameboard.setTopMid("x");
gameboard.setMidMid("x");
gameboard.setLowMid("x");
gameboard.printBoard();
checkWin("x");