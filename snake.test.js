import assert from "node:assert/strict";

import {
  createInitialState,
  setDirection,
  spawnFood,
  stepGame
} from "./public/snake.js";

const tests = [
  {
    name: "snake moves one cell in the active direction",
    run() {
      const initial = createInitialState(() => 0);
      const next = stepGame(initial, () => 0);

      assert.deepEqual(next.snake[0], {
        x: initial.snake[0].x + 1,
        y: initial.snake[0].y
      });
      assert.equal(next.score, 0);
    }
  },
  {
    name: "snake grows and score increases when food is eaten",
    run() {
      const initial = {
        ...createInitialState(() => 0),
        snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }],
        food: { x: 3, y: 2 }
      };

      const next = stepGame(initial, () => 0);

      assert.equal(next.snake.length, 4);
      assert.equal(next.score, 1);
      assert.notDeepEqual(next.food, { x: 3, y: 2 });
    }
  },
  {
    name: "snake cannot reverse directly into itself",
    run() {
      const initial = createInitialState(() => 0);
      const next = setDirection(initial, "left");

      assert.equal(next.pendingDirection, "right");
    }
  },
  {
    name: "game ends when snake hits a wall",
    run() {
      const initial = {
        ...createInitialState(() => 0),
        snake: [{ x: 15, y: 1 }, { x: 14, y: 1 }, { x: 13, y: 1 }],
        direction: "right",
        pendingDirection: "right"
      };

      const next = stepGame(initial, () => 0);

      assert.equal(next.isGameOver, true);
    }
  },
  {
    name: "food spawns only in unoccupied cells",
    run() {
      const food = spawnFood(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 }
        ],
        2,
        2,
        () => 0
      );

      assert.deepEqual(food, { x: 1, y: 1 });
    }
  }
];

let passed = 0;

for (const testCase of tests) {
  try {
    testCase.run();
    passed += 1;
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    console.error(`FAIL ${testCase.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

if (process.exitCode !== 1) {
  console.log(`All ${passed} Snake logic tests passed.`);
}
