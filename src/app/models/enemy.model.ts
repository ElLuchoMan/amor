import { Bullet } from "./bullet.model";

export class Enemy {
    private tic: number;
    private toc: boolean;

    get X() { return this.x; }

    get Y() { return this.y; }

    get Height() { return this.h; }

    get Width() { return this.w; }

    get Points() { return this.points; }

    constructor(
        private ctx: CanvasRenderingContext2D,
        private x: number,
        private y: number,
        private h: number,
        private w: number,
        private c: string,
        private points: number,
        private speedMultiplier: number = 1
    ) {
        this.tic = 50 / this.speedMultiplier;
        this.toc = true;
    }

    updatePosition() {
        if (this.tic-- <= 0) {
            this.tic = 50 / this.speedMultiplier;
            this.x += this.toc ? this.w : this.w * -1;
            this.toc = !this.toc;
            this.y += this.h;
        }
    }

    draw() {
        this.updatePosition();
        this.ctx.fillStyle = this.c;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    fire() {
        return new Bullet(this.ctx, this.x + 10, this.y + 15, 2, true);
    }

    checkLoS(enemies: Enemy[]) {
        return !enemies.some(e => e.X === this.X && e.Y > this.Y);
    }
}
