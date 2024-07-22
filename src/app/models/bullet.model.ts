import { Enemy } from "./enemy.model";

export class Bullet {
    private w = 5;
    public lifespan;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private x: number,
        private y: number,
        private vy: number,
        private isEnemyFire: boolean
    ) {
        this.lifespan = ctx.canvas.height;
    }

    get IsEnemyFire() { return this.isEnemyFire; }

    get X() { return this.x; }

    get Y() { return this.y; }

    get W() { return this.w; }

    get H() { return this.w; }

    draw() {
        this.updatePosition();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.w, this.w);
    }

    hitEnemy(enemies: Enemy[]) {
        return enemies.find(
            e => this.x < e.X + e.Width
                && this.x + this.w > e.X
                && this.y < e.Y + e.Height
                && this.y + this.w > e.Y);
    }

    updatePosition() {
        this.y += this.vy;
        this.lifespan--;
    }
}