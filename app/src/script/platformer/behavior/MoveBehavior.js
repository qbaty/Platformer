/**
 * 移动动作, 默认为 sprite 绑定五个方法
 */
Platformer.MoveBehavior = behavior.extend({
    constructor: function(decorate) {
        this._decorate = isFunction(decorate) ? decorate : function(sprite) {
            sprite.moveToLeft = function(velocityX) {
                sprite.velocityX = -velocityX;
            };
            sprite.moveToRight = function(velocityX) {
                sprite.velocityX = velocityX;
            };
            sprite.moveToTop = function(velocityY) {
                sprite.velocityY = -velocityY;
            };
            sprite.moveToBottom = function(velocityY) {
                sprite.velocityY = velocityY;
            };
            sprite.stopMove = function() {
                sprite.velocityX = 0;
                sprite.velocityY = 0;
            };
        };
    },

    decorate: function(sprite) {
        sprite.velocityX = 0;
        sprite.velocityY = 0;

        this._decorate(sprite);
    },

    execute: function(sprite, time, fps) {
        var pixelsToMove;
        var offset;
        var relativeTo;
        if(sprite.velocityX !== 0) {
            pixelsToMove = sprite.velocityX / fps;
            if( /%/.test(sprite.initLeft()) ) {
                relativeTo = sprite._relative.Left || sprite.canvas;
                offset = ((sprite.left() + pixelsToMove) / relativeTo.width()) * 100 + '%';
            } else {
                offset = sprite.left();
            }
            sprite.left(offset);
        }
        if(sprite.velocityY !== 0) {
            pixelsToMove = sprite.velocityY / fps;
            if( /%/.test(sprite.initTop()) ) {
                relativeTo = sprite._relative.Top || sprite.canvas;
                offset = ((sprite.top() + pixelsToMove) / relativeTo.height()) * 100 + '%';
            } else {
                offset = sprite.top();
            }
            sprite.top(offset);
        }
    }
});
