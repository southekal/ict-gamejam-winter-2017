
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('bullet', 'static/img/intro/tacosprite.png', 32, 32);
    game.load.image('taco', 'static/img/intro/taco.png');
    game.load.image('brick', 'static/img/intro/brick.png');
    game.load.image('singlebrick', 'static/img/intro/single_brick.png');
    game.load.image('ship', 'static/img/intro/ship.png');
    game.load.spritesheet('kaboom', 'static/img/intro/explode.png', 128, 128);
    game.load.image('starfield', 'static/img/intro/background.png');
    game.load.spritesheet('dude', "static/img/intro/enrique_sprite.png", 72, 80);
    game.load.spritesheet('donald', "static/img/intro/donald_sprite_2.png", 80, 75);
    game.load.image('pillar', 'static/img/intro/pillar.png');
    game.load.image('ground', "static/img/intro/border.png");
    game.load.image('nav', "static/img/intro/nav.png");
    game.load.image('mexicoBorder', "static/img/intro/border.png");
    game.load.image('usBorder', "static/img/intro/border.png");
}

var player;
var aliens;
var bullets;
var platforms;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;

var scoreTaco = 0;
var scoreTacoString = '';
var scoreTacoText;

var scoreWall = 0;
var scoreWallString = '';
var scoreWallText;

var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    // starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    starfield = game.add.sprite(0, 0, 'starfield');

    platforms = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    // Set up ground section
    setupGround();

    // Set up ground section
    setupSky();

    // Create border 
    setupMexicoBorder();
    
    // Create border
    setupUsBorder();

    // Setup bullets
    createBullets();

    // Setup Brick bullets
    createBrickBullets();

    // Setup Enrique
    setupEnrique();

    // Setup The Donald
    setupDonald();
    
    // Create bricks section in the middle
    createBricks();

    // Setup initial single taco showing up randomly
    setupTacos();

    // Setup initial single bricks showing up randomly
    setupDonaldBricks();

   
    // //  Lives
    // lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });


    // Taco Counter
    tacoCounter = game.add.group();
    scoreTacoString = 'Tacos : ';
    scoreTacoText = game.add.text(game.world.width - 150, 10, scoreTacoString + scoreTaco, { font: '34px Arial', fill: '#fff' });

    // Donald Brick Counter
    wallCounter = game.add.group();
    scoreWallString = 'Bricks : ';
    scoreWallText = game.add.text(10, 10, scoreWallString + scoreWall, { font: '34px Arial', fill: '#fff' });


    //  Text to display win/lose
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    // Make screen go full size
    //game.input.onDown.add(goFullscreen, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    fireBrick = game.input.keyboard.addKey(Phaser.Keyboard.TAB)
    
}


function update() {

    game.physics.arcade.collide(bricks, player);
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(tacos, platforms);
    game.physics.arcade.collide(donald, player);
    game.physics.arcade.collide(donald, platforms);

    
    // *********************************************************************************************************
    // PLAYER 1 SETTINGS
    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown){
        player.body.velocity.x = -300;
        player.animations.play('left');
    } else if (cursors.right.isDown){
        player.body.velocity.x = 300;
        player.animations.play('right');
    } else{
        //  Stand still
        player.animations.stop();
        // player.frame = 4;
    }

    if (cursors.up.isDown){
        player.body.velocity.y = -300;
        player.animations.play('up');
    } else if (cursors.down.isDown){
        player.body.velocity.y = 300;
        player.animations.play('down');
    }

    //  Firing
    if (fireButton.isDown)
    {
        // checks for spacebar keyboard event
        game.input.keyboard.onDownCallback = function() {
            // SPACEBAR keycode is 32
            if (game.input.keyboard.event.keyCode == 32){
                fireBullet(scoreTaco);
            }
        };
    }
    // *********************************************************************************************************

    // *********************************************************************************************************
    // PLAYER 2 SETTINGS

    donald.body.velocity.setTo(0, 0);

    if (a.isDown){
        donald.body.velocity.x = -300;
        donald.animations.play('dleft');
    } else if (d.isDown){
        donald.body.velocity.x = 300;
        donald.animations.play('dright');
    } else{
        //  Stand still
        donald.animations.stop();
        // donald.frame = 4;
    }

    if (w.isDown){
        donald.body.velocity.y = -300;
        donald.animations.play('dup');
    } else if (s.isDown){
        donald.body.velocity.y = 300;
        donald.animations.play('ddown');
    }

    if (fireBrick.isDown){
        // checks for spacebar keyboard event
        game.input.keyboard.onDownCallback = function() {
            // TAB keycode is 9
            if (game.input.keyboard.event.keyCode == 9){
                fireBrickBullet(scoreWall);
            }
        };
    }


    // *********************************************************************************************************

    //  Run collision
    game.physics.arcade.overlap(bullets, bricks, collisionHandler, null, this);
    //  Checks to see if the player overlaps with any of the tacos, if he does call the collectTacos function
    game.physics.arcade.overlap(player, tacos, collectTacos, null, this);
    

    game.physics.arcade.overlap(brick_bullets, bricks, collisionBrickHandler, null, this);
    // game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

    //  Checks to see if donald overlaps with any of the bricks, if he does call the collectBricks function
    game.physics.arcade.overlap(donald, dbricks, collectBricks, null, this);

}


function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function createBricks () {
    //  The baddies!
    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;
    
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 9; x++)
        {
            var brick = bricks.create(x * 88, y * 25, 'brick');
            brick.anchor.setTo(1.1, -5);
            brick.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            brick.play('fly');
            brick.body.moves = false;
        }
    }

    bricks.x = 100;
    bricks.y = 150;
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function collisionHandler (bullet, brick) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    brick.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(brick.body.x, brick.body.y);
    explosion.play('kaboom', 30, false, true);

    if (bricks.countLiving() == 0)
    {

        stateText.text = "Enrique! You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function collisionBrickHandler (brick_bullet, brick) {

    brick_bullet.kill();
    brick.kill();

    // var brick = bricks.create(88, 25, 'brick');
    // brick.anchor.setTo(1.1, -5);
    // brick.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
    // brick.play('fly');
    // brick.body.moves = false;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(brick.body.x, brick.body.y);
    explosion.play('kaboom', 30, false, true);

    if (bricks.countLiving() == 0)
    {

        stateText.text = "Donald! You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}


function fireBullet (scoreTaco) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (scoreTaco > 0 && game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);
        if (bullet) {
            bullet.animations.play("spin");
            decreaseTacoCounter(scoreTaco);
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }   
    }

}

function resetBullet (bullet) {
    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function fireBrickBullet (scoreWall) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (scoreWall > 0 && game.time.now > bulletTime) {
        brick_bullet = brick_bullets.getFirstExists(false);
        if (brick_bullet) {
            // brick_bullet.animations.play("fin");
            decreaseBrickCounter(scoreWall);
            //  And fire it
            brick_bullet.reset(donald.x + 8, donald.y + 100);
            brick_bullet.body.velocity.y = 400;
            bulletTime = game.time.now + 200;
        }   
    }

}

function resetBrickBullet (brick_bullet) {
    //  Called if the bullet goes out of the screen
    brick_bullet.kill();

}


function restart () {
    //  A new level starts
    //resets the life count
    // lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    bricks.removeAll();
    createBricks();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;
    scoreTaco = 0;
    setupTacos();
    location.reload();

}

function createBullets () {
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('angle', 90)
    bullets.setAll('anchor.x', 1);
    bullets.setAll('anchor.y', 0.2);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.forEach(function (b) {
        b.animations.add('spin', [0,1,2,3,4,5,6,7], 21, true);
    })
}

function createBrickBullets () {
    //  Our bullet group
    brick_bullets = game.add.group();
    brick_bullets.enableBody = true;
    brick_bullets.physicsBodyType = Phaser.Physics.ARCADE;
    brick_bullets.createMultiple(30, 'brick');
    brick_bullets.setAll('angle', 90)
    brick_bullets.setAll('anchor.x', 1);
    brick_bullets.setAll('anchor.y', 0.2);
    brick_bullets.setAll('outOfBoundsKill', true);
    brick_bullets.setAll('checkWorldBounds', true);
    // brick_bullets.forEach(function (b) {
    //     b.animations.add('spin', [0,1,2,3,4,5,6,7], 21, true);
    // })
}

function setupEnrique () {
    //Custom hero!
    // The player and its settings
    player = game.add.sprite(100, game.world.height - 50, 'dude');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.allowGravity = false;
    player.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('right', [0, 1, 2], 10, true);
    player.animations.add('down', [0, 1, 2], 10, true);
    player.animations.add('up', [3, 4, 5], 10, true);
    player.anchor.set(0.5, 0.5)
}

function setupDonald () {
    donald = game.add.sprite(60, game.world.height - 520, 'donald');
    //  We need to enable physics on the player
    game.physics.arcade.enable(donald);
    donald.body.bounce.y = 0.2;
    donald.body.gravity.y = 300;
    donald.body.allowGravity = false;
    donald.body.collideWorldBounds = true;
    donald.animations.add('dleft', [0, 1, 2], 10, true);
    donald.animations.add('dright', [0, 1, 2], 10, true);
    donald.animations.add('ddown', [0, 1, 2], 10, true);
    donald.animations.add('dup', [3, 4, 5], 10, true);
    donald.anchor.set(0.5, 0.5)
}

function setupTacos() {
    //  Finally some stars to collect
    tacos = game.add.group();
    //  We will enable physics for any star that is created in this group
    tacos.enableBody = true;
    tacos.setAll('checkWorldBounds', true);
    
    var taco = tacos.create(getRandomInt(0, 700), getRandomInt(400, 500), 'taco');

    // for (var i = 0; i < 12; i++)
    // {
    //     //  Create a star inside of the 'stars' group
    //     var taco = tacos.create(i * 70, 0, 'taco');
    //     //  Let gravity do its thing
    //     taco.body.gravity.y = 400;
    //     //  This just gives each star a slightly random bounce value
    //     taco.body.bounce.y = 0.7 + Math.random() * 0.2;
    // }
}

function setupDonaldBricks() {
    //  Finally some stars to collect
    dbricks = game.add.group();
    //  We will enable physics for any star that is created in this group
    dbricks.enableBody = true;
    dbricks.setAll('checkWorldBounds', true);
    
    var dbrick = dbricks.create(getRandomInt(0, 700), getRandomInt(100, 200), 'singlebrick');
}


function getRandomInt(min, max){   
    min = Math.ceil(min);
    max = Math.floor(max);
    // return Math.floor((Math.random()*100)+1); 
    return Math.floor(Math.random() * (max - min)) + min;
 }


function setupGround() {
   // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 10, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(1, 1);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
}

function setupSky() {
   // Here we create the ground.
    var sky = platforms.create(game.world.height-600, 0, 'nav');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    sky.scale.setTo(1, 1);
    //  This stops it from falling away when you jump on it
    sky.body.immovable = true;
}

function setupMexicoBorder() {
   // Here we create the ground.
    var boundary = platforms.create(0, game.world.height - 200, 'mexicoBorder');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    boundary.scale.setTo(1, 1);
    //  This stops it from falling away when you jump on it
    boundary.body.immovable = true;
}

function setupUsBorder() {
   // Here we create the ground.
    var boundary = platforms.create(0, game.world.height - 350, 'usBorder');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    boundary.scale.setTo(1, 1);
    //  This stops it from falling away when you jump on it
    boundary.body.immovable = true;
}

function collectTacos (player, taco) {
    // Removes the star from the screen
    taco.kill();    
    updateTacoCounter();
    var taco = tacos.create(getRandomInt(0, 700), getRandomInt(400, 500), 'taco');
}

function collectBricks (donald, dbrick) {
    // Removes the star from the screen
    dbrick.kill();    
    updateBrickCounter();
    var dbrick = dbricks.create(getRandomInt(0, 700), getRandomInt(100, 200), 'singlebrick');
}

function updateTacoCounter() {
    //  Increase the score
    scoreTaco += 1;
    scoreTacoText.text = scoreTacoString + scoreTaco;
    // updateTacoDisplay(scoreTaco);
}

function decreaseTacoCounter() {
    //  Increase the score
    scoreTaco -= 1;
    scoreTacoText.text = scoreTacoString + scoreTaco;
    // updateTacoDisplay(scoreTaco);
}

function updateBrickCounter() {
    //  Increase the score
    scoreWall += 1;
    scoreWallText.text = scoreWallString + scoreWall;
}

function decreaseBrickCounter() {
    //  Decrease the score
    scoreWall -= 1;
    scoreWallText.text = scoreWallString + scoreWall;
}

function updateTacoDisplay(scoreTaco) {
    for (var i = 0; i < scoreTaco; i++) 
    {
        var ship = tacoCounter.create(game.world.width - 300 + (30 * i), 60, 'taco');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }
}

function goFullscreen() {
    game.scale.fullScreenScale = Phaser.ScaleManager.SHOW_ALL;
    game.scale.startFullScreen();
}