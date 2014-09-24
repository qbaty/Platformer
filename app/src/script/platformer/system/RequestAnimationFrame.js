window.RequestAnimationFrame = (function() {

    var originalWebkitRequestAnimationFrame,
        wrapper,
        callback,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function
 
    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        wrapper = function (time) {
            if (time === undefined) {
                time = Date.now();
            }
            self._callback(time);
        };

        // Make the switch
          
        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

        window.webkitRequestAnimationFrame = function (callback, element) {
            self._callback = callback;

            // Browser calls the wrapper and wrapper calls the callback
            
            originalWebkitRequestAnimationFrame(wrapper, element);
        };
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.
         
        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    } 

    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            var start,
                finish;

            window.setTimeout( function () {
                start = Date.now();
                callback(start);
                finish = Date.now();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
})();
