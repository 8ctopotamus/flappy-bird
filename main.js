var game = new Phaser.Game(400, 400);

var mainState = {
  preload: function() {
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.audio('jump', 'assets/jump.wav');
  },
  create: function() {
    this.jumpSound = game.add.audio('jump');
    game.stage.backgroundColor = "#71c5cf";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bird = game.add.sprite(100, 245, 'bird');
    this.bird.anchor.setTo(-0.2, 0.5);

    this.pipes = game.add.group();

    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    //scoring
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#fff"});

  },
  update: function() {
    if(this.bird.angle < 20) this.bird.angle += 1;

    //restart if you go off-screen
    if( this.bird.y < 0 || this.bird.y > 490) this.restartGame();

    //restart if you hit pipe
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
  },
  jump: function() {
    if(this.bird.alive == false) return;

    this.bird.body.velocity.y = -350;
    // var animation = game.add.tween(this.bird);
    // animation.to({angle: -20}, 100);
    // animation.start();
    //shortened above
    game.add.tween(this.bird).to({angle: -20}, 100).start();

    this.jumpSound.play();
  },
  restartGame: function() {
    game.state.start('main');
  },
  addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');
    //add pipe to group created in create method
    this.pipes.add(pipe);
    game.physics.arcade.enable(pipe);
    //make pipe move left
    pipe.body.velocity.x = -200;
    //kill pipe when not visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    //randomly pick between 1 and 5, this will be the hole pos
    var hole = Math.floor(Math.random() * 5) + 1;
    //add the 6 pipes
    // with one big hole at position 'hole' and 'hole + 1'
    for(var i = 0; i < 8; i++) if (i != hole && i != hole + 1) this.addOnePipe(400, i * 60 + 10);

    //increase score
    this.score += 1;
    this.labelScore.text = this.score;

  },
  hitPipe: function() {
    //if bird has already hit a pope, do nothing
    // it means the bird is already falling off-screen
    if(this.bird.alive == false) return;

    //set alive property of bird to false
    this.bird.alive = false;

    //prevent new pipes from appearing
    game.time.events.remove(this.timer);

    //go through all pipes, stop movement
    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);
  }
};

game.state.add('main', mainState);
game.state.start('main');
