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
