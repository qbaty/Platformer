/**
 * 秒表
 * 用于计时，start 开始计时，stop 停止
 * 获取流逝时间 getElapsedTime()
 */
var stopwatch = Platformer.Stopwatch = function(duration) {
    this.duration = duration;
    this.startTime = 0;
    this.running = false;
    this.elapsed = undefined;

    this.paused = false;
    this.startPause = 0;
    this.totalPausedTime = 0;
};

stopwatch.prototype = {

    constructor: stopwatch,

    start: function() {
        this.startTime = Date.now();
        this.running = true;
        this.totalPausedTime = 0;
        this.startPause = 0;
    },

    stop: function() {
        if(this.paused) {
            this.unpause();
        }
        this.elapsed= Date.now() - this.startTime - this.totalPausedTime;
        this.running = false;
    },

    pause: function() {
        this.startPause = Date.now();
        this.paused = true;
    },

    unpause: function() {
        if(!this.paused) {
            return;
        }

        this.totalPausedTime += Date.now() - this.startPause;
        this.startPause = 0;
        this.paused = false;
    },

    getElapsedTime: function() {
        if(this.running) {
            return Date.now() - this.startTime - this.totalPausedTime;
        } else {
            return this.elapsed;
        }
    },

    getPercentageComplete: function() {
        return this.getElapsedTime() / this.duration;
    },

    isPaused: function() {
        return this.paused;
    },

    isRunning: function() {
        return this.running;
    },

    isDone: function() {
        return this.getElapsedTime() > this.duration;
    },

    reset: function() {
        this.elapsed = 0;
        this.startTime = Date.now();
        this.running = false;
        this.totalPausedTime = 0;
        this.startPause = 0;
    }
};
