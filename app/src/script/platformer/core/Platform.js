Platformer.Platform = (function() {

    /**
     * 单例
     */
    var uniqueInstance = null;

    /**
     * sprite 集合
     */
    var spritesColleaction = [];

    /**
     * canvas 集合
     */
    var canvasColleaction = [];

    /**
     * start 集合，动画开始时执行的集合
     */
    var startColleaction = [];

    /**
     * 上一次执行动画帧的时间，用于计算 fps，见函数 calculateFps
     */
    var lastAnimationFrameTime = 0;

    function constructor() {
        return {
            calculateFps: function(now) {
                this.fps = parseInt(1000 / (now - lastAnimationFrameTime));
                lastAnimationFrameTime = now;

                return this.fps;
            },

            /**
             * 当 window 的大小改变时，根据 window 大小重新布局
             * 一般只重新布局 canvas 的大小，其他 sprite 根据 canvas 大小自动重绘
             * @param  {Function}  callback  需要重新布局的函数
             */
            layout: function(callback) {
                var self = this;
                function layout() {
                    // 清空所有 canvas
                    self.clear();

                    callback();
                    // 各 sprite 重新计算
                    for(var i = 0; i < spritesColleaction.length; i++) {
                        spritesColleaction[i].compute();
                    }
                    self.redraw();
                }

                // 第一次进入页面时不触发 resize，因为主动调用 layout 进行布局 
                layout();
                Platformer.Resize.init(layout);

                return this;
            },

            /**
             * 动画开始时执行的函数，仅执行一次
             * @param callback
             */
            start: function(callback) {
                if(startColleaction.indexOf(callback) == -1 &&
                    isFunction(callback)) {
                    startColleaction.push(callback);
                }
            },

            execStart: function(now) {
                for(var i = 0; i < startColleaction.length; ) {
                    startColleaction[i](now);
                    // 仅执行一次，执行后移除
                    startColleaction.splice(i, 1);
                }
            },

            update: function(callback) {
                var self = this;
                function callbackWrapper(now) {
                    notificationCenter.instance().listen();

                    self.execStart(now);
                    callback(now);
                    self.redraw(now);
                    window.RequestAnimationFrame(callbackWrapper);
                }
                window.RequestAnimationFrame(callbackWrapper);
            },

            /**
             * 将 sprite canvas 加入到该 game 中
             * 主要为了统一调用
             */
            add: function(obj) {
                if(obj instanceof Platformer.Sprite && spritesColleaction.indexOf(obj) == -1) {
                    spritesColleaction.push(obj);
                } else if(obj instanceof Canvas && canvasColleaction.indexOf(obj) == -1) {
                    canvasColleaction.push(obj);
                } else if ( isArray(obj) ) {
                    for(var i = 0; i < obj.length; i++) {
                        this.add(obj[i]);
                    }
                }

                return this;
            },

            /**
             * 获得当前 game 中的实体
             * @param  {String}  type  类型，sprite canvas
             */
            get: function(type) {
                if(type == "sprite") {
                    return spritesColleaction;
                } else if(type == "canvas") {
                    return canvasColleaction;
                }
            },

            remove: function(obj) {
                if(obj instanceof Platformer.Sprite && spritesColleaction.indexOf(obj) != -1) {
                    spritesColleaction.splice(index, 1);
                } else if(obj instanceof Canvas && canvasColleaction.indexOf(obj) != -1) {
                    canvasColleaction.splice(index, 1);
                } else if ( isArray(obj) ) {
                    for(var i = 0; i < obj.length; i++) {
                        this.remove(obj[i]);
                    }
                }

                return this;
            },

            /**
             * 将所有加入到该 game 中的 canvas 清空
             */
            clear: function() {
                for(var i = 0; i < canvasColleaction.length; i++) {
                    var canvas = canvasColleaction[i];
                    canvas.clear();
                }

                return this;
            },

            /**
             * 让所有加入到该 game 中的 sprite 执行 draw
             */
            draw: function() {
                for(var i = 0; i < spritesColleaction.length; i++) {
                    var sprite = spritesColleaction[i];
                    // 如果 sprite 是不可见的，则不绘制
                    if(sprite.visible && sprite.canvas) {
                        sprite.draw();
                    }
                }

                return this;
            },

            /**
             * 执行所有 sprite 的 update 函数
             */
            redraw: function(time) {
                this.clear();
                var fps = this.calculateFps(time);
                var i;

                for(i = 0; i < canvasColleaction.length; i++) {
                    canvasColleaction[i].beforeUpdate(fps);
                }

                for(i = 0; i < spritesColleaction.length; i++) {
                    var sprite = spritesColleaction[i];

                    if(sprite.visible) {
                        sprite.update(time, fps);
                        sprite.draw();
                    }
                }

                for(i = 0; i < canvasColleaction.length; i++) {
                    canvasColleaction[i].afterUpdate(fps);
                }

                return this;
            }
        };
    }

    return {
        instance: function() {
            if(!uniqueInstance) {
                uniqueInstance = constructor();
            }

            return uniqueInstance;
        }
    };
})();

