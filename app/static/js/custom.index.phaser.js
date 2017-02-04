window.onload = function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
        {   preload: preload,
            create: create,
            update: update,
            render: render
        }
    );

    function preload () {

        game.load.image('logo', 'static/img/phaser.png');
        game.load.image('sky', "static/img/intro/sky.png");
        game.load.image('ground', "static/img/intro/platform.png");
        game.load.image('star', "static/img/intro/star.png");
        game.load.image('bullet', "static/img/intro/bullet.png");
        game.load.spritesheet('dude', "static/img/intro/dude.png", 32, 48);

    }

    var player;
    var platforms;
    var cursors;
    var stars;

    var score = 0;
    var scoreText;
    var scoreTime;
    var today = new Date();

    var weapon;
    var fireButton;

    var weaponCounter = 0;
    var weaponCounterText;

    function create () {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        // Set up ground section
        setupGround();
        // Set up the ledges
        setupLedge();
        // Set up the player
        setupPlayer();
        // Creates random stars
        setupStars();
        //  The score
        scoreText = game.add.text(16, 16, 'Score Mofo: 0', { fontSize: '32px', fill: '#000' });
        //  The score
        weaponCounterText = game.add.text(16, 52, 'Weapon Mofo: 0', { fontSize: '32px', fill: '#000' });
        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        // Create weapon and attach it to player
        createWeaponTracker();
        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        // Function to go full screen
        //game.input.onDown.add(goFullscreen, this);
    }

    function update() {

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }

        if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 200;
        }


        if (fireButton.isDown)
        {
            // checks for spacebar keyboard event
            game.input.keyboard.onDownCallback = function() {
                if (game.input.keyboard.event.keyCode == 32){
                    checkFireButton(weaponCounter);
                }
            };
        }

        // This will take the given game object and check if its x/y coordinates fall outside of the world bounds.
        game.world.wrap(player, 16);

    }

    function render() {
        weapon.debug();
    }

//*********************************************************************************************************************
//    CUSTOM FUNCTIONS

    function setupGround() {
       // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
    }

    function setupLedge() {
        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');

        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;
    }

    function setupPlayer() {
        // The player and its settings
        player = game.add.sprite(60, game.world.height - 88, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.allowGravity = false;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        player.anchor.set(0.5)

    }

    function setupStars() {
        //  Finally some stars to collect
        stars = game.add.group();
        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;
        //  Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');
            //  Let gravity do its thing
            star.body.gravity.y = 600;
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    }

    function createWeaponTracker() {
             //  Creates 30 bullets, using the 'bullet' graphic
        weapon = game.add.weapon(30, 'bullet');
        //  The bullet will be automatically killed when it leaves the world bounds
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        weapon.bulletAngleOffset = 90;
        //  The speed at which the bullet is fired
        weapon.bulletSpeed = 400;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.fireRate = 60;
        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        weapon.trackSprite(player, 0, 0);
    }

    function checkFireButton(val) {
        if (val > 0) {
            weapon.fire();
            weaponCounter -= 1;
            updateWeaponCounter(weaponCounter);
        }
    }

    function updateWeaponCounter(val){
        weaponCounterText.text = 'Weapons Mofo: ' + val;
    }


    function collectStar (player, star) {
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score Mofo: ' + score;

        weaponCounter += 1;
        updateWeaponCounter(weaponCounter);
    }

    function goFullscreen() {
        game.scale.fullScreenScale = Phaser.ScaleManager.SHOW_ALL;
        game.scale.startFullScreen();
    }

//*********************************************************************************************************************

};
