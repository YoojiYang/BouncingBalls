// 必要な要素を取得
const canvas = document.querySelector('canvas');
const p = document.querySelector('p');
const ctx = canvas.getContext('2d');

// 画面サイズの設定
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// ランダムな数字を生成する関数を作成
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// 色をランダムに変更させる関数を作成
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shapeというスーパークラスを作成
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// *******************************
// EvilCircleクラス
// *******************************
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }
  
  // ボールを書く 
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  };

  // 画面からはみ出ないようにする
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = width - this.size;
    }
    if ((this.x - this.size) <= 0) {
      this.x = this.size;
    }
    if ((this.y + this.size) >= height) {
      this.y = height - this.size;
    }
    if ((this.y - this.size) <= 0) {
      this.y = this.size;
    }
  };
  
  // ボールとの衝突判定と衝突した時の処理のメソッド
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCounts -= 1;
          p.textContent = "Ball count: " + ballCounts;
        }
      }
    }
  };
}


// *******************************
// Ball
// *******************************
class Ball extends Shape {
  // Ballクラスのプロパティを初期化 
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }
  // ボールを書く 
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // ボールが画面から飛び出ないようにする
  update() {
    // 画面の右端に辿り着いたら、左方向に動く
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
    // ボールが画面の左端に辿り着いたら、右方向に動く
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
    // ボールが画面の下にたどり着いたら、上方向に動く
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
    // ボールが画面の上にたどり着いたら、下方向に動く
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
    
    this.x += this.velX;
    this.y += this.velY;
  }
  
  // ボールが衝突したら色が変わって跳ね返るメソッドを追加
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && this.exists && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
          this.velY = -(this.velY);
          this.velX = -(this.velX);
        }
      }
    }
  }
  
}


const balls = [];
let ballCounts = 0;


// ボールの数が25個になるまで繰り返す
while (balls.length < 25) {
  // 大きさを10〜20の間に指定
  const size = random(10, 20);
  // Ballクラスからインスタンス化したBallオブジェクトを作成
  const ball = new Ball(
    // 描画エラーを避けるために、キャンバスの端からボールの幅分は離される
    random(0 + size, width - size), //出現位置の左右の位置
    random(0 + size, height - size), //出現位置の上下の位置
    random(-7, 7), // 左右方向へ進むスピードをランダムで設定
    random(-7, 7), // 上下方向へ進むスピードをランダムで設定
    randomRGB(), // ボールの色をランダムで設定
    size, // ボールの大きさを設定
    );
    
    // 作成したballオブジェクトをballs配列に追加
    balls.push(ball);
    ballCounts += 1;
    p.textCdontent = "Ball count: " + ballCounts;
  }

  const evilCircle = new EvilCircle(100, 100);

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, width, height);

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  // 全てのボールオブジェクトで、Ballクラスのメソッドを実行
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw(); // ボールの形を作成
      ball.update(); // ボールが画面から飛び出ないようにする
      ball.collisionDetect(); // ボールが衝突した時の処理
    }
  }

  // 自分の関数内で自分を呼び出す（＝再帰処理）によってアニメーションにする
  requestAnimationFrame(loop);

}

// ループ関数を実行
loop();

