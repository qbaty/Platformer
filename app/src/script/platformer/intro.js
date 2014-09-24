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

