var game = new Phaser.Game(800, 800, Phaser.AUTO, 'snake', { preload: preload, create: create, update: update });
var snake;
var snake_body = new Array(); 
var snake_path;
var snake_space = 1;
var score = 0
var star;
var cursors;
var game_over;

function spawn_star() {
    min = 1;
    max = 770;
    x = Math.floor(Math.random() * ((max-min)+1) + min);
    y = Math.floor(Math.random() * ((max-min)+1) + min);
    
    star.reset(x, y);
}

function init_body() {
    snake_body = game.add.group();
    snake_body.enableBody = true;
    snake_path = new Array();
    for (var i = 0; i <= snake_space; i++) {
        snake_path[i] = new Phaser.Point(snake.x, snake.y);
    }
}

function grow_snake() {
    var segment = snake_body.create(snake.x, snake.y, 'snake');
    segment.anchor.setTo(0.5, 0.5);
    j = score*snake_space
    for (var i = j; i <= j + snake_space; i++) {
        snake_path[i] = new Phaser.Point(snake.x, snake.y);
    }
}

function collect_star(snake, star) {
    // Remove star and spawn another
    star.kill()
    spawn_star();
    
    for (var i = 1; i <= 10; i++ ) {
        score += 1;
        grow_snake();
    }
}

function kill_snake() {
    snake.kill();
}

function restart() {
    game_over.text = '';
    snake.reset(400,400);
    init_body();
    spawn_star();
    game_running = true;
    score = 0;
}

function preload() {
    game.load.image('snake', 'assets/snake.png');
    game.load.image('star', 'assets/star.png');
}

function create() {
    // Set the background color
    game.stage.backgroundColor = '#00FFFF';
    
    // Let there be physics!
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Create Snake
    snake = game.add.sprite(400, 400, 'snake');
    snake.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(snake);
    snake.checkWorldBounds = true;
    snake.outOfBoundsKill = true;
    

    // Init snake, path, and body
    init_body();
    
    //Spawn star
    star = game.add.sprite(0, 0, 'star')
    game.physics.arcade.enable(star);
    star.body.setSize(22, 20, 0, 0);
    spawn_star();

    
    cursors = game.input.keyboard.createCursorKeys();

    // Text
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    game_over = game.add.text(game.world.centerX, game.world.centerY, '', style);
    game_over.anchor.setTo(0.5, 0.5);
    game_over.inputEnabled = true;
    game_over.events.onInputDown.add(restart, this);
}

function update() {
    game.physics.arcade.overlap(snake, star, collect_star, null, this);
    game.physics.arcade.collide(snake, snake_body, kill_snake, null, this);
    
    if (!snake.alive) {
        star.kill();
        snake_body.callAll('kill');
        
        game_over.text = "Game Over!\nClick to restart";
        snake.alive = true;
    } 
    
    if (snake_path.length > 0) {
        var part = snake_path.pop();
        part.setTo(snake.x, snake.y);
        snake_path.unshift(part);

        for (var i = 0; i < snake_body.length; i++)
        {
            snake_body.xy(i, (snake_path[i * snake_space]).x, (snake_path[i * snake_space]).y);
        }
    }
        
    if (cursors.left.isDown && snake.body.velocity.x != 150) {
        snake.body.velocity.x = -150;
        snake.body.velocity.y = 0;
    } else if (cursors.right.isDown && snake.body.velocity.x != -150) {
        snake.body.velocity.x = 150;
        snake.body.velocity.y = 0;
    } else if (cursors.up.isDown && snake.body.velocity.y != 150) {
        snake.body.velocity.y = -150;
        snake.body.velocity.x = 0;
    } else if (cursors.down.isDown && snake.body.velocity.y != -150) {
        snake.body.velocity.y = 150;
        snake.body.velocity.x = 0;
    }     
}