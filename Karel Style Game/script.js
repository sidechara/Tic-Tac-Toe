let score = 0;
let totalIceCreams = 0;
let isRunningAI = false;

// H shape layout
const mazeLayout = [
  ["", "", "", "", "", ""],
  ["", "I", "", "", "I", ""],
  ["", "I", "", "", "I", ""],
  ["", "I", "I", "I", "I", ""],
  ["", "I", "", "", "I", ""],
  ["", "I", "", "", "I", ""]
];

const rows = mazeLayout.length;
const cols = mazeLayout[0].length;

// Start position (bottom-left)
const start = { row: 0, col: cols - 1 };

let player = {
  row: start.row,
  col: start.col,
  direction: "up"
};

// Count ice creams
totalIceCreams = mazeLayout.flat().filter(c => c === "I").length;

maze.style.setProperty("--cols", cols);
// Render


function renderMaze() {
  const maze = document.getElementById("maze");
  maze.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (mazeLayout[r][c] === "I") {
        cell.innerHTML = '<img src="icecream.png" style="width:70%;height:70%;">';
      }

     
      if (player.row === r && player.col === c) {
        cell.classList.add("player");
        const rotation = getRotation();
        cell.innerHTML = `
          <img src="anthony2.png"
          style="width:100%; height:100%; transform: rotate(${rotation}deg); transition: transform 0.2s;">
          `;
        updateCompass();
  }

      maze.appendChild(cell);
    }
  }

  document.getElementById("score").innerText = score;
  checkWin();
}

function updateCompass() {
  const map = {
    up: "⬆️ Up",
    right: "➡️ Right",
    down: "⬇️ Down",
    left: "⬅️ Left"
  };

  document.getElementById("compass").innerText =
    "Direction: " + map[player.direction];
}

// Move
function move() {
  console.log("Attempting to move", player.direction);
  if (!frontIsClear()) return;

  if (player.direction === "up") player.row--;
  if (player.direction === "down") player.row++;
  if (player.direction === "left") player.col--;
  if (player.direction === "right") player.col++;

  pickIceCream();
  renderMaze();
}
function getRotation() {
  switch (player.direction) {
    case "up": return 0;
    case "right": return 90;
    case "down": return 180;
    case "left": return 270;
  }
}

// Turns
function turnLeft() {
  const dirs = ["up", "left", "down", "right"];
  player.direction = dirs[(dirs.indexOf(player.direction) + 1) % 4];
  console.log("Attempting to move", player.direction);
  renderMaze();
}
function turnRight() {
  for (let i = 0; i < 3; i++) {
    turnLeft();
  }
}
function flip() {
  for (let i = 0; i < 2; i++) {
    turnLeft();
  }
}

// Check
function frontIsClear() {
  let r = player.row;
  let c = player.col;

  if (player.direction === "up") r--;
  if (player.direction === "down") r++;
  if (player.direction === "left") c--;
  if (player.direction === "right") c++;

  return !(r < 0 || c < 0 || r >= rows || c >= cols);
}

// 🍦 Collect
function pickIceCream() {
  if (mazeLayout[player.row][player.col] === "I") {
    mazeLayout[player.row][player.col] = "";
    score++;
  }
}

// Win condition
function checkWin() {
  if (
    score === totalIceCreams &&
    player.row === start.row &&
    player.col === start.col
  ) {
    setTimeout(() => alert("Perfect! Collected all ice cream and returned!"), 100);
  }
}

function runAI() {
  // TODO - Not complete, just a demo of how to run commands
  if (isRunningAI) return;

  const commands2 = [ // Brute force approach, doesn't trace H shape, just goes row by row
    "turnLeft", "move", "move", "move", "move", "move", // Row 1
    "turnLeft",  "move", "turnLeft",// Orient into Row 2
    "move", "move", "move", "move", "move", // Row 2
    "turnRight", "move", "turnRight", // Orient into Row 3
    "move", "move", "move", "move", "move", // Row 3
    "turnLeft", "move", "turnLeft", // Orient into Row 4
    "move", "move", "move", "move", "move", // Row 4
    "turnRight", "move", "turnRight", // Orient into Row 5
    "move", "move", "move", "move", "move", // Row 5
    "turnLeft", "move", "turnLeft", // Orient into Row 6
    "move", "move", "move", "move", "move", // Row 6
    "turnLeft", "move", "move", "move", "move", "move", // Return to Sender
  ];

  const commands = [ // Traces H shape, but needs to be starting from top-right corner
    "turnLeft", "move", "move", "move", "move", // Row 1
    "turnLeft",  "move", "move", "move", "move", "move" ,// Left Leg of H
    "flip", "move", "move", "turnRight", "move", "move","move", "turnRight", "move", "move", 
    "flip", "move", "move", "move", "move", "move", "turnRight", "move", "turnLeft",
  ]

  runCommands(commands);
}

function runCommands(commands) {
  if (isRunningAI) return;

  isRunningAI = true;
  let i = 0;

  function step() {
    if (i >= commands.length) {
      isRunningAI = false;
      return;
    }

    execute(commands[i]);
    i++;
    setTimeout(step, 300);
  }

  step();
}

function execute(cmd) {
  switch (cmd) {
    case "move": move(); break;
    case "turnLeft": turnLeft(); break;
    case "turnRight": turnRight(); break;
    case "flip": flip(); break;
  }
}

// Init
renderMaze();