const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲームの状態
const gameState = {
    isRunning: false,
    isGameOver: false,
    isGameClear: false,
    score: 0
};

// プレイヤー設定
const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    color: '#FF4500',
    vx: 0,
    vy: 0,
    speed: 5,
    jumpPower: -12,
    gravity: 0.6,
    isGrounded: false
};

// 入力管理
const keys = {
    right: false,
    left: false,
    up: false
};

// マップデータ (1: 地面, 0: 空, 2: ゴール, 3: 危険地帯)
// 簡易的なマップ生成
const tileSize = 50;
const map = [];
const mapWidth = 100; // タイル数
const mapHeight = 9;  // 450 / 50

function initMap() {
    // 全て空で初期化
    for (let y = 0; y < mapHeight; y++) {
        map[y] = [];
        for (let x = 0; x < mapWidth; x++) {
            map[y][x] = 0;
        }
    }

    // 地面を作成
    for (let x = 0; x < mapWidth; x++) {
        // 基本的に一番下は地面
        if (x < 10 || x > mapWidth - 10) {
            map[mapHeight - 1][x] = 1;
        } else {
            // ランダムに穴をあける
            if (Math.random() > 0.2) {
                map[mapHeight - 1][x] = 1;
                // 時々段差を作る
                if (Math.random() > 0.8) {
                    map[mapHeight - 2][x] = 1;
                }
            }
        }
    }

    // ゴール
    map[mapHeight - 2][mapWidth - 2] = 2;
}

// イベントリスナー
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'Space') {
        if (!gameState.isRunning && !gameState.isGameOver && !gameState.isGameClear) {
            startGame();
        } else if (gameState.isGameOver || gameState.isGameClear) {
            resetGame();
        } else {
            keys.up = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'Space') keys.up = false;
});

function startGame() {
    gameState.isRunning = true;
    document.getElementById('message').classList.add('hidden');
    gameLoop();
}

function resetGame() {
    player.x = 50;
    player.y = 200;
    player.vx = 0;
    player.vy = 0;
    gameState.isGameOver = false;
    gameState.isGameClear = false;
    gameState.score = 0;
    initMap();
    startGame();
}

function update() {
    if (!gameState.isRunning) return;

    // 横移動
    if (keys.right) player.vx = player.speed;
    else if (keys.left) player.vx = -player.speed;
    else player.vx = 0;

    // ジャンプ
    if (keys.up && player.isGrounded) {
        player.vy = player.jumpPower;
        player.isGrounded = false;
    }

    // 重力
    player.vy += player.gravity;

    // 位置更新
    player.x += player.vx;
    player.y += player.vy;

    // 当たり判定（簡易）
    checkCollisions();

    // 画面外落下判定
    if (player.y > canvas.height) {
        gameOver();
    }
}

function checkCollisions() {
    player.isGrounded = false;

    // マップとの当たり判定
    // プレイヤーの四隅のタイル座標を取得
    const left = Math.floor(player.x / tileSize);
    const right = Math.floor((player.x + player.width - 0.1) / tileSize);
    const top = Math.floor(player.y / tileSize);
    const bottom = Math.floor((player.y + player.height - 0.1) / tileSize);

    // 床判定（下方向）
    if (player.vy >= 0) { // 落下中または静止中
        // 足元のタイルを確認
        // プレイヤーの下端がタイル境界をまたいでいるかチェック
        const bottomY = player.y + player.height;
        const tileBottom = Math.floor(bottomY / tileSize);

        // プレイヤーの下端がタイルの上端を超えているか
        // かつ、そのタイルが壁(1)であるか
        if (tileBottom < mapHeight && tileBottom >= 0) {
            if ((map[tileBottom][left] === 1 || map[tileBottom][right] === 1)) {
                // 衝突位置補正
                const tileTopY = tileBottom * tileSize;
                if (bottomY >= tileTopY && (bottomY - player.vy) <= tileTopY + 10) { // +10はめり込み許容範囲
                    player.y = tileTopY - player.height;
                    player.vy = 0;
                    player.isGrounded = true;
                }
            }
            // ゴール判定
            if (map[tileBottom][left] === 2 || map[tileBottom][right] === 2) {
                gameClear();
            }
        }
    }

    // 壁判定（横方向）などは今回は簡易化のため省略または必要に応じて追加
    // 左端制限
    if (player.x < 0) player.x = 0;
}

function gameOver() {
    gameState.isRunning = false;
    gameState.isGameOver = true;
    const msg = document.getElementById('message');
    msg.innerText = "GAME OVER\nPress Space to Retry";
    msg.classList.remove('hidden');
}

function gameClear() {
    gameState.isRunning = false;
    gameState.isGameClear = true;
    const msg = document.getElementById('message');
    msg.innerText = "GAME CLEAR!\nPress Space to Retry";
    msg.classList.remove('hidden');
}

// カメラ位置（スクロール用）
let cameraX = 0;

function draw() {
    // 背景クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // カメラ位置更新（プレイヤーを中心に）
    cameraX = player.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > mapWidth * tileSize - canvas.width) cameraX = mapWidth * tileSize - canvas.width;

    ctx.save();
    ctx.translate(-cameraX, 0);

    // マップ描画
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tile = map[y][x];
            if (tile === 1) {
                ctx.fillStyle = '#654321'; // 地面の色
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                // 草
                ctx.fillStyle = '#228B22';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, 5);
            } else if (tile === 2) {
                ctx.fillStyle = '#FFD700'; // ゴール
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // プレイヤー描画
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.restore();
}

function gameLoop() {
    if (gameState.isRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// 初期化
initMap();
draw();

