import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, tap, throttleTime, merge, of, interval } from 'rxjs';
import { Bullet } from '../../models/bullet.model';
import { Ship } from '../../models/ship.model';
import { Enemy } from '../../models/enemy.model';
import { ParticalCluster } from '../../models/partical-cluster.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-invaders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.scss']
})
export class SpaceInvadersPageComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef;
  router = inject(Router);

  ctx!: CanvasRenderingContext2D;
  ship!: Ship;
  keys: { [key: number]: boolean } = {};
  bullets: Bullet[] = [];
  enemies: Enemy[] = [];
  particles: ParticalCluster[] = [];
  lives = 3;
  score = 0;
  round = 0;
  $stopped: BehaviorSubject<boolean> = new BehaviorSubject(true);
  $stoppedObs = this.$stopped.asObservable();
  $fire!: Observable<KeyboardEvent>;
  $keyDown!: Observable<KeyboardEvent>;
  $keyUp!: Observable<KeyboardEvent>;
  isMovingLeft = false;
  isMovingRight = false;
  isMobile = false;

  ngOnInit(): void {
    console.log(navigator.userAgent);
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;
    this.ctx.canvas.width = 500;
    this.ctx.canvas.height = 500;
    this.ship = new Ship(this.ctx, this.ctx.canvas.width / 2);

    this.$keyDown = fromEvent<KeyboardEvent>(document, 'keydown').pipe(tap(event => {
      this.keys[event.which] = true;
    }));

    this.$keyUp = fromEvent<KeyboardEvent>(document, 'keyup').pipe(tap(event => {
      this.keys[event.which] = false;
    }));

    this.$stoppedObs = this.$stoppedObs.pipe(tap(value => {
      if (!value) {
        this.gameLoop();
      }
    }));

    interval(400).pipe(
      tap(() => {
        if (!this.$stopped.value) {
          this.bullets.push(this.ship.fire());
        }
      })
    ).subscribe();
  }

  setUpGame() {
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.ship = new Ship(this.ctx, this.ctx.canvas.width / 2);
    this.round = 0;
    this.score = 0;
    this.lives = 3;
    this.$stopped.next(false);
  }

  ngAfterViewInit() {
    merge(this.$keyDown, this.$keyUp, this.$stoppedObs, of(this.gameLoop())).subscribe();
  }

  spawnSquadOfEnemies(count: number) {
    for (let i = 0; i <= count; i++) {
      this.spawnRowOfEnemies(20 * i);
    }
  }

  spawnRowOfEnemies(yOffSet: number) {
    for (let i = 0; i < this.ctx.canvas.height / 20; i++) {
      const speedMultiplier = this.round / 5; // Incrementa la velocidad con cada ronda
      if (Math.random() < 0.01) {
        this.enemies.push(new Enemy(this.ctx, i * 10 + (i * 10), 10 + yOffSet, 10, 10, 'green', 500, speedMultiplier));
      } else {
        this.enemies.push(new Enemy(this.ctx, i * 10 + (i * 10), 10 + yOffSet, 10, 10, 'blue', 100, speedMultiplier));
      }
    }
  }

  gameLoop = () => {
    if (this.$stopped.value || this.lives <= 0) {
      return;
    }

    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if ((this.keys[37] || this.isMovingLeft) && this.ship.X - this.ship.Width / 2 > 0) {
      this.ship.X -= 2;
    }
    if ((this.keys[39] || this.isMovingRight) && this.ship.X + this.ship.Width / 2 < this.ctx.canvas.width) {
      this.ship.X += 2;
    }

    this.bullets.forEach((b, i) => {
      b.draw();
      if (!b.IsEnemyFire) {
        const result = b.hitEnemy(this.enemies);
        if (result) {
          this.enemies.splice(this.enemies.indexOf(result), 1);
          this.bullets.splice(i, 1);
          this.particles.push(new ParticalCluster(this.ctx, 5, result.X, result.Y));
          this.score += result.Points;
        }
      } else if (this.ship.InvulnerableTicks === 0 && this.ship.checkForRectCollision(b.X, b.Y, b.W, b.H)) {
        this.lives--;
        this.particles.push(new ParticalCluster(this.ctx, 10, this.ship.X, this.ship.Y));
        this.ship.makeInvulnerable();
      }

      if (b.lifespan <= 0) {
        this.bullets.splice(i, 1);
      }
    });

    this.particles.forEach((e, i) => {
      e.draw();
      if (e.Lifespan <= 0) {
        this.particles.splice(i, 1);
      }
    });

    this.ship.draw();
    if (this.ship.InvulnerableTicks > 0) {
      this.ship.decrementInvulnerable();
    }

    this.enemies.forEach((e, i) => {
      e.draw();
      if (this.ship.InvulnerableTicks === 0 && this.ship.checkForRectCollision(e.X, e.Y, e.Width, e.Height)) {
        this.lives--;
        this.particles.push(new ParticalCluster(this.ctx, 10, this.ship.X, this.ship.Y));
        this.ship.makeInvulnerable();
      } else if (e.Y >= this.ctx.canvas.height) {
        this.enemies.splice(i, 1);
      } else if (e.checkLoS(this.enemies) && Math.random() < (this.round / 1000)) {
        this.bullets.push(e.fire());
      }
    });

    if (this.enemies.length <= 0) {
      this.spawnSquadOfEnemies(this.round++);
    }
  }

  moveLeft(isMoving: boolean) {
    this.isMovingLeft = isMoving;
  }

  moveRight(isMoving: boolean) {
    this.isMovingRight = isMoving;
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }
}
