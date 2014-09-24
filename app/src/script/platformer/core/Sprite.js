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
