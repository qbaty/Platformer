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

