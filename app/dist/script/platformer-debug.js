(function(root, factory) {

    // Support module loader.
    // ---------------
    if(typeof define === 'function' && define.amd) {

        // [1] AMD anonymous module
        define(['exports'], function(exports, $) {
            factory(root, exports);
        });

    } else if(typeof define === 'function' && seajs){

        // [2] seajs
        define(function(require, exports) {
            factory(root, exports);
        });

    } else if(typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {

        // [3] CommonJS/Node.js
        factory(root, exports);

    } else {

        // [4] as a global var
        root.Platformer = factory(root, {});

    }
})(this, function(root, Platformer, undefined) {


window.RequestAnimationFrame = (function() {

    var originalWebkitRequestAnimationFrame,
        wrapper,
        callback,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function
 
    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        wrapper = function (time) {
            if (time === undefined) {
                time = Date.now();
            }
            self._callback(time);
        };

        // Make the switch
          
        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

        window.webkitRequestAnimationFrame = function (callback, element) {
            self._callback = callback;

            // Browser calls the wrapper and wrapper calls the callback
            
            originalWebkitRequestAnimationFrame(wrapper, element);
        };
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.
         
        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    } 

    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            var start,
                finish;

            window.setTimeout( function () {
                start = Date.now();
                callback(start);
                finish = Date.now();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
})();

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

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    };
}

var isObject = isType('Object');
var isString = isType('String');
var isNumber = isType('Number');
var isArray = Array.isArray || isType('Array');
var isFunction = isType('Function');


var config = {};

Platformer.config = function(configData) {

    for(var key in configData) {
        var curr = configData[key],
            prev = config[key];

        // 合并配置对象
        if(prev && isObject(prev)) {
            // 覆盖
            for(var k in curr) {
                prev[k] = curr[k];
            }
        } else {
            // 合并数组
            if(isArray(prev)) {
                curr = prev.concat(curr);
            }

            config[key] = curr;
        }
    }

};

// 所有 canvas 的 maxOffset 都一致，该值为所有 canvas 中的 sprite 的最大宽度
var maxOffset = 0;

var Canvas = function(ins) {
    this.ins = ins;
    this.offset = 0;
    this.velocity = 0;   // pixels / second
    this.spritesColleaction = [];
    this._width = ins.width;
    this._height = ins.height;
    this.context = ins.getContext('2d');
};

Canvas.prototype = {

    constructor: Canvas,

    clear: function () {
        this.context.clearRect(0, 0, this.width(), this.height());
    },

    width: function (val) {
        if (val) {
            val = val < this.minWidth ? this.minWidth : val;
            val = val > this.maxWidth ? this.maxWidth : val;
            this._width = this.ins.width = val;
        }
        return this._width;
    },

    height: function (val) {
        if (val) {
            val = val < this.minHeight ? this.minHeight : val;
            val = val > this.maxHeight ? this.maxHeight : val;
            this._height = this.ins.height = val;
        }
        return this._height;
    },

    add: function (obj) {
        if (this.spritesColleaction.indexOf(obj) == -1) {
            maxOffset = maxOffset > obj.width() ? maxOffset : obj.width();
            this.spritesColleaction.push(obj);
        }
    },

    remove: function (obj) {
        if (this.spritesColleaction.indexOf(obj) != -1) {
            this.spritesColleaction.splice(this.spritesColleaction.indexOf(obj), 1);
        }
    },

    moveToLeft: function(velocity) {
        this.velocity = -velocity;
    },

    moveToRight: function(velocity) {
        this.velocity = velocity;
    },

    stop: function() {
        this.velocity = 0;
    },

    canMoveToLeft: function() {
        return (this.velocity !== 0 || this.offset !== 0) &&
            (this.offset > 0 && this.velocity < 0);
    },

    canMoveToRight: function() {
        return (this.velocity !== 0 || this.offset !== 0) &&
        (this.offset <= maxOffset - this.width() && this.velocity > 0);
    },

    /**
     * 当 canvas 下的元素执行 update 之前调用
     * 该方法对所有该 canvas 下的 sprite 起作用
     * 若要对单个 sprite 发送形变，应在该 sprite 的 beforeDraw 函数里更改 context
     */
    beforeUpdate: function (fps) {
        // 当 canvas 速度不为 0 时，移动 canvas，移动完之后 sprite update，则造成 sprite 移动
        if (this.canMoveToLeft() || this.canMoveToRight()) {
            // velocity 为 pix /s , fps 为 frame / s ，因此得到 pix / frame 像素每帧
            this.offset += this.velocity / fps;
        }
        for(var i = 0; i < this.spritesColleaction.length; i++) {
            this.spritesColleaction[i].offset = this.offset;
        }
        this.context.translate(-this.offset, 0);
    },

    /**
     * 当 canvas 下的元素执行 draw 之后调用
     * 该方法对所有该 canvas 下的 sprite 起作用
     * 若要对单个 sprite 发送形变，应在该 sprite 的 beforeDraw 函数里更改 context
     */
    afterUpdate: function (fps) {
        // 恢复 canvas 的移动，仅 sprite 产生移动
        this.context.translate(this.offset, 0);
    }

};

Platformer.Canvas = (function() {

    /**
     * 每个 canvas 是一个单例
     * 该变量维持一个 canvas 单例集合
     */
    var instances = {};

    return {
        instance: function(id) {
            if(id && instances[id]) {
                return instances[id];
            } else if(id){
                var ins = document.getElementById(id);
                instances[id] = new Canvas(ins);
                return instances[id];
            }
        }
    };
})();

var needCompute = ['Left', 'Width', 'Top', 'Height'];

/**
 * 这部分需要计算的值是根据 sprite 的相对物体的的 width 来计算
 * 相对物体默认为 canvas，执行 drawTo 时设置
 * 若指定了 relativeTo 则改变相对的物体
 */
var relativeWidth = ['Left', 'Width'];

/**
 * 这部分需要计算的值是根据 sprite 的相对物体的 height 来计算
 */
var relativeHeight = ['Top', 'Height'];

/**
 * 需要计算的属性分为初始值和计算值
 */
var INIT = 'init';
var COMPUTED = 'computed';

/**
 * Sprite 基本图形对象
 *
 * @param {String} type    Sprite 类型，如man ..
 * @param {Artist} artist  用于绘制 Sprite 对象
 * @param {Array}  behaviors  Sprite 的动作集合
 */
var sprite = Platformer.Sprite = function(type, artist, behaviors) {
    this.type = type || '';
    this.artist = artist || undefined;
    this.needCompute = needCompute.slice(0, needCompute.length);
    this.behaviors = behaviors || [];
    this.equipBehaviors();

    this._relative = {};     // 各属性的相对物体
    this.left(0);         // 基于左上角 Sprite 的 X 坐标
    this.top(0);          // 基于左上角 Sprite 的 Y 坐标
    this.width(0);
    this.height(0);
    this.offset = 0;         // 偏移量
    this.visible = true;     // Sprite 是否可见，false 则不需要绘制
    this.color = '#fff';
};

/**
 * 设置 canvas 
 * 主要为了提前计算属性值，若不提前计算，则获取其他 sprite 的值时，获取到的计算值为空
 */
sprite.prototype.drawTo = function(canvas) {
    this.canvas = canvas;
    this.compute();
    this.canvas.add(this);
};

sprite.prototype.equipBehaviors = function() {
    for(var i = 0; i < this.behaviors.length; i++) {
        if( isFunction(this.behaviors[i].decorate) ) {
            this.behaviors[i].decorate(this);
        }
    }
};

/**
 * 绘制 Sprite
 * @param {CanvasRenderingContext2D} context  canvas 上下文
 */
sprite.prototype.draw = function() {
    if(this.artist && this.artist instanceof Platformer.Artist && this.canvas) {
        this.artist.draw(this, this.canvas.context);
    }
};

sprite.prototype.show = function() {
    this.visible = true;
};

sprite.prototype.hide = function() {
    this.visible = false;
};

/**
 * 更新 Sprite，用于执行 Sprite 的动作 
 * @param {Number} time  当前时间
 * @param {Number} fps   帧每秒
 */
sprite.prototype.update = function(time, fps) {
    for(var i = 0; i < this.behaviors.length; i++) {
        var behavior = this.behaviors[i];
        if(behavior instanceof Platformer.Behavior) {
            behavior.execute(this, time, fps, this.canvas.context, Platformer.Platform.instance());
            
            if(!behavior.isDone) {
                continue;
            }
            // 动作完成则先执行动作的 done 然后移除
            if(isFunction(behavior.done)) {
                behavior.done(this);
            }
            this.behaviors.splice( i, 1 );
        }
    }
};

/**
 * 计算属性的值
 * 若 attr 存在，则计算 attr 值
 * 若 attr 不存在，则计算所有需要计算的属性的值
 */
sprite.prototype.compute = function(attr) {

    if(needCompute.indexOf(attr) != -1) {
        this._compute(attr);
        return;
    }

    for(var i = 0, len = this.needCompute.length; i < len; i++) {
        this._compute(this.needCompute[i]);
    }

    if(this.isCenter) {
        var relativeTo = this._relative.center || this.canvas;
        this.left( ( ( (relativeTo.width() - this.width()) * 0.5 ) / relativeTo.width() ) * 100 + '%' );
    }
};

// 相对于 relativeTo 居中， 若不存在则相对于 canvas 居中
sprite.prototype.center = function(relativeTo) {
    if(relativeTo) {
        this._relativeTo.center = relativeTo;
    }
    this.isCenter = true;
};

sprite.prototype._compute = function(attr) {
    var init_attr = '_' + INIT + attr;
    var computed_attr = '_' + COMPUTED + attr;
    var relative = 0;
    var relativeTo = this._relative[attr] || this.canvas;

    if( /%/.test(this[init_attr]) ) {
        // 值为百分比，则根据 this._relative 大小计算 sprite 大小
        if(!relativeTo)  return;

        if( relativeWidth.indexOf(attr) != -1 ) {
            relative = relativeTo.width();
        } else if( relativeHeight.indexOf(attr) != -1 ) {
            relative = relativeTo.height();
        }
        this[computed_attr] = parseInt( parseFloat(this[init_attr]) * 0.01 * relative );

    } else if(/auto/.test(this[init_attr])) {
        // 值为 auto 则根据宽高比计算，如果使用 auto 必须指定宽高比 aspectRatio
        if( attr == 'Width' ) {
            this[computed_attr] = parseInt(this.height() * this.aspectRatio);
        } else if ( attr == 'Height' ) {
            this[computed_attr] = parseInt(this.width() / this.aspectRatio);
        }

    } else if( isNumber(this[init_attr]) ) {
        // 值为 number 则直接赋值
        this[computed_attr] = parseInt(this[init_attr]);
    }

    this[computed_attr] = this[computed_attr] < this['min' + attr] ? 
                        this['min' + attr] : this[computed_attr];

    this[computed_attr] = this[computed_attr] > this['max' + attr] ? 
                        this['max' + attr] : this[computed_attr];

};

/**
 * attr 不对称读写
 * 作为 setter 时，设置的是 init 属性
 * 作为 getter 时，获取的是 compute 属性
 */
sprite.prototype.attr = function(attr, val, relativeTo) {

    if(!attr)  return;

    if(val !== null && val !== undefined) {
        this['_' + INIT + attr] = val;
        if(relativeTo instanceof Platformer.Sprite || relativeTo instanceof Canvas) {
            this._relative[attr] = relativeTo;
        }
        this._compute(attr);
    }

    // 排序，将 auto 的属性放在最后计算，将百分比放在最先计算
    var isAuto = /auto/.test(val);
    var isPercentage = /%/.test(val);
    if( isAuto || isPercentage )  {
        this.needCompute.splice( this.needCompute.indexOf(attr), 1 );
        var index = isAuto ? this.needCompute.length : 0;
        this.needCompute.splice( index, 0, attr );
    }
    return this['_' + COMPUTED + attr];
};

/**
 * 需要计算的属性都通过 attr 函数设置/获取
 */
/* jshint loopfunc:true */
for(var i = 0, len = needCompute.length; i < len; i++) {
    (function(i) {
        sprite.prototype[ needCompute[i].toLowerCase() ] = function(val, relativeTo) {
            return this.attr(needCompute[i], val, relativeTo);
        };

        // 添加获取初始值方法，如 initWidth()
        sprite.prototype[ INIT + needCompute[i] ] = function() {
            return this['_' + INIT + needCompute[i]];
        };
    })(i);
}

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

var notificationCenter = Platformer.NotificationCenter = (function() {

    /**
     * 单例
     */
    var uniqueInstance = null;

    /**
     * 事件集合
     */
    var eventsColleaction = [];

    /**
     * 是否开启
     */
    var isTurnOn = false;

    function constructor() {
        return {
            /**
             * @param event
             * 事件格式
             * {
             *      sender:  //发送者
             *      receiver:  // 接受者
             *      when:  // 什么时候发送，when 返回 true 时
             *      do:  // 收到通知时执行
             * }
             */
            add: function(event) {
                if(isObject(event) && eventsColleaction.indexOf(event) == -1) {
                    eventsColleaction.push(event);
                } else if ( isArray(event) ) {
                    for(var i = 0; i < event.length; i++) {
                        this.add(event[i]);
                    }
                }
            },

            turnOn: function() {
                isTurnOn = true;
            },

            turnOff: function() {
                isTurnOn = false;
            },

            listen: function() {
                if(isTurnOn) {
                    for(var i = 0; i < eventsColleaction.length; i++) {
                        var event = eventsColleaction[i];
                        if(event.when(event.sender, event.receiver)) {
                            event.do(event.sender, event.receiver);
                        }
                    }
                }
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
/**
 * Artist  用于绘制 Sprite 对象 
 *
 * @param {Sprite}  sprite  需要绘制的 Sprite 对象
 * @param {CanvasRenderingContext2D} context  canvas 上下文
 */
var artist = Platformer.Artist = function Artist() {
};

// public 方法，对外的接口
artist.prototype.draw = function(sprite, context) {
    // 保存当前状态，防止 onDraw 函数中对 canvas 执行 transform 之类的方法，导致其他元素布局出错
    context.save();

    this.onDraw(sprite, context);
    
    context.restore();
};

// protected 方法，仅供子类实现
artist.prototype.onDraw = function(sprite, context) {
    throw new Error('Unsupported operation on an abstract class');
};

/**
 * 动作基类
 */
var behavior = Platformer.Behavior = function Behavior() {
};

/**
 * 装饰 sprite，为 sprite 添加一些动作需要的方法或属性
 */
behavior.prototype.decorate = function(sprite) {
};

behavior.prototype.execute = function(sprite, time, fps, context, platform) {
    throw new Error('Unsupported operation on an abstract class');
};

// Extend 用于继承，不单独使用，应 Sprite.extend({ .. }).
// ---------------

var extend = Platformer.extend = function(source) {
    var parent = this;
    var child;

    // 若子类指定了构造函数
    if( isObject(source) && source.hasOwnProperty("constructor")) {
        child = function() {
            parent.apply(this, arguments);
            source.constructor.apply(this, arguments);
        };
    } else {
        child = function() { parent.apply(this, arguments); };
    }

    var F = function() { this.constructor = child; };
    F.prototype = parent.prototype;
    child.prototype = new F();

    var key;
    // 复制 parent 的静态方法/属性到 child 如: config extend
    for(key in parent) {
        child[key] = parent[key];
    }

    for(key in source) {
        // source 中的 constructor 不合并，通过 source.constructor.apply 调用
        // 合并导致构造函数错误;
        if(key != "constructor") {  
            child.prototype[key] = source[key];
        }
    }

    return child;
};

sprite.extend = artist.extend = behavior.extend = stopwatch.extend = extend;

/**
 * RecArtist 用于绘制矩阵
 * 根据 sprite 的位置 颜色与大小
 */
Platformer.RecArtist = artist.extend({
    onDraw: function(sprite, context) {
        context.fillStyle = sprite.color;
        context.fillRect(sprite.left(), sprite.top(), sprite.width(), sprite.height());
    }
});


/**
 * SpriteSheetArtist  用于绘制 sprite 表单，即多帧图，如跑步
 */
Platformer.SpriteSheetArtist = artist.extend({
    constructor: function(spritesheet, cells, callback) {
        this.image = document.createElement('img');
        this.spritesheet = spritesheet;
        this.cells = cells;
        this.callback = callback;
        this.cellIndex = 0;
    },

    /**
     * 移至下一帧
     */
    advance: function() {
        if(this.cellIndex >= this.cells.length - 1) {
            this.cellIndex = 0;
        } else {
            this.cellIndex++;
        }
        return this.cellIndex;
    },

    onDraw: function(sprite, context) {
        if(!this.cells || !this.cells.length) {
            return;
        }

        var cell = this.cells[this.cellIndex];
        if(this.loadComplete) {
            context.drawImage(this.image, cell.left, cell.top,
                cell.width, cell.height, sprite.left(), sprite.top(),
                sprite.width(), sprite.height());
        } else {
            this.image.onload = load;
            this.image.src = this.spritesheet;
        }
        var self = this;
        function load() {
            self.loadComplete = true;

            context.drawImage(this, cell.left, cell.top, 
                cell.width, cell.height, sprite.left(), sprite.top(),
                sprite.width(), sprite.height());

            if( isFunction(self.callback) ) {
                self.callback.call(this);
            }
        }
    }
});



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


});

