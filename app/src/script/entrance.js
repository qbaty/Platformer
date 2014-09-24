define(function(require, exports, module) {

    var Platformer = require('platformer');
    var data = require('./data');

    var body = document.body;
    var pressedKeys = [];

    body.addEventListener('keydown', function(event) {
        pressedKeys[event.keyCode] = true;
    });
    body.addEventListener('keyup', function(event) {
        pressedKeys[event.keyCode] = false;
    });

    var platform = Platformer.Platform.instance();

    var skyCanvas = Platformer.Canvas.instance('sky');
    var floorCanvas = Platformer.Canvas.instance('floor');
    var backgroundCanvas = Platformer.Canvas.instance('background');
    var entityCanvas = Platformer.Canvas.instance('entity');
    var cloudCanvas = Platformer.Canvas.instance('cloud');
    var mainCanvas = Platformer.Canvas.instance('main');
    skyCanvas.minHeight = 480;
    floorCanvas.minHeight = 480;
    cloudCanvas.minHeight = 480;
    backgroundCanvas.minHeight = 480;
    entityCanvas.minHeight = 480;
    mainCanvas.minHeight = 480;

    platform.layout(function() {
        skyCanvas.width(window.innerWidth);
        skyCanvas.height(window.innerHeight);
        floorCanvas.width(window.innerWidth);
        floorCanvas.height(window.innerHeight);
        cloudCanvas.width(window.innerWidth);
        cloudCanvas.height(window.innerHeight);
        backgroundCanvas.width(window.innerWidth);
        backgroundCanvas.height(window.innerHeight);
        entityCanvas.width(window.innerWidth);
        entityCanvas.height(window.innerHeight);
        mainCanvas.width(window.innerWidth);
        mainCanvas.height(window.innerHeight);
    });

    var FLOOR_COLOR = '#906643';
    var SKY_COLOR = '#00b5f3';

    var recArtist = new Platformer.RecArtist();
    var sky = new Platformer.Sprite('Sky', recArtist, []);
    sky.color = SKY_COLOR;
    sky.width('100%');
    sky.height('100%');
    sky.drawTo(skyCanvas);

    var groveArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.grove);
    var grove = new Platformer.Sprite('Grove', groveArtist, []);
    grove.aspectRatio = 5782 / 525;
    grove.width('auto');
    grove.height('65%');
    grove.top('30.9%');
    grove.drawTo(backgroundCanvas);

    var floorBehavior = new Platformer.TimeBehavior({
        start: {top: "100%"},
        end: {top: "88%"},
        duration: 1000,
        decorate: "start",
        easing: Platformer.AnimationTimer.easeOut()
    });
    var floor = new Platformer.Sprite('Floor', recArtist, [floorBehavior]);
    floor.color = FLOOR_COLOR;
    floor.width('100%');
    floor.height('13%');
    floor.drawTo(floorCanvas);

    /* banner start */
    var bannerArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.banner);
    var banner = new Platformer.Sprite('Banner', bannerArtist, []);
    banner.aspectRatio = 337 / 216;
    banner.width('auto');
    banner.height("30%");
    banner.top("30%");
    banner.left("13%", grove);
    banner.drawTo(entityCanvas);
    /* banner end */

    /* cloud start */
    var cloudAspectRatio = 133 / 82;
    var cloudWidth = 'auto';
    var cloudHeight = '12%';
    var cloudArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.cloud);
    var cloudOne = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudOne.aspectRatio = cloudAspectRatio;
    cloudOne.width(cloudWidth);
    cloudOne.height(cloudHeight);
    cloudOne.top("35%");
    cloudOne.left("10.5%", grove);
    cloudOne.drawTo(cloudCanvas);
    var cloudTwo = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudTwo.aspectRatio = cloudAspectRatio;
    cloudTwo.width(cloudWidth);
    cloudTwo.height(cloudHeight);
    cloudTwo.top("20%");
    cloudTwo.left("24%", grove);
    cloudTwo.drawTo(cloudCanvas);
    var cloudThree = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudThree.aspectRatio = cloudAspectRatio;
    cloudThree.width(cloudWidth);
    cloudThree.height(cloudHeight);
    cloudThree.top("15%");
    cloudThree.left("43%", grove);
    cloudThree.drawTo(cloudCanvas);
    var cloudFour = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudFour.aspectRatio = cloudAspectRatio;
    cloudFour.width(cloudWidth);
    cloudFour.height(cloudHeight);
    cloudFour.top("18%");
    cloudFour.left("54%", grove);
    cloudFour.drawTo(cloudCanvas);
    var cloudFive = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudFive.aspectRatio = cloudAspectRatio;
    cloudFive.width(cloudWidth);
    cloudFive.height(cloudHeight);
    cloudFive.top("28%");
    cloudFive.left("61%", grove);
    cloudFive.drawTo(cloudCanvas);
    var cloudSix = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudSix.aspectRatio = cloudAspectRatio;
    cloudSix.width(cloudWidth);
    cloudSix.height(cloudHeight);
    cloudSix.top("24%");
    cloudSix.left("69%", grove);
    cloudSix.drawTo(cloudCanvas);
    var cloudSeven = new Platformer.Sprite('Cloud', cloudArtist, []);
    cloudSeven.aspectRatio = cloudAspectRatio;
    cloudSeven.width(cloudWidth);
    cloudSeven.height(cloudHeight);
    cloudSeven.top("40%");
    cloudSeven.left("80%", grove);
    cloudSeven.drawTo(cloudCanvas);
    /* cloud end */

    /* man start */
    var manArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.manWalkRight);
    var manRunBehavior = new Platformer.CycleBehavior(function(sprite) {
        sprite.runToLeft = function(speed) {
            sprite.artist.cells = data.manWalkLeft;
            if(!sprite.jumping) {
                sprite.animationRate = speed;
            }
        };
        sprite.runToRight = function(speed) {
            sprite.artist.cells = data.manWalkRight;
            if(!sprite.jumping) {
                sprite.animationRate = speed;
            }
        };
        sprite.stop = function() {
            sprite.animationRate = 0;
        };
    });
    var manJumpBehavior = new Platformer.JumpBehavior();
    var manFallBehavior = new Platformer.TimeBehavior({
        start: {top: 0},
        end: {top: '63.1%'},
        duration: 1000,
        decorate: "fall",
        easing: Platformer.AnimationTimer.easeOut()
    });
    var manCollideBehavior = new Platformer.CollideBehavior({
        canvas: entityCanvas,
        processCollision: function() {}
    });
    var manMoveBehavior = new Platformer.MoveBehavior();
    var man = new Platformer.Sprite('Man', manArtist, [manRunBehavior,
            manJumpBehavior, manFallBehavior, manCollideBehavior, manMoveBehavior]);
    man.hide();
    man.aspectRatio = 140 / 172;
    man.width('auto');
    man.height('25%');
    man.center();
    man.drawTo(mainCanvas);
    /* man end */

    /* NPC start */
    var contactManBehavior = new Platformer.CycleBehavior(function(sprite) {
        sprite.animate = function(speed) {
            sprite.animationRate = speed;
        };
    });
    var contactManArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.contactMan);
    var contactMan = new Platformer.Sprite('ContactMan', contactManArtist, [contactManBehavior]);
    contactMan.aspectRatio = 110 / 182;
    contactMan.width('auto');
    contactMan.height('25%');
    contactMan.top('63.1%');
    contactMan.left('36%', grove);
    contactMan.drawTo(entityCanvas);

    var assistantBehavior = new Platformer.CycleBehavior(function(sprite) {
        sprite.animate = function(speed) {
            sprite.animationRate = speed;
        };
    });
    var assistantArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.assistant);
    var assistant = new Platformer.Sprite('Assistant', assistantArtist, [assistantBehavior]);
    assistant.aspectRatio = 120 / 172;
    assistant.width('auto');
    assistant.height('25%');
    assistant.top('63.1%');
    assistant.left('48.5%', grove);
    assistant.drawTo(entityCanvas);

    var qrcodeMMbehavior = new Platformer.CycleBehavior(function(sprite) {
        sprite.animate = function(speed) {
            sprite.animationRate = speed;
        };
    });
    var qrcodeMMArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.qrcodeMM);
    var qrcodeMM = new Platformer.Sprite('QrcodeMM', qrcodeMMArtist, [qrcodeMMbehavior]);
    qrcodeMM.aspectRatio = 130 / 137;
    qrcodeMM.width('auto');
    qrcodeMM.height('20%');
    qrcodeMM.top('72%');
    qrcodeMM.left('56.5%', grove);
    qrcodeMM.drawTo(entityCanvas);

    var printerbehavior = new Platformer.CycleBehavior(function(sprite) {
        sprite.animate = function(speed) {
            sprite.animationRate = speed;
        };
    });
    var printerArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.printer);
    var printer = new Platformer.Sprite('Printer', printerArtist, [printerbehavior]);
    printer.aspectRatio = 260 / 201;
    printer.width('auto');
    printer.height('28%');
    printer.top('60.5%');
    printer.left('66%', grove);
    printer.drawTo(entityCanvas);
    /* NPC end */

    /* coin start */
    var coinAspectRatio = 34 / 45;
    var coinWidth = 'auto';
    var coinHeight = '7%';
    var coinTop = '70%';
    var coinArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.coin);
    var coinOne = new Platformer.Sprite('Coin', coinArtist, []);
    coinOne.aspectRatio = coinAspectRatio;
    coinOne.width(coinWidth);
    coinOne.height(coinHeight);
    coinOne.top(coinTop);
    coinOne.left("39%", grove);
    coinOne.drawTo(entityCanvas);
    var coinTwo = new Platformer.Sprite('Coin', coinArtist, []);
    coinTwo.aspectRatio = coinAspectRatio;
    coinTwo.width(coinWidth);
    coinTwo.height(coinHeight);
    coinTwo.top(coinTop);
    coinTwo.left("41%", grove);
    coinTwo.drawTo(entityCanvas);
    var coinThree = new Platformer.Sprite('Coin', coinArtist, []);
    coinThree.aspectRatio = coinAspectRatio;
    coinThree.width(coinWidth);
    coinThree.height(coinHeight);
    coinThree.top(coinTop);
    coinThree.left("43%", grove);
    coinThree.drawTo(entityCanvas);
    var coinFour = new Platformer.Sprite('Coin', coinArtist, []);
    coinFour.aspectRatio = coinAspectRatio;
    coinFour.width(coinWidth);
    coinFour.height(coinHeight);
    coinFour.top(coinTop);
    coinFour.left("60%", grove);
    coinFour.drawTo(entityCanvas);
    var coinFive = new Platformer.Sprite('Coin', coinArtist, []);
    coinFive.aspectRatio = coinAspectRatio;
    coinFive.width(coinWidth);
    coinFive.height(coinHeight);
    coinFive.top(coinTop);
    coinFive.left("62%", grove);
    coinFive.drawTo(entityCanvas);
    var coinSix = new Platformer.Sprite('Coin', coinArtist, []);
    coinSix.aspectRatio = coinAspectRatio;
    coinSix.width(coinWidth);
    coinSix.height(coinHeight);
    coinSix.top(coinTop);
    coinSix.left("64%", grove);
    coinSix.drawTo(entityCanvas);
    /* coin end */

    /* desk start */
    var deskArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.desk);
    var desk = new Platformer.Sprite('Desk', deskArtist, []);
    desk.aspectRatio = 358 / 276;
    desk.width('auto');
    desk.height("32%");
    desk.top("56.4%");
    desk.left("51.2%", grove);
    desk.drawTo(entityCanvas);
    /* desk end */

    /* flag start */
    var flagArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.flag);
    var flag = new Platformer.Sprite('Flag', flagArtist, []);
    flag.aspectRatio = 122 / 375;
    flag.width('auto');
    flag.height("50%");
    flag.top("38%");
    flag.left("81%", grove);
    flag.drawTo(entityCanvas);
    /* flag end */

    /* flower start */
    var flowerArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.flower);
    var flowerOne = new Platformer.Sprite('Flag', flowerArtist, []);
    flowerOne.aspectRatio = 95 / 156;
    flowerOne.width('auto');
    flowerOne.height("20%");
    flowerOne.top("70%");
    flowerOne.left("45%", grove);
    flowerOne.drawTo(backgroundCanvas);
    var flowerTwo = new Platformer.Sprite('Flag', flowerArtist, []);
    flowerTwo.aspectRatio = 95 / 156;
    flowerTwo.width('auto');
    flowerTwo.height("20%");
    flowerTwo.top("70%");
    flowerTwo.left("72%", grove);
    flowerTwo.drawTo(backgroundCanvas);
    /* flower end */

    /* barrier start */
    var barrierArtist = new Platformer.SpriteSheetArtist('/dist/img/app-sprite.png', data.barrier);
    var barrier = new Platformer.Sprite('Flag', barrierArtist, []);
    barrier.aspectRatio = 174 / 154;
    barrier.width('auto');
    barrier.height("20%");
    barrier.top("71%");
    barrier.left("78%", grove);
    barrier.drawTo(backgroundCanvas);
    /* barrier end */

    /* events */
    Platformer.NotificationCenter.instance().add({
        sender: backgroundCanvas,
        receiver: man,
        // 当 background 移动到左边界时，移动 man
        when: function(sender, receiver) {
            return !sender.canMoveToLeft();
        },
        do: function(sender, receiver) {
            receiver.moveToLeft(Math.abs(sender.velocity));
        }
    });

    Platformer.NotificationCenter.instance().turnOn();

    platform.add([skyCanvas, floorCanvas, backgroundCanvas, mainCanvas, cloudCanvas, entityCanvas,
            sky, grove, floor, banner, man,
            cloudOne, cloudTwo, cloudThree, cloudFour, cloudFive, cloudSix, cloudSeven,
            assistant, contactMan, qrcodeMM, printer, desk, flag, flowerOne, flowerTwo, barrier,
            coinOne, coinTwo, coinThree, coinFour, coinFive, coinSix]).draw();

    platform.start(function() {
        floor.start(function() {
            man.show();
            man.fall();
        });
    });

    platform.update(function() {
        contactMan.animate(4);
        assistant.animate(4);
        qrcodeMM.animate(4);
        printer.animate(4);
        // 左右同时按下时，只执行左
        if(pressedKeys[37]) { // Left
            man.runToLeft(10);
            backgroundCanvas.moveToLeft(200);  // pix / s
            entityCanvas.moveToLeft(200);  // pix / s
            cloudCanvas.moveToLeft(150);  // pix / s
        }
        else if(pressedKeys[39]) { // Right
            man.runToRight(10);
            backgroundCanvas.moveToRight(200);  // pix / s
            entityCanvas.moveToRight(200);  // pix / s
            cloudCanvas.moveToRight(150);  // pix / s
        }
        // 上下同时按下时，只执行上
        if(pressedKeys[38]) { // Up
            man.jump();
        } else if(pressedKeys[40]) { // Down
        }

        if(!pressedKeys[37] && !pressedKeys[39]) {
            man.stop();
            backgroundCanvas.stop();
            entityCanvas.stop();
            cloudCanvas.stop();
        }
    });
});
