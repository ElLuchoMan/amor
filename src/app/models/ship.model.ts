import { Bullet } from "./bullet.model";
import { intersects } from "./intersects.model";

export class Ship {
    private y: number;
    private lv!: { x: number; y: number; };
    private rv!: { x: number, y: number };
    private tv!: { x: number, y: number };
    private invulnerableTicks = 250;
    private width = 0;

    get leftVertex() { return this.lv; }
    get topVertex() { return this.tv; }
    get rightVertex() { return this.rv; }
    get Width() { return this.width; }

    get InvulnerableTicks() { return this.invulnerableTicks; }

    decrementInvulnerable() {
        this.invulnerableTicks--;
    }

    get X() {
        return this.x;
    }
    set X(value: number) {
        this.x = value;
    }
    get Y() {
        return this.y;
    }

    constructor(private ctx: CanvasRenderingContext2D, private x: number) {
        this.y = ctx.canvas.height - 100;
    }

    draw() {
        this.tv = { x: this.x, y: this.y };
        this.lv = { x: this.x - 25, y: this.y + 25 };
        this.rv = { x: this.x + 25, y: this.y + 25 };
        if (this.invulnerableTicks > 0 && this.invulnerableTicks % 5 !== 1) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.tv.x, this.tv.y);
        this.ctx.lineTo(this.lv.x, this.lv.y);
        this.ctx.lineTo(this.rv.x, this.rv.y);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    fire() {
        return new Bullet(this.ctx, this.x - 2.5, this.y - 2.5, -2, false);
    }

    makeInvulnerable() {
        this.invulnerableTicks = 250;
    }

    checkForRectCollision(x: any, y: any, w: any, h: any) {
        const p1 = { x, y };
        const p2 = { x: x + w, y };
        const p3 = { x, y: y + h };
        const p4 = { x: x + w, y: y + h };
        if (
            intersects(this.leftVertex.x, this.leftVertex.y, this.topVertex.x, this.topVertex.y, p1.x, p1.y, p2.x, p2.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.topVertex.x, this.topVertex.y, p1.x, p1.y, p3.x, p3.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.topVertex.x, this.topVertex.y, p2.x, p2.y, p4.x, p4.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.topVertex.x, this.topVertex.y, p3.x, p3.y, p4.x, p4.y) ||
            intersects(this.rightVertex.x, this.rightVertex.y, this.topVertex.x, this.topVertex.y, p1.x, p1.y, p2.x, p2.y) ||
            intersects(this.rightVertex.x, this.rightVertex.y, this.topVertex.x, this.topVertex.y, p1.x, p1.y, p3.x, p3.y) ||
            intersects(this.rightVertex.x, this.rightVertex.y, this.topVertex.x, this.topVertex.y, p2.x, p2.y, p4.x, p4.y) ||
            intersects(this.rightVertex.x, this.rightVertex.y, this.topVertex.x, this.topVertex.y, p3.x, p3.y, p4.x, p4.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.rightVertex.x, this.rightVertex.y, p1.x, p1.y, p2.x, p2.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.rightVertex.x, this.rightVertex.y, p1.x, p1.y, p3.x, p3.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.rightVertex.x, this.rightVertex.y, p2.x, p2.y, p4.x, p4.y) ||
            intersects(this.leftVertex.x, this.leftVertex.y, this.rightVertex.x, this.rightVertex.y, p3.x, p3.y, p4.x, p4.y)) {
            return true;
        } else {
            return false;
        }
    }
}
