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
