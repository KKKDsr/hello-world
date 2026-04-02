export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const TICK_MS = 140;

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

export function createInitialState(random = Math.random) {
  const center = Math.floor(GRID_SIZE / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center }
  ];

  return {
    width: GRID_SIZE,
    height: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: spawnFood(snake, GRID_SIZE, GRID_SIZE, random),
    score: 0,
    bestScore: 0,
    isGameOver: false,
    isPaused: false
  };
}

export function setDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  const activeDirection = state.pendingDirection || state.direction;
  if (state.snake.length > 1 && OPPOSITES[activeDirection] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused
  };
}

export function restartGame(state, random = Math.random) {
  const nextState = createInitialState(random);
  return {
    ...nextState,
    bestScore: Math.max(state.bestScore, state.score, nextState.bestScore)
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isPaused || state.isGameOver) {
    return state;
  }

  const direction = state.pendingDirection;
  const vector = DIRECTION_VECTORS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.x >= state.width ||
    nextHead.y < 0 ||
    nextHead.y >= state.height;

  const willEat = positionsEqual(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = bodyToCheck.some((segment) => positionsEqual(segment, nextHead));

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      isGameOver: true,
      bestScore: Math.max(state.bestScore, state.score)
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  const nextScore = willEat ? state.score + 1 : state.score;

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food: willEat
      ? spawnFood(nextSnake, state.width, state.height, random)
      : state.food,
    score: nextScore,
    bestScore: Math.max(state.bestScore, nextScore)
  };
}

export function spawnFood(snake, width, height, random = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const spaces = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        spaces.push({ x, y });
      }
    }
  }

  if (spaces.length === 0) {
    return null;
  }

  const index = Math.floor(random() * spaces.length);
  return spaces[index];
}

export function positionsEqual(a, b) {
  return Boolean(a) && Boolean(b) && a.x === b.x && a.y === b.y;
}
