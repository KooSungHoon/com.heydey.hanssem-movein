// easing 함수 주소 : http://goo.gl/5HLl8
var easing = {
    linear: function (t, b, c, d) {
        t /= d;
        return b + c * (t);
    },
    easeOut: function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (0.9 * tc * ts + -4.35 * ts * ts + 8.6 * tc + -8.7 * ts + 4.55 * t);
    }
};

var requestAniFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function ScrollAnimation(el, position) {
    this.elPosition = this.setElement(el, position);
    this.scrolled = false;
    this.canceled = false;
}

ScrollAnimation.prototype.setElement = function (el, position) {
    "use strict";
    return {
        setScroll: function (val) {
            position === 'x' ? (el.scrollLeft = val) : (el.scrollTop = val);
        },
        getScroll: function () {
            return position === 'x' ? (el.scrollLeft) : (el.scrollTop);
        }
    };
};

ScrollAnimation.prototype.getScrolled = function () {
    return this.scrolled;
};

ScrollAnimation.prototype.stopAnimate = function () {
    if (this.scrolled) {
        this.canceled = true;
    }
};
ScrollAnimation.prototype.scrollAnimation = function (to, duration, easingName, callback) {
    var start = this.elPosition.getScroll(),
        change = to - start,
        currentTime = 0,
        increment = 1000 / 60,
        self = this;

    duration = typeof duration === 'undefined' ? 500 : duration;
    this.scrolled = true;
    var animate = function () {
        currentTime += increment;
        var val = easing[easingName] ? easing[easingName](currentTime, start, change, duration) : easing["linear"](currentTime, start, change, duration);
        self.elPosition.setScroll(val);
        if (currentTime <= duration && !self.canceled) {
            requestAniFrame(animate);
        } else {
            if (callback && typeof(callback) === 'function') {
                callback();
            }
            self.scrolled = false;
            self.canceled = false;
        }
    };
    animate();
};
export default ScrollAnimation;
