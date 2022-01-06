console.log('Страница запущенна');

const body = document.body;

let head,
  arrBody,
  state,
  food,
  route,
  time,
  map,
  level = 1,
  exp,
  speed,
  score = 0;

console.log('Создание контейнеров');
body.appendChild(
  createDiv('main-container', [
    createDiv('corner', [
      createDiv('lower', []),
      createDiv('higer', [
        createImg('snake', 'img/snake.png', 'Картинка змеи'),
      ]),
      createDiv('lower', []),
    ]),
    createDiv('center', [
      createDiv('lower', [createText('high-text', 'Змейка')]),
      createDiv('higer', []),
      createDiv('lower', []),
    ]),
    createDiv('corner', [
      createDiv('lower', []),
      createDiv('stats', [
        createText('lvl-text', 'Уровень: ' + level),
        createText('score-text', 'Счёт: ' + score),
      ]),
      createDiv('lower', []),
    ]),
  ])
);

////////////////////////////Проверка поддержки браузера WebGL
let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

/////////////////////////////Использование альтернативных имён
const sprite = PIXI.Sprite,
  app = PIXI.Application,
  loader = PIXI.Loader.shared,
  res = PIXI.Loader.shared.resources,
  render = PIXI.Application,
  retex = PIXI.utils.TextureCache,
  container = PIXI.Container,
  partContainer = PIXI.ParticleContainer,
  graphics = PIXI.Graphics,
  text = PIXI.Text,
  sty = PIXI.TextStyle;
//hit = PIXI.hitTestRectangle;

const game = new app({
  width: 640,
  height: 640,
  backgroundColor: 0x708090,
});

document
  .querySelector('.center')
  .querySelector('.higer')
  .appendChild(game.view);

////////////////////////////Объявление объектов
// let head,
// arrBody,
// state,
// food,
// route,
// time,
// map,
// level,
// exp,
// speed

////////////////////////////Загрузка изображений
console.log('Загрузка ресурсов...');
loader.add({ name: 'catImg', url: 'img/cat-pass.gif' }).load(setup);

function setup() {
  route = 'up';
  level = 1;
  score = 0;
  exp = 0;
  speed = 8;

  map = [];

  for (let x = 0; x < 20; x++) {
    let arr = [];
    for (let y = 0; y < 20; y++) {
      let arr2 = [x * 32, y * 32];
      arr.push(arr2);
    }
    map.push(arr);
  }

  head = drawSprite(0x00ff00, 32, 32, 320, 320);
  game.stage.addChild(head);

  arrBody = [];

  arrBody[0] = drawSprite(0x32cd32, 32, 32, 320, 352);
  game.stage.addChild(arrBody[0]);

  arrBody[1] = drawSprite(0x32cd32, 32, 32, 320, 384);
  game.stage.addChild(arrBody[1]);

  let cell = findCell(map);

  food = drawSprite(0xffffff, 32, 32, cell[0], cell[1]);
  game.stage.addChild(food);

  let left = keyboard('ArrowLeft'),
    up = keyboard('ArrowUp'),
    right = keyboard('ArrowRight'),
    down = keyboard('ArrowDown'),
    space = keyboard(' ');

  left.press = () => {
    if (route != 'right') {
      route = 'left';
    }
  };
  up.press = () => {
    if (route != 'down') {
      route = 'up';
    }
  };
  right.press = () => {
    if (route != 'left') {
      route = 'right';
    }
  };
  down.press = () => {
    if (route != 'up') {
      route = 'down';
    }
  };

  win('Самая лучшая змейка!', 'Начать!');
  console.log('SETUP COMPLETE!');

  state = stop;

  space.release = () => {
    win('Вы поставили игру на паузу', 'Продолжить');
  };

  ////////////////////////////Обновление игры на каждый тик
  game.ticker.add((delta) => gameLoop(delta));

  // body.appendChild(createDiv('table', [
  //   createText('table-text', 'Самая лучшая змейка!'),
  //   createBtn('table-btn', 'Начать!', win)
  // ]))
}

function win(text, btn) {
  if (state === stop) {
    body.removeChild(document.querySelector('.table'));
    state = play;
  } else {
    state = stop;
    body.appendChild(
      createDiv('table', [
        createText('table-text', text),
        createBtn('table-btn', btn, win),
      ])
    );
  }
}

function gameLoop(delta) {
  state(delta);
}

function stop(delta) {
  time = 0;
}

function findCell(map) {
  let clear = clearMap(map);

  let x = clear[ranNum(clear.length - 1)];
  return x[ranNum(x.length - 1)];
}

function ranNum(x) {
  return Math.round(Math.random() * x);
}

function clearMap(map) {
  copy = map.slice();

  copy.forEach((e) => {
    let bool = false;
    e.forEach((first, i) => {
      arrBody.forEach((second) => {
        if (first[0] === second.x && first[1] === second.y) {
          bool = true;
        }
      });
      if (bool) {
        e.splice(i, 1);
      }
    });
  });

  return copy;
}

function play(delta) {
  time++;

  // console.log(time);
  // console.log(speed);
  if (time >= speed) {
    time = 0;

    arrBody = arrBody.reverse();

    arrBody.forEach((e, i) => {
      if (i === arrBody.length - 1) {
        e.x = head.x;
        e.y = head.y;
      } else {
        e.x = arrBody[i + 1].x;
        e.y = arrBody[i + 1].y;
      }
    });

    switch (route) {
      case 'up':
        head.y -= 32;
        break;
      case 'down':
        head.y += 32;
        break;
      case 'left':
        head.x -= 32;
        break;
      case 'right':
        head.x += 32;
        break;
    }
    if (head.x < 0) {
      head.x = 608;
    }
    if (head.x > 608) {
      head.x = 0;
    }
    if (head.y < 0) {
      head.y = 608;
    }
    if (head.y > 608) {
      head.y = 0;
    }

    arrBody = arrBody.reverse();

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.querySelector('.score-text').textContent = 'Счёт: ' + score;
      exp++;
      let x, y;
      switch (route) {
        case 'up':
          x = arrBody[arrBody.length - 1].x;
          y = arrBody[arrBody.length - 1].y + 32;
          break;
        case 'down':
          x = arrBody[arrBody.length - 1].x;
          y = arrBody[arrBody.length - 1].y - 32;
          break;
        case 'left':
          x = arrBody[arrBody.length - 1].x + 32;
          y = arrBody[arrBody.length - 1].y;
          break;
        case 'right':
          x = arrBody[arrBody.length - 1].x - 32;
          y = arrBody[arrBody.length - 1].y;
          break;
      }
      if (exp === 5) {
        level++;
        document.querySelector('.lvl-text').textContent = 'Уровень: ' + level;
        exp = 0;
        switch (level) {
          case 1:
            speed = 7;
            break;
          case 2:
            speed = 6;
            break;
          case 3:
            speed = 5;
            break;
          case 4:
            speed = 4;
            break;
          case 5:
            speed = 3;
            break;
          case 6:
            speed = 2;
            break;
          default:
            speed = 1;
            break;
        }
      }
      arrBody[arrBody.length] = drawSprite(0x32cd32, 32, 32, x, y);
      game.stage.addChild(arrBody[arrBody.length - 1]);

      let cell = findCell(map);

      food.x = cell[0];
      food.y = cell[1];
    }
    let end = false;
    arrBody.forEach((e) => {
      if (end) {
        return;
      }
      if (head.x === e.x && head.y === e.y) {
        end = true;
      }
    });

    if (end) {
      arrBody.forEach((e) => {
        game.stage.removeChild(e);
      });
      game.stage.removeChild(head);
      game.stage.removeChild(food);

      route = 'up';
      document.querySelector('.score-text').textContent = 'Счёт: ' + score;
      level = 1;
      document.querySelector('.lvl-text').textContent = 'Уровень: ' + level;
      exp = 0;
      speed = 8;
      head = drawSprite(0x00ff00, 32, 32, 320, 320);
      game.stage.addChild(head);

      arrBody = [];

      arrBody[0] = drawSprite(0x32cd32, 32, 32, 320, 352);
      game.stage.addChild(arrBody[0]);

      arrBody[1] = drawSprite(0x32cd32, 32, 32, 320, 384);
      game.stage.addChild(arrBody[1]);

      let cell = findCell(map);

      food = drawSprite(0xffffff, 32, 32, cell[0], cell[1]);
      game.stage.addChild(food);
      win('Игра окончена', 'Перезапустить');
      score = 0;
    }
  }

  // arrBody.forEach((e, i) => {
  //     if(!i) {

  //     }
  //     else {
  //         // e.x = arrBody[i - 1];
  //         // e.y = arrBody[i - 1];
  //     }
  // })
}

function drawSprite(color, width, higth, x, y) {
  let sprite = new graphics();
  sprite.beginFill(color);
  sprite.drawRect(0, 0, width, higth);
  sprite.endFill();
  sprite.x = x; //1280
  sprite.y = y; //440

  return sprite;
  //   game.stage.addChild(sprite);
}

function createDiv(divClass, elems) {
  const div = document.createElement('div');

  div.classList.add('container');
  div.classList.add(divClass);

  elems.forEach((e) => div.appendChild(e));

  return div;
}

function createText(classP, text) {
  const p = document.createElement('p');

  p.classList.add(classP);
  p.textContent = text;

  return p;
}

function createBtn(classBtn, text, func) {
  const btn = document.createElement('btn');

  btn.classList.add(classBtn);
  btn.textContent = text;
  btn.addEventListener('click', func);

  return btn;
}

function createImg(classImg, src, alt) {
  const img = document.createElement('img');

  img.classList.add(classImg);
  img.setAttribute('src', src);
  img.setAttribute('alt', alt);

  return img;
}

function keyboard(value) {
  //Создание объекта для регестрирования событий клавиатуры
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //Клавиша нажата
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //Клавиша отпущена
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Создание регистрации события
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  //Присоединение события
  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  //Отсоединение события
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}
