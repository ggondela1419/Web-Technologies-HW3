export const CROP_TYPES = [
    { name: "wheat", points: 1, color: "#c2a679" }, 
    { name: "pumpkin", points: 3, color: "#ff5722" }, 
    { name: "golden_apple", points: 5, color: "#ffd700" }
];

export class Crop {
    /**
     * Sets up the crop's position and basic properties.
     * @param {number} x - x position of the crop on the cavas.
     * @param {number} y - y position of the crop on the cavas.
     * @param {{name: string, points: number, color: string}} type - type of crop (can be used later for visuals).
     */
    constructor(x, y, type = { name: "default", points: 1, color: "#4caf50" }) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type.name;
        this.points = type.points;
        this.color = type.color;
        this.dead = false; // gets marked true when collected
    }

    /**
     * Updates crop state, its a placeholder for now.
     * @param {number} dt - time since last frame in seconds.
     * @param {Game} game - reference to the game instance.
     */
    update(dt, game) {
        // crops don't move, but I might add animation or effects later
    }
    /**
     * Draws the crop as a green square.
     * @param {CanvasRenderingContext2D} ctx - canvas context to draw on.
     */
    draw(ctx) {
        ctx.fillStyle = this.color; // green stands out against the background
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        ctx.fillText(this.points, this.x, this.y - 4);
    }
}
