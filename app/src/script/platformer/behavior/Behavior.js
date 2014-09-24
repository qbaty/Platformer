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
