class GameController {
  constructor() {
    this.heroes = [];
    this.bullets = [];
    this.context = null;
    this.canvas = null;
    this.mouseX = null;
    this.mouseY = null;
    this.selectedHero = null;
    this.lastFireTime = { red: 0, blue: 0 };
  }

  init(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.heroes = [
      { x: 50, y: 100, radius: 30, color: 'red', dy: 2, bulletColor: 'red', fireRate: 500, speed: 2, hits: 0 },
      { x: canvas.width - 50, y: 100, radius: 30, color: 'blue', dy: 2, bulletColor: 'blue', fireRate: 500, speed: 2, hits: 0 }
    ];

    this.gameLoop();
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    const currentTime = Date.now();
    this.heroes.forEach(hero => {
      // Движение героев
      hero.y += hero.dy * hero.speed;
      if (hero.y - hero.radius < 0 || hero.y + hero.radius > this.canvas.height) {
        hero.dy = -hero.dy;
      }

      // Отталкивание от курсора
      if (this.mouseX !== null && this.mouseY !== null) {
        const distance = Math.sqrt((hero.x - this.mouseX) ** 2 + (hero.y - this.mouseY) ** 2);
        if (distance < hero.radius) {
          hero.dy = -hero.dy;
        }
      }

      // Стрельба снарядами
      if (currentTime - this.lastFireTime[hero.color] > hero.fireRate) {
        this.bullets.push({
          x: hero.x,
          y: hero.y,
          dx: hero.x < this.canvas.width / 2 ? 5 : -5,
          dy: 0,
          radius: 5,
          color: hero.bulletColor
        });
        this.lastFireTime[hero.color] = currentTime;
      }
    });

    this.bullets.forEach((bullet, bulletIndex) => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;

      // Удаление снаряда, если он вышел за границы поля
      if (bullet.x < 0 || bullet.x > this.canvas.width) {
        this.bullets.splice(bulletIndex, 1);
      } else {
        // Проверка столкновения с героями
        this.heroes.forEach((hero, heroIndex) => {
          const distance = Math.sqrt((bullet.x - hero.x) ** 2 + (bullet.y - hero.y) ** 2);
          if (distance < hero.radius + bullet.radius && bullet.color !== hero.color) {
            this.bullets.splice(bulletIndex, 1);
            hero.hits++;
          }
        });
      }
    });
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Отрисовка героев
    this.heroes.forEach(hero => {
      this.context.beginPath();
      this.context.arc(hero.x, hero.y, hero.radius, 0, Math.PI * 2);
      this.context.fillStyle = hero.color;
      this.context.fill();
      this.context.closePath();

      // Отрисовка количества попаданий
      this.context.fillStyle = 'black';
      this.context.font = '20px Arial';
      this.context.fillText(`Hits: ${hero.hits}`, hero.x - 20, hero.y - 40);
    });

    // Отрисовка снарядов
    this.bullets.forEach(bullet => {
      this.context.beginPath();
      this.context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      this.context.fillStyle = bullet.color;
      this.context.fill();
      this.context.closePath();
    });
  }

  handleMouseMove(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseClick(x, y) {
    let selectedHero = null;
    this.heroes.forEach(hero => {
      const distance = Math.sqrt((hero.x - x) ** 2 + (hero.y - y) ** 2);
      if (distance < hero.radius) {
        selectedHero = hero;
      }
    });
    this.selectedHero = selectedHero;
    return selectedHero;
  }

  updateSettings(settings) {
    if (this.selectedHero) {
      this.selectedHero.bulletColor = settings.bulletColor;
      this.selectedHero.fireRate = parseInt(settings.fireRate, 10);
      this.selectedHero.speed = parseInt(settings.speed, 10);
    }
  }
}

export default GameController;