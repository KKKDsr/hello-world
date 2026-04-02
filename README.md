# Classic Snake

A small, dependency-free frontend project that runs a classic Snake game in the browser.

## What is a frontend project?

A frontend project is the part of an application that users directly see and interact with in the browser. In this repo, that means:

- `public/index.html`: the page structure
- `public/styles.css`: the visual styles
- `public/app.js`: browser behavior and rendering
- `public/snake.js`: the pure game logic

Creating a frontend project usually means preparing those files, then serving them through a local web server so the browser can load them.

## Run locally

1. Install Node.js if it is not already available.
2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Run tests

```bash
npm test
```

## Manual checklist

- Arrow keys and `WASD` move the snake
- The snake grows after eating food and the score increases
- `Space` or the pause button pauses and resumes the game
- The restart button resets the board after a game over
- Hitting the wall or the snake body ends the game
