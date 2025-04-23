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

function checkWin() {
  for (let i = 0; i < gameboard.row.length; i++) {
    for (let j = 0; j < gameboard.row[i].length; j++) {
      console.log(gameboard.row[0][2]);
    }
  }
}

gameboard.setTopRight("X");
gameboard.setMidRight("0");
gameboard.setLowRight("0");
gameboard.printBoard();
checkWin();