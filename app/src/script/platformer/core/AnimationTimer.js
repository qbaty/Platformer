/**
 * 动画计时器
 * 根据 transducer 变换器制作非线性动画
 */
var animationTimer = Platformer.AnimationTimer = stopwatch.extend({
    constructor: function(duration, transducer) {
        this.transducer = transducer;
        this.duration = duration || 1000;
    },

    isExpired: function () { 
        return this.getElapsedTime() > this.duration; 
    },

    /**
     * 重写父类方法
     * 通过变换器改变运行秒表的经过时间
     */
    getElapsedTime: function() {
        var elapsedTime;
        if(this.running) {
            elapsedTime = Date.now() - this.startTime - this.totalPausedTime;
        } else {
            elapsedTime = this.elapsed;
        }
        var percentComplete = elapsedTime / this.duration;

        if(percentComplete >= 1) {
            percentComplete = 1.0;
        }

        if(this.transducer !== undefined && percentComplete > 0) {
            elapsedTime = elapsedTime * (this.transducer(percentComplete) / percentComplete);
        }

        return elapsedTime;
    }
});

animationTimer.easeOut = function(strength) {
    strength = strength ? strength : 1.0;

    return function(percentComplete) {
        return 1 - Math.pow(1 - percentComplete, strength * 2);
    };
};

animationTimer.easeIn = function(strength) {
    strength = strength ? strength : 1.0;

    return function(percentComplete) {
        return Math.pow(percentComplete, strength * 2);
    };
};

animationTimer.elastic = function(passes) {
    passes = passes || 3;

    return function(percentComplete) {
        return ( (1 - Math.pow(percentComplete * Math.PI * passes)) *
                (1 - percentComplete) + percentComplete );
    };
};

animationTimer.bounce = function(bounces) {
    var fn = AnimationTimer.elastic(bounces);

    bounces = bounces || 2;

    return function(percentComplete) {
        percentComplete = fn(percentComplete);
        return percentComplete <= 1? percentComplete : 2 - percentComplete;
    };
};

animationTimer.linear = function() {
    return function(percentComplete) {
        return percentComplete;
    };
};
