/**
 * 循环动作，根据动画速度周期改变 sprite's images
 */
Platformer.CycleBehavior = behavior.extend({
    constructor: function(decorate) {
        this.lastAdvanceTime = 0;
        this._decorate = isFunction(decorate) ? decorate : function() {};
    },

    decorate: function(sprite) {
        sprite.animationRate = 0;

        this._decorate(sprite);
    },

    execute: function(sprite, time, fps) {
        if (sprite.animationRate === 0) {
            return;
        }

        if(this.lastAdvanceTime === 0) {
            this.lastAdvanceTime = time;
        } else if(time - this.lastAdvanceTime > 1000 / sprite.animationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = time;
        }
    }
});
