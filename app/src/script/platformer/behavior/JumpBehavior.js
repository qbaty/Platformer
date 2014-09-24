/**
 * 跳跃动作
 */
Platformer.JumpBehavior = behavior.extend({
    decorate: function(sprite) {
        sprite.JUMP_HEIGHT = 120;
        sprite.JUMP_DURATION = 1000;
        sprite.jumping = false;

        sprite.ascendStopwatch  = new Platformer.AnimationTimer(
                sprite.JUMP_DURATION / 2, Platformer.AnimationTimer.easeOut(1.2));
        sprite.descendStopwatch = new Platformer.AnimationTimer(
                sprite.JUMP_DURATION / 2, Platformer.AnimationTimer.easeIn(1.2));

        var self = this;
        sprite.jump = function() {
            if(this.jumping) {
                return;
            }

            // 保存初始高度，jump 结束时设回
            self.initTop = this.initTop();
            this.jumping = true;
            this.animationRate = 0;
            this.verticalLaunchPosition = this.top();
            this.ascendStopwatch.start();
        };
    },

    execute: function(sprite, time, fps) {
        if(!sprite.jumping) {
            return;
        }

        if(this.isJumpOver(sprite)) {
            sprite.juming = false;
            return;
        }

        var ascend = sprite.ascendStopwatch;
        var descend = sprite.descendStopwatch;
        
        if(ascend.isRunning()) {
            if(!ascend.isDone()) {
                this.ascend(sprite);
            } else {
                this.finishAscent(sprite);
            }
        } else if(descend.isRunning()) {
            if(!descend.isDone()) {
                this.descend(sprite);
            } else {
                this.finishDescent(sprite);
            }
        }
    }, 

    isJumpOver: function(sprite) {
        return !sprite.ascendStopwatch.isRunning() &&
               !sprite.descendStopwatch.isRunning();
    },

    ascend: function(sprite) {
        var deltaY = sprite.ascendStopwatch.getPercentageComplete() * sprite.JUMP_HEIGHT;
        sprite.top(sprite.verticalLaunchPosition - deltaY);
    },

    finishAscent: function(sprite) {
        sprite.jumpApex = sprite.top();
        sprite.ascendStopwatch.stop();
        sprite.descendStopwatch.start();
    },

    descend: function(sprite) {
        var deltaY = sprite.descendStopwatch.getPercentageComplete() * sprite.JUMP_HEIGHT;
        sprite.top(sprite.jumpApex + deltaY);
    },

    finishDescent: function(sprite) {
        sprite.top(sprite.verticalLaunchPosition);
        sprite.descendStopwatch.stop();
        sprite.jumping = false;
        sprite.animationRate = 10;
        sprite.top(this.initTop);
    }
});
