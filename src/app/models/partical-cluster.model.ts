export class ParticalCluster {
    private lifespan = 15;

    get Lifespan() { return this.lifespan; }

    constructor(private ctx: CanvasRenderingContext2D, private count: number, private x: number, private y: number) { }

    draw() {
        for (let i = 0; i < this.count; i++) {
            this.ctx.fillStyle = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            this.ctx.fillRect(this.x + Math.random() * 20, this.y + Math.random() * 20, 2, 2);
        }
        this.lifespan--;
    }
}