/**
 * 使用 requestAnimationFrame 或 setTimeout 替代 resize
 * 防止 resize 事件太频繁影响性能
 */
Platformer.Resize = (function() {

    var callbacks = [],
        running = false;

    // 触发 resize 事件时调用
    function resize() {

        if (!running) {
            running = true;
            window.RequestAnimationFrame(runCallbacks);
        }

    }

    // 执行回调，由 requestNextAnimationFrame 调用
    function runCallbacks() {

        for(var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
        }

        running = false;
    }

    // 增加 resize 时需要执行的回调函数
    function addCallback(callback) {

        if (callback) {
            callbacks.push(callback);
        }

    }

    return {
        init: function(callback) {
            window.addEventListener('resize', resize);
            addCallback(callback);
        },

        // public 方法，增加回调函数
        add: function(callback) {
            addCallback(callback);
        }
    };
}());
