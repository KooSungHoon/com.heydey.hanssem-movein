const slide_func = {
    init: function () {
        var _this = this;
        this.list_wrap = $(this).children(":first-child");
        this.list = this.list_wrap.children();
        this.totalCnt = this.list.length;
        this.prev = $(this).find(".slide_view_prev");
        this.next = $(this).find(".slide_view_next");
        this.pasing_wrap = $(this).find(".slide_view_btns");
        this.pasing = this.pasing_wrap.children();
        this.order = 0;
        this.next_order = 0;
        this.stop = false;
        this.auto = this.opts.auto;
        this.speed = this.opts.speed;
        this.interval_time = this.opts.interval_time;
        this.auto_obj = "";
        this.imgType1 = '';
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.leftMove = false;
        this.rightMove = false;
        this.slideCnt = $(this).find(".slide_cnt_num");
        this.slideTot = $(this).find(".slide_cnt_tot");
        this.limited = this.opts.limited;

        if (this.totalCnt <= 1) {
            this.prev.hide();
            this.next.hide();
            return false;
        }

        this.slideTot.text(this.totalCnt);

        if (this.limited) this.prev.css("opacity", 0.4);

        this.prev.on('click', function () {
            _this.action(-1);
        });

        this.next.on('click', function () {
            _this.action(1);
        });

        this.list.on("touchstart", function (e) {
            _this.stopAuto();
            if (e.type == "touchstart" && e.originalEvent.touches.length <= 1) {
                _this.startX = e.originalEvent.touches[0].pageX;
                _this.startY = e.originalEvent.touches[0].pageY;
            }
        });

        this.list.on("touchmove", function (e) {
            if (e.type == "touchmove" && e.originalEvent.touches.length <= 1) {
                _this.moveX = e.originalEvent.touches[0].pageX - _this.startX;
                _this.moveY = e.originalEvent.touches[0].pageY - _this.startY;

                if (_this.moveX > 20) {
                    _this.leftMove = true;
                    _this.rightMove = false;
                }

                if (_this.moveX < -20) {
                    _this.leftMove = false;
                    _this.rightMove = true;
                }
            }
        });

        this.list.on("touchend", function (e) {
            if (_this.leftMove) {
                _this.action(-1);
            }

            if (_this.rightMove) {
                _this.action(1);
            }

            if (_this.auto) _this.autoAction();
        });

        $(this).bind("mouseenter", function () {
            _this.stopAuto();
        });

        $(this).bind("mouseleave", function () {
            _this.autoAction();
        });

        if (this.auto) this.autoAction();

        if (this.pasing.size() > 0) {
            var img_length1 = this.pasing.eq(0).find("img").attr("src").length - 3;
            this.imgType1 = this.pasing.eq(0).find("img").attr("src").substr(img_length1, 3);

            this.pasing.eq(0).addClass("on");
            this.pasing.eq(0).find("img").attr("src", this.pasing.eq(0).find("img").attr("src").replace("." + this.imgType1, "_on." + this.imgType1));

            this.pasing.click(function () {
                var dc = 1;
                if (_this.order <= $(this).index()) {
                    dc = 1;
                } else {
                    dc = -1;
                }
                _this.action(dc, $(this).index());
            });
        }
    },

    action: function (d, pNum) {
        var _this = this;

        if (pNum == this.order) return false;
        if ($(this).find(":animated").size() >= 1) return false;

        if (this.limited) {
            if (d == 1) {
                if (this.order >= this.totalCnt - 1) {
                    return false;
                }
            } else {
                if (this.order <= 0) {
                    return false;
                }
            }
        }

        this.list.eq(this.order).stop().animate({"marginLeft": -d * 100 + "%"}, this.speed, function () {
            $(this).css({"position": "absolute", "top": 0, "left": "100%", "marginLeft": 0});
        });

        if (d == 1) {
            if (this.order >= this.totalCnt - 1) {
                this.order = -1;
            }

            if (pNum >= 0) {
                this.next_order = pNum;
            } else {
                this.next_order = this.order + 1;
            }

            this.list.eq(this.next_order).stop().animate({"left": 0}, this.speed, function () {
                $(this).css("position", "relative");
                if (pNum >= 0) {
                    _this.order = pNum;
                } else {
                    _this.order++;
                }

                //콜백 함수
                _this.actionCallBack();
            });
        } else {
            if (pNum >= 0) {
                this.next_order = pNum;
                this.order = pNum;
            } else {
                this.next_order = this.order - 1;

                if (this.order <= 0) {
                    this.next_order = this.totalCnt - 1;
                    this.order = this.totalCnt - 1;
                } else {
                    this.order--;
                }
            }
            this.list.eq(this.next_order).css("left", "-100%").stop().animate({"left": "0"}, this.speed, function () {
                $(this).css("position", "relative");

                //콜백 함수
                _this.actionCallBack();
            });
        }

        if (this.pasing.size() > 0) {
            this.pasing.each(function (n) {
                if (_this.next_order == n) {
                    $(this).addClass("on");
                    if ($(this).find("img").attr("src").indexOf("_on") == -1) {
                        $(this).find("img").attr("src", $(this).find("img").attr("src").replace("." + _this.imgType1, "_on." + _this.imgType1));
                    }
                } else {
                    $(this).removeClass("on");
                    $(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on." + _this.imgType1, "." + _this.imgType1));
                }
            });
        }

        this.slideCnt.text(this.next_order + 1); // 페이지 숫자 표시 태그 클래스 .slide_cnt_num
    },

    autoAction: function () {
        var _this = this;

        _this.stopAuto();
        if (this.auto) {
            this.auto_obj = setInterval(function () {
                _this.action(1);
            }, _this.interval_time);
        }
    },

    stopAuto: function () {
        if (this.auto) {
            clearInterval(this.auto_obj);
        }
    },

    actionCallBack: function () {
        var _this = this;

        if (this.limited) {
            if (this.order >= this.totalCnt - 1) {
                this.next.css("opacity", 0.4);
            } else {
                this.next.css("opacity", 1);
            }

            if (this.order <= 0) {
                this.prev.css("opacity", 0.4);
            } else {
                this.prev.css("opacity", 1);
            }
        }
    }
};
$.fn.slide_func = function (settings) {
    settings = jQuery.extend({
        auto : false,
        btn_prev : null,
        btn_next : null,
        btn_pasing : null,
        list : null,
        speed : 800,
        interval : 2000
    }, settings);

    var opts = [];
    opts = $.extend({}, $.fn.slide_func.defaults, settings);

    return this.each(function () {

        var _this = this;

        $.fn.extend(this, slide_func);
        this.opts = opts;
        _this.init();
    });
};


