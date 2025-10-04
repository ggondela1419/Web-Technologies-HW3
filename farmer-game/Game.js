import { Farmer } from './Farmer.js';
import { Crop, CROP_TYPES } from './Crop.js';
import { Scarecrow, aabb, clamp } from './Obstacle.js';

/** Game configuration constants */
const WIDTH = 900;
const HEIGHT = 540;
const TILE = 30;
const GAME_LEN = 60; 
const GOAL = 15;

/** Game states */
const State = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAMEOVER: "GAMEOVER",
    PAUSED: "PAUSED",
    WIN: "WIN"
};

/**
 * handles keyboard input
 */

class Input {
    /**
     * @param {Game} game - the same instance to control
    */
    constructor(game) {
        this.game = game;
        this.keys = new Set();
        this._down = this.keyDown.bind(this);
        this._up = this.keyUp.bind(this);
        window.addEventListener("keydown", this._down);
        window.addEventListener("keyup", this._up);
    }

    /**
     *  records keydown events
     * @param {KeyboardEvent} e
    */
    keyDown(e) {
        if (e.key.toLowerCase() === "p") this.game.togglePause();
        this.keys.add(e.key);
    }
    /**
     * records keyup events
     * @param {KeyboardEvent} e
     */
    keyUp(e) {
        this.keys.delete(e.key);
    }
    /**
     * Removes event listeners
     */
    dispose() {
        window.removeEventListener("keydown", this._down);
        window.removeEventListener("keyup", this._up);
    }
}

/**
 * main game class that controls state, entities, and rendering
 */
export class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas - the canvas element to render to
     */
    constructor(canvas) {
        if (!canvas) {
            console.error("Canvas #game not found. Check index.html IDs.");
            return;
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.state = State.MENU;

        // world
        this.player = new Farmer(WIDTH / 2 - 17, HEIGHT - 80);
        this.crops = [];
        this.obstacles = [];

        // timing
        this.lastTime = 0;
        this.timeLeft = GAME_LEN;
        this.spawnEvery = 0.8;
        this._accumSpawn = 0;

        // score & goal
        this.score = 0;
        this.goal = GOAL;

        // input & resize
        this.input = new Input(this);
        this._onResize = this.onResize.bind(this);
        //This bind makes sure that when the resize event triggers the onResize method,
        //the "this" inside onResize still points to the Game instance, not the window.
        window.addEventListener("resize", this._onResize);

        // UI
        const get = id => document.getElementById(id) || console.error(`#${id} not found`);
        this.ui = {
            score: get("score"),
            time: get("time"),
            goal: get("goal"),
            status: get("status"),
            start: get("btnStart"),
            reset: get("btnReset"),
        };
        if (this.ui.goal) this.ui.goal.textContent = String(this.goal);
        if (this.ui.start) this.ui.start.addEventListener("click", () => this.start()); // arrow keeps `this`
        //Arrow function keeps "this" bound to the Game instance. Without it, "this" in start()
        //would point to the button element instead of the game.
        if (this.ui.reset) this.ui.reset.addEventListener("click", () => this.reset());

        // RAF loop as arrow function → lexical `this`
        //Using an arrow function here ensures that "this" inside the tick method
        //always points to the Game instance, allowing update() and render() access the correct properties.
        this.tick = (ts) => {
            const dt = Math.min((ts - this.lastTime) / 1000, 0.033); // ~30ms cap
            this.lastTime = ts;
            this.update(dt);
            this.render();
            requestAnimationFrame(this.tick);
        };
    }

    /**
     * Optional handler for window resize events
     */
    onResize() {
        //handle resize if needed
    }

    /**
     * starts or resumes the game
     */
    start() {
        if ([State.MENU, State.GAMEOVER, State.WIN].includes(this.state)) {
            this.reset();
            this.state = State.PLAYING;
            this.ui.status.textContent = "Playing...";
            requestAnimationFrame(this.tick);
        } else if (this.state === State.PAUSED) {
            this.state = State.PLAYING;
            this.ui.status.textContent = "Playing...";
        }
    }

    /**
     * Resets everything back to the starting point
     */
    reset() {
        this.state = State.MENU;
        this.player.setPos(WIDTH / 2 - 17, HEIGHT - 80);
        this.crops = [];
        this.obstacles = [new Scarecrow(200,220), new Scarecrow(650, 160)];
        this.timeLeft = GAME_LEN;
        this.score = 0;
        this._accumSpawn = 0;
        this.lastTime = performance.now();
        this.syncUI();
        this.ui.status.textContent = "Menu";
    }

    /**
     * toggles pause state
     */
    togglePause() {
        this.state = this.state === State.PAUSED ? State.PLAYING : State.PAUSED;
        this.ui.status.textContent = this.state === State.PAUSED ? "Paused" : "Playing...";
    }

    /**
     * updates UI elements to match game state
     */
    syncUI() {
        this.ui.score.textContent = String(this.score);
        this.ui.time.textContent = Math.ceil(this.timeLeft);
        this.ui.goal.textContent = String(this.goal);
    }
     
    /**
     * adds a new crop to the game at a random position
     */
    spawnCrop() {
        const gx = Math.floor(Math.random() * ((WIDTH - 2 * TILE) / TILE)) * TILE + TILE;
        const gy = Math.floor(Math.random() * ((HEIGHT - 2 * TILE) / TILE)) * TILE + TILE;
        const cropType = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)];  
        this.crops.push(new Crop(gx, gy, cropType));
    }

    /** 
     * runs the main game logic like movement, crop spawning, score updates
     * @param {number} dt - time passed in seconds since last update
    */
    update(dt) {
        if (this.state !== State.PLAYING) return;

        this.timeLeft = clamp(this.timeLeft - dt, 0, GAME_LEN);
        if (this.timeLeft <= 0) {
            this.state = this.score >= this.goal ? State.WIN : State.GAMEOVER;
            this.ui.status.textContent = this.state === State.WIN ? "You Win!" : "Game Over";
            this.syncUI();
            return;
        }

        const progress = 1 - this.timeLeft / GAME_LEN; // 0 at start, 1 at end
        this.spawnEvery = 0.8 - (0.5 * progress);

        this.player.handleInput(this.input.keys);
        this.player.update(dt, this);

        this._accumSpawn += dt;
        while (this._accumSpawn >= this.spawnEvery) {
            this._accumSpawn -= this.spawnEvery;
            this.spawnCrop();
        }

        const collected = this.crops.filter(c => aabb(this.player, c));
        if (collected.length) {
            collected.forEach(crop => {
                this.score += crop.points;
                crop.dead = true;
            });
            this.ui.score.textContent = String(this.score);
            if (this.score >= this.goal) {
                this.state = State.WIN;
                this.ui.status.textContent = "You Win!";
            }
        }

        this.crops = this.crops.filter(c => !c.dead);
        this.crops.forEach(c => c.update(dt, this));
        this.ui.time.textContent = Math.ceil(this.timeLeft);
    }

    /** 
     * draws the game visuals like background grid, crops, obstacles, player
     */
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#dff0d5";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.strokeStyle = "#c7e0bd";
        ctx.lineWidth = 1;

        for (let y = TILE; y < HEIGHT; y += TILE) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
        }
        for (let x = TILE; x < WIDTH; x += TILE) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
        }
        this.crops.forEach(c => c.draw(ctx));
        this.obstacles.forEach(o => o.draw(ctx));
        this.player.draw(ctx);

        ctx.fillStyle = "#333";
        ctx.font = "16px system-ui, sans-serif";
        if (this.state === State.MENU) ctx.fillText("Press Start to Begin", 20, 28);    
        else if (this.state === State.PAUSED) ctx.fillText("Paused (press P to resume)", 20, 28);
        else if (this.state === State.GAMEOVER) ctx.fillText("Game Over! Press Reset to return to Menu.", 20, 28);
        else if (this.state === State.WIN) ctx.fillText("You Win! Press Reset to play again.", 20, 28);
    }

    /**
     * cleans up event listeners
     */
    dispose() {
        this.input.dispose();
        window.removeEventListener("resize", this._onResize);
    }
}

//boot the game
const canvas = document.getElementById("game");
export const game = new Game(canvas);










