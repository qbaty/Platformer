
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
