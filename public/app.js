import {
  GRID_SIZE,
  TICK_MS,
  createInitialState,
  restartGame,
  setDirection,
  stepGame,
  togglePause,
  positionsEqual
} from "./snake.js";

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const bestScoreValue = document.querySelector("#best-score");
const stateValue = document.querySelector("#state");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

const keyDirections = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  W: "up",
  A: "left",
  S: "down",
  D: "right"
};

let state = loadState();
let cells = [];

initializeBoard();
render();

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    state = togglePause(state);
    saveState();
    render();
    return;
  }

  const nextDirection = keyDirections[event.key];
  if (!nextDirection) {
    return;
  }

  event.preventDefault();
  if (state.isGameOver) {
    state = restartGame(state);
  }
  state = setDirection(state, nextDirection);
  saveState();
  render();
});

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  saveState();
  render();
});

restartButton.addEventListener("click", () => {
  state = restartGame(state);
  saveState();
  render();
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextDirection = button.dataset.direction;
    if (state.isGameOver) {
      state = restartGame(state);
    }
    state = setDirection(state, nextDirection);
    saveState();
    render();
  });
});

setInterval(() => {
  const nextState = stepGame(state);
  if (nextState !== state) {
    state = nextState;
    saveState();
    render();
  }
}, TICK_MS);

function initializeBoard() {
  board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, minmax(0, 1fr))`;

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
    cells.push(cell);
  }
}

function render() {
  cells.forEach((cell) => {
    cell.className = "cell";
  });

  state.snake.forEach((segment, index) => {
    const cell = cells[segment.y * GRID_SIZE + segment.x];
    if (!cell) {
      return;
    }
    cell.classList.add("snake");
    if (index === 0) {
      cell.classList.add("head");
    }
  });

  if (state.food) {
    const foodCell = cells[state.food.y * GRID_SIZE + state.food.x];
    if (foodCell && !positionsEqual(state.snake[0], state.food)) {
      foodCell.classList.add("food");
    }
  }

  scoreValue.textContent = String(state.score);
  bestScoreValue.textContent = String(state.bestScore);
  stateValue.textContent = state.isGameOver
    ? "Game Over"
    : state.isPaused
      ? "Paused"
      : "Running";
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
}

function loadState() {
  try {
    const raw = window.localStorage.getItem("snake-best-score");
    const initial = createInitialState();
    if (!raw) {
      return initial;
    }

    return {
      ...initial,
      bestScore: Number.parseInt(raw, 10) || 0
    };
  } catch {
    return createInitialState();
  }
}

function saveState() {
  try {
    window.localStorage.setItem("snake-best-score", String(state.bestScore));
  } catch {
    // Ignore storage failures and keep the game running.
  }
}
