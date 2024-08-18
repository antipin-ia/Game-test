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
      { x: 50, y: 100, radius: 30, color: 'red', dy: 2, bulletColor: '#ff0000', fireRate: 500, speed: 1, hits: 0 },
      { x: canvas.width - 50, y: 100, radius: 30, color: 'blue', dy: 2, bulletColor: '#0000ff', fireRate: 500, speed: 1, hits: 0 }
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
  
    // Обновление состояния героев
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
          color: hero.bulletColor,
          hit: false,
          shooter: hero.color
        });
        this.lastFireTime[hero.color] = currentTime;
      }
    });
  
    // Обновление снарядов
    this.bullets = this.bullets.filter(bullet => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;
  
      // Удаление снаряда, если он вышел за границы поля
      if (bullet.x < 0 || bullet.x > this.canvas.width) {
        return false; // Удаляем снаряд
      }
  
      // Проверка столкновения с героями
      let bulletHit = false;
      this.heroes.forEach(hero => {
        if (bullet.shooter !== hero.color) { // Проверяем, что снаряд выстрелил другой герой
          const distance = Math.sqrt((bullet.x - hero.x) ** 2 + (bullet.y - hero.y) ** 2);
          if (!bullet.hit && distance < hero.radius + bullet.radius && bullet.color !== hero.color) {
            hero.hits++;
            bulletHit = true; // Устанавливаем флаг попадания
          }
        }
      });
  
      // Если снаряд попал в героя, он должен быть удален
      return !bulletHit;
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
  
    // Сохранение выбранного героя
    if (selectedHero) {
      this.selectedHero = selectedHero;
      console.log('Hero selected:', JSON.stringify(selectedHero, null, 2));
    } else {
      console.log('No hero selected on click');
    }
  
    return selectedHero;
  }

  updateSettings(settings) {
    if (this.selectedHero) {
      // Убедимся, что цвет всегда в формате #rrggbb
      const colorRegex = /^#[0-9A-F]{6}$/i;
      if (colorRegex.test(settings.bulletColor)) {
        this.selectedHero.bulletColor = settings.bulletColor;
      } else {
        console.warn('Invalid color format:', settings.bulletColor);
      }
  
      this.selectedHero.fireRate = parseInt(settings.fireRate, 10);
      this.selectedHero.speed = parseInt(settings.speed, 10);
  
    } else {
      console.log('No hero selected!');
    }
  }
}

export default GameController;
