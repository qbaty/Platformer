var notificationCenter = Platformer.NotificationCenter = (function() {

    /**
     * 单例
     */
    var uniqueInstance = null;

    /**
     * 事件集合
     */
    var eventsColleaction = [];

    /**
     * 是否开启
     */
    var isTurnOn = false;

    function constructor() {
        return {
            /**
             * @param event
             * 事件格式
             * {
             *      sender:  //发送者
             *      receiver:  // 接受者
             *      when:  // 什么时候发送，when 返回 true 时
             *      do:  // 收到通知时执行
             * }
             */
            add: function(event) {
                if(isObject(event) && eventsColleaction.indexOf(event) == -1) {
                    eventsColleaction.push(event);
                } else if ( isArray(event) ) {
                    for(var i = 0; i < event.length; i++) {
                        this.add(event[i]);
                    }
                }
            },

            turnOn: function() {
                isTurnOn = true;
            },

            turnOff: function() {
                isTurnOn = false;
            },

            listen: function() {
                if(isTurnOn) {
                    for(var i = 0; i < eventsColleaction.length; i++) {
                        var event = eventsColleaction[i];
                        if(event.when(event.sender, event.receiver)) {
                            event.do(event.sender, event.receiver);
                        }
                    }
                }
            }
        };
    }

    return {
        instance: function() {
            if(!uniqueInstance) {
                uniqueInstance = constructor();
            }

            return uniqueInstance;
        }
    };
})();