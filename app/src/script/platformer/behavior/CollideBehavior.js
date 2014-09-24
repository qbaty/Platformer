/**
 * 碰撞检测
 */
Platformer.CollideBehavior = behavior.extend({

    /**
     * @param settings
     * settings 格式
     * {
     *      canvas:  {Object | Array}  需要检测的位于特定 canvas 的 sprite
     *      processCollision: function() {}  碰撞函数
     * }
     */
    constructor: function(settings) {
        this.canvas = settings.canvas;
        this.allSprite = [];
        this.processCollision = settings.processCollision || function() {};
    },

    getSprite: function(platform) {
        if(!this.allSprite.length) {
            if( isObject(this.canvas) ) {
                Array.prototype.push.apply(this.allSprite, this.canvas.spritesColleaction);
            } else if( isArray(this.canvas) ) {
                for(var i = 0; i < this.canvas.length; i++) {
                    Array.prototype.push.apply(this.allSprite, this.canvas[i].spritesColleaction);
                }
            } else {
                // canvas 没指定则使用所有的 sprite
                this.allSprite = platform.get("sprite");
            }
        }
    },

    execute: function(sprite, time, fps, context, platform) {
        this.getSprite(platform);
        // 1. 对所有游戏中的 sprite 进行判断
        for(var i = 0, len = this.allSprite.length; i < len; i++) {
            var otherSprite = this.allSprite[i];

            // 2. 排除不适合碰撞检测的 sprite
            if(this.isCandidateForCollision(sprite, otherSprite)) {
                // 3. 检测 sprite 之间的碰撞
                if(this.didCollide(sprite, otherSprite, context)) {
                    // 4. 处理碰撞
                    console.log(otherSprite.type);
                    this.processCollision(sprite, otherSprite);
                }
            }
        }
    },

    isCandidateForCollision: function(sprite, otherSprite) {
        return sprite !== otherSprite &&       // 不是同一个 sprite
               sprite.visible && otherSprite.visible &&  // 两个 sprite 都是可见的
               otherSprite.left() - otherSprite.offset < sprite.left() + sprite.width();  // 两个 srpite 位于同一个区域
    },

    didCollide: function(sprite, otherSprite, context) {
        // 用于缩小 sprite 的边框，使碰撞检测更准确
        var MARGIN_TOP = 10;
        var MARGIN_LEFT = 10;
        var MARGIN_RIGHT = 10;
        var MARGIN_BOTTOM = 0;

        var left = sprite.left() + sprite.offset + MARGIN_LEFT;
        var right = sprite.left() + sprite.offset + sprite.width() + MARGIN_RIGHT;
        var top = sprite.top() + MARGIN_TOP;
        var bottom = sprite.top() + sprite.height() + MARGIN_BOTTOM;
        var centerX = left + sprite.width() / 2;
        var centerY = sprite.top() + sprite.height() / 2;

        context.beginPath();
        context.rect(otherSprite.left() - otherSprite.offset, otherSprite.top(), 
                    otherSprite.width(), otherSprite.height());

        return context.isPointInPath(left, top)  ||
               context.isPointInPath(right, top) ||
               context.isPointInPath(centerX, centerY) ||
               context.isPointInPath(left, bottom) ||
               context.isPointInPath(right, bottom);
    }
});
