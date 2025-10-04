export class Scarecrow {
    /**
     * Sets up the scarecrow's position and size.
     * @param {number} x - x position on the canvas.
     * @param {number} y - y position on the canvas.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
    }

    /**
     * Draws the scarecrow as a brown rectangle.
     * @param {CanvasRenderingContext2D} ctx - canvas context used for drawing.
     */
    draw(ctx) {
        ctx.fillStyle = "#8b5a2b"; // brown color for scarecrow
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

/**
 * Checks if two rectangles are overlapping.
 * Used for collision detection between player and crops or obstacles.
 * @param {Object} a - first object with x, y, width, height.
 * @param {Object} b - second object with x, y, width, height.
 * @returns {boolean} true if they overlap.
 */
export function aabb(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

/**
 * Keeps a value between a minimum and maximum.
 * I use this to stop the player from going off-screen.
 * @param {number} value - the number to clamp.
 * @param {number} min - minimum allowed value.
 * @param {number} max - maximum allowed value.
 * @returns {number} clamped value.
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
