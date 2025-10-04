/** 
 * Represents the player character in the game.
 * Handles movement, input, and rendering to the canvas.
 */
export class Farmer {
    /**
     * Sets up initial starting position and size of the farmer
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 40;
        this.speed = 160;
        this.color = "#3b6ba5"; //Used this for visibility
    }

    /**
     * Checks which keys are currently pressed and sets movement direction
     * @param {Set<string>} keys - Current keys being held down.
     */
    handleInput(keys) {
        this.dx = 0;
        this.dy = 0;
        if (keys.has("ArrowLeft") || keys.has("a")) this.dx -= 1;
        if (keys.has("ArrowRight") || keys.has("d")) this.dx += 1;
        if (keys.has("ArrowUp") || keys.has("w")) this.dy -= 1;
        if (keys.has("ArrowDown") || keys.has("s")) this.dy += 1;
    }

    /**
     * Moves the farmer based on input and time passed.
     * Also clamps position so the player doesn't leave the canvas.
     * @param {number} dt - Time since last frame in seconds.
     * @param {Game} game - Reference to the game instance.
     */
    update(dt, game) {
        this.x += this.dx * this.speed * dt;
        this.y += this.dy * this.speed * dt;

        // Clamp position prevents farmer from going off-screen
        this.x = Math.max(0, Math.min(game.canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(game.canvas.height - this.height, this.y));
    }

    /**
     * Draws the farmer as a rectangle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Manually sets the farmer's position, used when resetting the game.
     * @param {number} x - New x position.
     * @param {number} y - New y position.
     */
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}
