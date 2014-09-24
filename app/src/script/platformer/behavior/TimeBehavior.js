/**
 * 时间动作，在一段时间内从初始状态转为指定状态
 */
Platformer.TimeBehavior = behavior.extend({
    /**
     * @param {Object} props
     * {
     *      start: {Object}  开始属性
     *      end:   {Object}  结束属性
     *      decorate:  {Function}  装饰 sprite 函数
     *      duration: {Number} 动画持续
     *      easing: {Function}  缓动函数
     * }
     */
    constructor: function(props) {
        this.start = props.start;
        this.end = props.end;
        this._decorate = props.decorate;
        this.duration = props.duration || 1000;
        this.easing = props.easing || Platformer.AnimationTimer.linear();
        this.stopwatch = new Platformer.AnimationTimer(this.duration, this.easing);
    },

    decorate: function(sprite, fps) {
        if(this.stopwatch.isRunning()) {
            return;
        }

        var self = this;
        sprite[this._decorate] = function(callback) {
            // 如果正在运行则不重复运行
            if(self.stopwatch.isRunning()) {
                return;
            }

            self.stopwatch.start();
            self.callback = callback;

            // sprite 执行时才计算 end 值，因为如果为百分比提前计算的话 canvas 还没指定
            for(var key in self.end) {
                // 如果 sprite 存在 initAttr 如 initWidth ..
                // 则保存
                var attr = key.toLowerCase();
                attr = key.charAt(0).toUpperCase() + key.slice(1);
                if( isFunction(sprite[ INIT + attr ]) ) {
                    self['init' + key] = self.end[key];
                    self.start[key] = sprite[key](self.start[key]);
                    self.end[key] = sprite[key](self.end[key]);
                }
            }
        };

    },

    execute: function(sprite, time, fps, context, platform) {
        var stopwatch = this.stopwatch;

        // stopwatch 开始时才执行，即调用了 sprite 的自定义函数
        if(!stopwatch.isRunning()) {
            return;
        }

        var key;
        if(!stopwatch.isDone()) {
            for(key in this.end) {
                var delta = stopwatch.getPercentageComplete() * (this.end[key] - this.start[key]);
                sprite[key](this.start[key] + delta);
            }
        } else {
            if( isFunction(this.callback) ) {
                this.callback();
            }
            this.isDone = true;  // 将动作标记为完成，则 sprite 将该动作移除
            for(key in this.end) {
                if(isString(this['init' + key])) {
                    sprite[key](this['init' + key]);
                }
            }
        }
    },

    // 完成时，移除
    done: function(sprite) {
        this.start = null;
        this.end = null;
        this.stopwatch = null;
        sprite[this._decorate] = null;
    }
});
