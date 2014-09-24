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


