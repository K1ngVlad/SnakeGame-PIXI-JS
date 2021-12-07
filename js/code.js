const body = document.body;

const container = document.createElement('div');
container.classList.add('container');
body.appendChild(container);

const app = new PIXI.Application( {
    width: 600,
    height:600,
    backgroundColor: 0x14bddb
})

container.appendChild(app.view);

// const spriteContainer = new PIXI.Container();
// app.stage.addChild(spriteContainer);

// const texture = PIXI.Texture.from('img/cat-pass.gif');

// const sprite = new PIXI.Sprite(texture);
// sprite.anchor.set(0.5);
// spriteContainer.addChild(sprite);

// spriteContainer.x = app.screen.width / 2;
// spriteContainer.y = app.screen.height / 2;

// app.ticker.add(() => {
//     spriteContainer.rotation -= 0.01
// })

let cat,
box,
arrBox;

PIXI.Loader.shared
.add('img/cat-pass.gif')
.load(setup);


function setup() {
// box = new PIXI.Graphics();

// box.beginFill(0xccff99);
// box.drawRect(0, 0, 64, 64);
// box.endFill();
// box.x = 500;
// box.y = 500;
// app.stage.addChild(box);

arrBox = [];

for(let x = 0; x < 12; x++) {
    for(let y = 0; y < 12; y++) {
        let box = [];
        let sprite = new PIXI.Graphics();
        let hit = false;

        sprite.beginFill(0xccff99);
        sprite.drawRect(0, 0, 48, 48);
        sprite.endFill();
        sprite.x = x * 50;
        sprite.y = y * 50;

        box.push(sprite);
        box.push(hit);
        arrBox.push(box);

        app.stage.addChild(sprite);
    }
}

cat = new PIXI.Sprite(PIXI.Loader.shared.resources['img/cat-pass.gif'].texture);
cat.vx = 0;
cat.vy = 0;
cat.scale.set(0.5, 0.5);
app.stage.addChild(cat);

let left = keyboard("ArrowLeft"),
up = keyboard("ArrowUp"),
right = keyboard("ArrowRight"),
down = keyboard("ArrowDown");

left.press = () => {
    //Change the cat's velocity when the key is pressed
    cat.vx = -5;
    cat.vy = 0;
  };

left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Up
  up.press = () => {
    cat.vy = -5;
    cat.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  //Right
  right.press = () => {
    cat.vx = 5;
    cat.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Down
  down.press = () => {
    cat.vy = 5;
    cat.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  state = play;
 
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));

}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    // console.log(cat.vx);
    // console.log(cat.vy);
    //Use the cat's velocity to make it move
    cat.x += cat.vx;
    cat.y += cat.vy

    hitTestRectangle(cat, arrBox);
        arrBox.forEach(e => { 
            // console.log(e[1]);
        if(e[1]) e[0].tint = 0xff3300;
        else e[0].tint = 0xccff99 });
      
  }

  function hitTestRectangle(r1, arr) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;

    arr.forEach(r2 => {
        // console.log(r2);
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2[0].centerX = r2[0].x + r2[0].width / 2;
        r2[0].centerY = r2[0].y + r2[0].height / 2;
      
        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2[0].halfWidth = r2[0].width / 2;
        r2[0].halfHeight = r2[0].height / 2;
      
        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2[0].centerX;
        vy = r1.centerY - r2[0].centerY;
      
        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2[0].halfWidth;
        combinedHalfHeights = r1.halfHeight + r2[0].halfHeight;
      
        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
      
          //A collision might be occurring. Check for a collision on the y axis
          if (Math.abs(vy) < combinedHalfHeights) {
      
            //There's definitely a collision happening
            // console.log('вау');
            r2[1] = true;
            hit = true;
          } else {
      
            //There's no collision on the y axis
            r2[1] = false;
            hit = false;
          }
        } else {
      
          //There's no collision on the x axis
          r2[1] = false;
          hit = false;
        }
    })
    
    return hit;
  };

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }