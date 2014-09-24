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
