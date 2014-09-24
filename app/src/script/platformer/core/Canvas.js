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
