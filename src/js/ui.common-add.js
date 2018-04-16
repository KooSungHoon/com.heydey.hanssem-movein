/**
 * 공통 UI 요소 적용
 * @version 2016.01.28
 */

/* -------------------------------- 공통 레이어 (상품상세) ----------------------------- */
function commonModalFn(objID){
	$(".layer_mask").show();
	$(".layer_mask").css({"opacity":0.6});
	$("#"+objID).css("margin-top", -($("#"+objID).height()/2));
	$("#"+objID).css("margin-left",-($("#"+objID).width()/2));
	$("#"+objID).fadeIn();
	$(".commonModal_close a").click(function() {
		$("#"+objID).hide();
		$(".layer_mask").fadeOut();
	});
	$(".layer_mask").click(function() {
		$("#"+objID).hide();
		$(".layer_mask").fadeOut();
	});
}
/*
<a href="javascript:commonModalFn('kc_info');">
<div id="kc_info" style="display:none;">
	레이어
</div>
<div class="layer_mask"></div>
*/
/* ------------------------------ // 공통 레이어 ---------------------------- */


/* ------------------------------- 공통 슬라이드 (메인) ---------------------------- */
(function($){
	$.fn.mall_slide = function (settings) {
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
		opts = $.extend({}, $.fn.mall_slide.defaults, settings);

		return this.each(function () {

			var _this = this;

			$.fn.extend(this, mall_slide);
			this.opts = opts;
			_this.init();	
		});
	};
	var mall_slide = {
		init : function(){
			var _this =  this;
			this.list_wrap = $(this).children(":first-child");
			this.list = this.list_wrap.children();
			this.totalCnt = this.list.length;
			this.prev = $(this).find(".mall_slide_prev");
			this.next = $(this).find(".mall_slide_next");
			this.pasing_wrap = $(this).find(".mall_slide_btns");
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
			this.slideCnt = $(this).find(".slide_ord_num");
			this.slideTot = $(this).find(".slide_ord_tot");
			this.limited = this.opts.limited;

			if(this.totalCnt <= 1) {
				this.prev.hide();
				this.next.hide();
				return false;
			}

			this.slideTot.text(this.totalCnt);

			if(this.limited) this.prev.css("opacity",0.4);

			this.prev.on('click',function() {
				_this.action(-1);
			});

			this.next.on('click',function() {
				_this.action(1);
			});

			this.list.on("touchstart", function(e) {
				_this.stopAuto();
				if(e.type == "touchstart" && e.originalEvent.touches.length <= 1) {
					_this.startX = e.originalEvent.touches[0].pageX;
					_this.startY = e.originalEvent.touches[0].pageY;
				}
			});

			this.list.on("touchmove", function(e) {
				if(e.type == "touchmove" && e.originalEvent.touches.length <= 1){
					_this.moveX = e.originalEvent.touches[0].pageX - _this.startX;
					_this.moveY = e.originalEvent.touches[0].pageY - _this.startY;

					if(_this.moveX > 20){
						_this.leftMove = true;
						_this.rightMove = false;
					}
					
					if (_this.moveX < -20){
						_this.leftMove = false;
						_this.rightMove = true;
					}
				}
			});

			this.list.on("touchend", function(e) {
				if(_this.leftMove){
					_this.action(-1);
				}

				if(_this.rightMove){
					_this.action(1);
				}

				if(_this.auto) _this.autoAction();
			});

			$(this).bind("mouseenter",function() {
				_this.stopAuto();
			});

			$(this).bind("mouseleave",function() {
				_this.autoAction();
			});

			if(this.auto) this.autoAction();

			if(this.pasing.size() > 0){

				try{
					var img_length1 = this.pasing.eq(0).find("img").attr("src").length - 3;
					this.imgType1 = this.pasing.eq(0).find("img").attr("src").substr(img_length1 , 3);

					this.pasing.eq(0).find("img").attr("src", this.pasing.eq(0).find("img").attr("src").replace("."+this.imgType1,"_on."+this.imgType1));
				}catch(e){}
				this.pasing.eq(0).addClass("on");
				this.pasing.click(function() {
					var dc = 1;
					if(_this.order <= $(this).index()){
						dc = 1;
					}else{
						dc = -1;
					}
					_this.action(dc, $(this).index());
				});
			}
		},

		action : function(d, pNum) {
			var _this = this;

			if(pNum == this.order) return false;
			if($(this).find(":animated").size() >= 1) return false;

			if(this.limited){
				if(d == 1){
					if(this.order >= this.totalCnt - 1){
						return false;
					}
				}else{
					if(this.order <= 0){
						return false;
					}
				}
			}

			this.list.eq(this.order).stop().animate({"marginLeft": -d*100+"%"},this.speed, function() {
				$(this).css({"position" : "absolute","top" : 0, "left" : "100%","marginLeft":0});
			});

			if(d == 1){
				if(this.order >= this.totalCnt - 1){
					this.order = -1;
				}
				
				if(pNum >= 0){
					this.next_order = pNum;
				}else{
					this.next_order = this.order + 1;
				}

				this.list.eq(this.next_order).stop().animate({"left":0},this.speed, function() {
					$(this).css("position","relative");
					if(pNum >= 0){
						_this.order = pNum;
					}else{
						_this.order++;
					}

					//콜백 함수
					_this.actionCallBack();
				});
			}else{
				if(pNum >= 0){
					this.next_order = pNum;
					this.order = pNum;
				}else{
					this.next_order = this.order - 1;

					if(this.order <= 0){
						this.next_order = this.totalCnt - 1;
						this.order =  this.totalCnt - 1;
					}else{
						this.order--;
					}
				}
				this.list.eq(this.next_order).css("left","-100%").stop().animate({"left":"0"}, this.speed, function() {
					$(this).css("position","relative");

					//콜백 함수
					_this.actionCallBack();
				});
			}

			if(this.pasing.size() > 0){
				this.pasing.each(function(n) {
					try{
						if(_this.next_order == n){
							$(this).addClass("on");
							if($(this).find("img").attr("src").indexOf("_on") == -1){
								$(this).find("img").attr("src", $(this).find("img").attr("src").replace("."+_this.imgType1,"_on."+_this.imgType1));
							}
						}else{
							$(this).removeClass("on");
							$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on."+_this.imgType1,"."+_this.imgType1));
						}
					}catch(e){}
				});
			}

			this.slideCnt.text(this.next_order + 1); // 페이지 숫자 표시 태그 클래스 .slide_ord_num
		},

		autoAction : function() {
			var _this = this;
			
			_this.stopAuto();
			if(this.auto){
				this.auto_obj = setInterval(function() {
					_this.action(1);
				},_this.interval_time);
			}
		},

		stopAuto : function() {
			if(this.auto){
				clearInterval(this.auto_obj);
			}
		},

		actionCallBack : function() {
			var _this = this;
			
			if(this.limited){
				if(this.order >= this.totalCnt - 1){
					this.next.css("opacity",0.4);
				}else{
					this.next.css("opacity",1);
				}

				if(this.order <= 0){
					this.prev.css("opacity",0.4);
				}else{
					this.prev.css("opacity",1);
				}
			}
		}
	};
})(jQuery);
/*
$(document).ready(function() {
	$(".promotion_side").mall_slide({
		speed : 400,				//  이미지 넘어가는 속도
		interval_time : 5000,		//  동작 간격 시간 1000 = 1초
		auto : true	,		//  자동 슬라이드 true, false
		limited : false // 이미지 유한 슬라이드
	});
});
*/

/* ----------------------------- // 공통 슬라이드 --------------------------- */



/* --------------------------------- fade tab (메인) ------------------------------- */
(function($){
	$.fn.fade_tab = function (settings) {
		settings = jQuery.extend({
			event_type : 'click'
		}, settings);

		var opts = [];
		opts = $.extend({}, $.fn.fade_tab.defaults, settings);

		return this.each(function () {
			var _this = this;

			$.fn.extend(this, fade_tab);
			this.opts = opts;
			_this.init();	
		});
	};
	var fade_tab = {
		init : function() {
			var _this = this;
			this.tab_titles = $(this).find(".fade_tab_tit").children();
			this.cont_wrap = $(this).find(".fade_tab_cont");
			this.tab_cont_list = this.cont_wrap.children();
			this.amount = this.tab_cont_list.size();
			this.event_type = this.opts.event_type;
			this.auto = this.opts.auto;
			this.auto_order = 0;
			this.cont_order = 0;
			this.setTime = "";
			this.imgType = '';
			this.fadeSpeed = this.opts.fadeSpeed;
			this.interval = this.opts.interval;
			this.opener = this.opts.opener;
			this.closer = this.opts.closer;


			if(this.tab_titles.eq(0).find("img").size() > 0){
				var img_length = this.tab_titles.eq(0).find("img").attr("src").length - 3;
				this.imgType = this.tab_titles.eq(0).find("img").attr("src").substr(img_length , 3);
			}

			this.tab_titles.on(this.event_type, function() {
				var title_order = $(this).index();
				if(title_order == _this.cont_order) return false;
				_this.auto_order = title_order;
				_this.actFade(title_order);
			});

			if(this.amount <= 1) return false;

			if(this.auto){
				this.autoFade();
			}

			/* 마우스 오버 이벤트 영역 */
			$(this).mouseenter(function() {
				this.stopAuto();
			});

			$(this).mouseleave(function() {
				this.autoFade();
			});
			/* // 마우스 오버 이벤트 영역 */

			
			/* 개체 클릭시 실행 초기화 */
			try{
				this.opener.click(function() {
					
					_this.tab_titles.eq(0).trigger('click');
					_this.tab_titles.eq(0).addClass("on");
					_this.autoFade();
				});
				
				this.closer.click(function() {
					_this.stopAuto();
				});
			}catch(e){}
			/* // 개체 클릭시 실행 초기화 */
		},

		actFade : function(n){
			var _this = this;
			_this.tab_titles.each(function(k) {
				if(k == n){
					$(this).addClass("on");
					if($(this).find("img").size() > 0){
						$(this).find("img").attr("src", $(this).find("img").attr("src").replace("."+_this.imgType,"_on."+_this.imgType));
					}
				}else{
					$(this).removeClass("on");
					if($(this).find("img").size() > 0){
						$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on."+_this.imgType,"."+_this.imgType));
					}
				}
			});
			_this.tab_cont_list.eq(n).css({
				"left":"0",
			}).stop().animate({"opacity":1},_this.fadeSpeed, function(){
				$(this).css("position","static");
				_this.tab_cont_list.eq(_this.cont_order).css({"position":"absolute","left":"-2000%","opacity":0});
				_this.cont_order = n;
			});
		},

		autoFade : function(){
			var _this = this;
			
			_this.stopAuto();
			if(_this.auto){
				_this.setTime = setInterval(function(){
					_this.auto_order++;
					if(_this.auto_order >= _this.amount) _this.auto_order = 0;
					_this.actFade(_this.auto_order);
				}, _this.interval);
			}
		},

		stopAuto : function(){
			var _this = this;
			clearInterval(this.setTime);
		}
	};
})(jQuery);

/*
$(document).ready(function() {
	$(".main_pop_tab").fade_tab({
		event_type : "click",
		fadeSpeed : 200,
		interval : 2500,
		auto : true
	});
});
*/

/* 개체 초기화 필요한 경우
$(document).ready(function() {
	$(".main_pop_tab").fade_tab({
		event_type : "click",
		fadeSpeed : 200,
		interval : 2500,
		auto : true,
		opener : $(".main_pop_btn"),
		closer : $(".main_pop_close")
	});
});
*/
/* --------------------------------- // fade tab ------------------------------- */


/* --------------------------- vertical roll (메인) ----------------------- */
(function($){
	$.fn.vert_roll = function (settings) {
		settings = jQuery.extend({
			auto : true,
			btn_prev : null,
			btn_next : null,
			btn_pasing : null,
			list : null,
			speed : 800,
			interval : 2000
		}, settings);

		var opts = [];
		opts = $.extend({}, $.fn.vert_roll.defaults, settings);

		return this.each(function () {
			var _this = this;

			$.fn.extend(this, vert_roll);
			this.opts = opts;
			_this.init();	
		});
	};
	var vert_roll = {
		init : function() {
			var _this = this;
			this._current = 0;
			this._moveNode = $(this).children().first();
			this._height = this._moveNode.children().outerHeight();
			this.leftBtn = $(this).find(".roll_left img");
			this.rightBtn = $(this).find(".roll_right img");
			this._cnt = this._moveNode.children().size();
			this.intervalTime = this.opts.interval;
			this.auto = this.opts.auto;
			this.view_cnt = this.opts.view_cnt;
			this.speed = this.opts.speed;
			this.timer = "";

			if(this._cnt <= 1) return false;

			$(this).css({
				"position" : "relative",
				"overflow" : "hidden",
				"height" : this.view_cnt*this._height
			});

			this.leftBtn.click(function() {
				_this.next_();
			});

			this.rightBtn.click(function() {
				_this.prev_();
			});

			$(this).mouseenter(function() {
				_this.stopPlay();
				$(this).css("height","auto");
			});

			$(this).mouseleave(function() {
				$(this).css("height","87px");
				_this.autoPlay();
			});

			this.autoPlay();
		},

		prev_ : function() {
			var _this = this;
			_this._moveNode.css('marginTop',-_this._height);
			_this._moveNode.prepend(_this._moveNode.children().eq(_this._cnt-1));
			_this._moveNode.stop().animate({'marginTop':0}, _this.speed, function() {
				_this._current--;
			});
		},

		next_ : function() {
			var _this = this;
			_this._moveNode.stop().animate({'marginTop':-_this._height}, _this.speed, function() {
				_this._current++;
				$(this).append($(this).children().eq(0));
				$(this).css('marginTop',0);
			});
		},

		autoPlay : function() {
			var _this = this;
			
			_this.stopPlay();
			if(_this.auto){
				_this.timer = setInterval(function() {
					_this.next_();
				}, _this.intervalTime);
			}
		},

		stopPlay : function() {
			var _this = this;
			clearInterval(_this.timer);
		}
	};
})(jQuery);
/*
$(document).ready(function() {
	$(".head_recomm_roll").vert_roll({
		view_cnt:1,
		speed : 400,
		interval : 2000,
		auto : true
	});
});
*/
/* ------------------------------- // vertical roll ---------------------------- */


/* -------------------------------- contents tab (사용여부 확인 후 미사용시 삭제) ---------------------------- */
(function($){
	$.fn.contsTab = function (settings) {
		settings = jQuery.extend({
			event_type : 'click'
		}, settings);

		var opts = [];
		opts = $.extend({}, $.fn.contsTab.defaults, settings);

		return this.each(function () {
			var _this = this;

			$.fn.extend(this, contsTab);
			this.opts = opts;
			_this.init();	
		});
	};
	var contsTab = {
		init : function() {
			var _this = this;
			this.tab_titles = $(this).find("."+this.opts.tab_title).children();
			this.tab_cont_list = $(this).find("."+this.opts.tab_conts);
			this.amount = this.tab_cont_list.size();
			this.event_type = this.opts.event_type;
			this.auto = this.opts.auto;
			this.auto_order = 0;
			this.setTime = "";
			this.interval = this.opts.interval;
			
			try{
				this.imgType1 = this.tab_titles.eq(0).find("img").attr("src").substr(img_length1 , 3);
			}catch(e){
				this.imgType1 = "jpg";
			}

		
			this.tab_titles.on(this.event_type, function() {
				var _order = $(this).index();
				_this.auto_order = _order;

				_this.tab_titles.each(function(n) {
					if(_order == n){
						$(this).addClass("on");
						try{
							$(this).find("img").attr("src", $(this).find("img").attr("src").replace("."+_this.imgType1,"_on."+_this.imgType1));
						}catch(e){}
					}else{
						$(this).removeClass("on");
						try{
							$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on."+_this.imgType1,"."+_this.imgType1));
						}catch(e){}
					}
				});

				_this.tab_cont_list.each(function(k) {
					if(_order == k){
						$(this).show();
					}else{
						$(this).hide();
					}
				});
			});

			if(this.auto){
				this.autoShow();
			}

			$(this).mouseenter(function() {
				this.stopAuto();
			});

			$(this).mouseleave(function() {
				if(_this.auto){
					_this.autoShow();
				}
			});
		},

		autoShow : function(){
			var _this = this;
			_this.setTime = setInterval(function(){
				_this.tab_titles.eq(_this.auto_order).trigger(_this.event_type);
				_this.auto_order++;
				if(_this.auto_order >= _this.amount){
					_this.auto_order = 0;
				}
			}, _this.interval);
		},

		stopAuto : function(){
			_this = this;
			clearInterval(_this.setTime);
		}
	};
})(jQuery);
/* ------------------------------ // contents tab (사용여부 확인 후 미사용시 삭제) --------------------------- */


/* -------------------------------- 멀티슬라이드 (사용여부 확인 후 미사용시 삭제) ---------------------------- */
(function($){
	$.fn.slide_multi = function (settings) {
		settings = jQuery.extend({
			auto : false,
			btn_prev : null,
			btn_next : null,
			btn_pasing : null,
			list : null,
			speed : 800,
			interval : 2000,
			loop : true
		}, settings);

		var opts = [];
		opts = $.extend({}, $.fn.slide_multi.defaults, settings);

		return this.each(function () {

			var _this = this;

			$.fn.extend(this, slide_multi);
			this.opts = opts;
			_this.init();	
		});
	};
	var slide_multi = {
		init : function(){
			var _this =  this;
			this.list_wrap = $(this).children(":first-child");
			this.list = this.list_wrap.children();
			this.totalCnt = this.list.length;
			this.prev = $(this).find(".image_slide_left");
			this.next = $(this).find(".image_slide_right");
			this.pasing_wrap = $(this).find(".image_slide_btns");
			this.pasing = this.pasing_wrap.children();
			this.order = 0;
			this.next_order = 0;
			this.stop = false;
			this._auto = this.opts.auto;
			this._speed = this.opts.speed;
			this.interval_time = this.opts.interval_time;
			this.auto_obj = "";
			this.imgType1 = '';
			this.loop = this.opts.loop;
			this.leftMove = true;
			this.rightMove = true;

			this.list_wrap.css({
				"position" : "relative",
				"overflow" : "hidden"
			});

			try{
				this.list_wrap.prepend(this.list.eq(0).clone().css("visibility","hidden"));
			}catch(e){}
			
			this.list.each(function(n) {
				$(this).css({
						"position" : "absolute",
						"top" : 0,
						"width" : "100%",
						"backgroundColor" : "#fff"
					});
				if(n == 0){
					$(this).css("left",0);
				}else{
					$(this).css("left","100%");
				}
			});

			this.pasing.css("cursor","pointer");
			if(this.list.size() <= 1) {
				this.next.hide();
				this.prev.hide();
				this.pasing.hide();
				return false;
			}

			if(this.loop){
				this.prev.bind("click", function() {
					_this.action(-1, false);
				});
			}else{
				this._auto =  false;
				this.prev.css("opacity",0.3);
				this.leftMove = false;
			}

			this.next.bind("click", function() {
				_this.action(1, false);
			});

			
			$(this).bind("mouseenter",function() {
				_this.stopAuto();
			});

			$(this).bind("mouseleave",function() {
				_this.autoRolling();
			});


			$(this).on("touchstart", function(e) {
				_this.stopAuto();
				if(e.type == "touchstart" && e.originalEvent.touches.length <= 1) {
					this.startX = e.originalEvent.touches[0].pageX;
					this.startY = e.originalEvent.touches[0].pageY;
				}
			});

			$(this).on("touchmove", function(e) {
				if(e.type == "touchmove" && e.originalEvent.touches.length <= 1){
					this.moveX = e.originalEvent.touches[0].pageX - this.startX;
					this.moveY = e.originalEvent.touches[0].pageY - this.startY;
					if(this.moveX > 10 && this.leftMove){
						this.action(-1, false);	
					}else if (this.moveX < -10 && this.rightMove){
						this.action(1, false);
					}
				}
			});

			$(this).on("touchend", function(e) {
				_this.autoRolling();
			});

			if(this.pasing.size() != 0){
				var img_length1 = this.pasing.eq(0).find("img").attr("src").length - 3;
				this.imgType1 = this.pasing.eq(0).find("img").attr("src").substr(img_length1 , 3);

				this.pasing.bind("click", function() {
					if(!_this.stop){
						_this.next_order = $(this).index();
						if(_this.order == $(this).index()){
							return false;
						}else if(_this.order > $(this).index()){
							_this.action(-1, true);
						}else{
							_this.action(1, true);
						}
					}
				});
				try{
					this.pasing.eq(0).find("img").attr("src", this.pasing.eq(0).find("img").attr("src").replace("."+this.imgType1,"_on."+this.imgType1));
				}catch(e){}
			}

			this.autoRolling();
		},

		action : function(direction, pClick) {
			var _this = this;
			if(!this.stop){
				this.stop = true;
				if(!pClick){
					if(direction == 1){
						if(!this.loop){
							_this.prev.css("opacity",1.0);
							_this.prev.bind("click", function() {
								_this.action(-1, false);
							});
							_this.leftMove = true;
						}

						if(_this.order >= _this.totalCnt - 1){
							_this.next_order = 0;
						}else{
							_this.next_order = _this.order + direction*1;
						}
						
						if(_this.next_order >= _this.totalCnt - 1){
							if(!this.loop){
								_this.next.css("opacity",0.3);
								_this.next.unbind('click');
								_this.rightMove = false;
							}
						}
					}else if(direction == -1){
						if(!this.loop){
							_this.next.css("opacity",1.0);
							_this.next.bind("click", function() {
								_this.action(1, false);
							});
							_this.rightMove = true;
						}
						
						if(_this.order <= 0){
							_this.next_order = _this.totalCnt - 1;
						}else{
							_this.next_order = _this.order + direction*1;
						}

						if(_this.next_order <= 0){
							if(!this.loop){
								_this.prev.css("opacity",0.3);
								_this.prev.unbind('click');
								_this.leftMove = false;
							}
						}
					}
				}else{
					if(!this.loop){
						if(direction == 1){
							_this.prev.css("opacity",1.0);
							_this.prev.bind("click", function() {
								_this.action(-1, false);
							});
							
							if(_this.next_order >= _this.totalCnt - 1){
								_this.next.css("opacity",0.3);
								_this.next.unbind('click');
							}
						}else if(direction == -1){
							_this.next.css("opacity",1.0);
							_this.next.bind("click", function() {
								_this.action(1, false);
							});


							if(_this.next_order <= 0){
								_this.prev.css("opacity",0.3);
								_this.prev.unbind('click');
							}
						}
					}
				}

				this.list.eq(this.order).stop().animate({"left" : (-direction*100)+"%"},this._speed,function() {
					$(this).css("left",(direction*100)+"%");
				});

				this.list.eq(this.next_order).css("left", (direction*100)+"%").stop().animate({"left" : "0%"},this._speed,function() {
					_this.stop = false;
					_this.order = _this.next_order;
				});

				if(this.pasing.size() != 0){
					this.pasing.each(function(n){
						if(n  == _this.next_order){
							$(this).find("img").attr("src", $(this).find("img").attr("src").replace("."+_this.imgType1,"_on."+_this.imgType1));
							$(this).addClass("on");
						}else{
							$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on."+_this.imgType1,"."+_this.imgType1));
							$(this).removeClass("on");
						}
					});
				}

				this.actionCallBack();
			}
		},

		autoRolling : function() {
			var _this = this;
			if(this._auto){
				this.auto_obj = setInterval(function() {
					_this.action(1, false);
				},_this.interval_time);
			}
		},

		stopAuto : function() {
			clearInterval(this.auto_obj);
		},

		actionCallBack : function() {
			// 스라이드 액션 후 실행 함수
			// this.order 현재 페이지 숫자
			// this.next_order 다음 페이지 숫자
		}
	};
})(jQuery);
/* ------------------------------ // 멀티슬라이드 (사용여부 확인 후 미사용시 삭제) --------------------------- */

/* ------------------------------- 브랜드관 슬라이드 On /Off (메인) ---------------------------- */
(function($){
	$.fn.slide_3view_ect = function (settings) {
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
		opts = $.extend({}, $.fn.slide_3view_ect.defaults, settings);

		return this.each(function () {

			var _this = this;

			$.fn.extend(this, slide_3view_ect);
			this.opts = opts;
			_this.init();	
		});
	};
	var slide_3view_ect = {
		init : function(){
			var _this =  this;
			var _$this = $(this);
			this.list_wrap = $(this).children(":first-child");
			this.list = this.list_wrap.children();
			this.totalCnt = this.list.length;
			this.current = 0;
			this.last = this.totalCnt - 1;
			this.next = 1;
			this.slideCnt = $(this).find(".view3_num");
			this.slideTot = $(this).find(".view3_tot");
			this.prev = $(this).find(".view3_slide_prev");
			this.next = $(this).find(".view3_slide_next");
			this.pasing_wrap = $(this).find(".view3_page_btns");
			this.pasing = this.pasing_wrap.children();
			this.auto = this.opts.auto;
			this.speed = this.opts.speed;
			this.interval_time = this.opts.interval_time;
			this.auto_obj = "";
			this.imgType1 = '';
			this.stepNum = 0;

			try{
				if(this.totalCnt <= 2) {
					this.prev.hide();
					this.next.hide();
					return false;
				}

				this.slideTot.text(this.totalCnt);


				_$this.find('.main_ban_ls').each(function(n) {
					$(this).attr('id',n);
				});

				this.list.each(function(n) {
					if(n == 1){
						$(this).css({'left':'100%'});
					}
				});

				
				this.list.eq(0).addClass('active_ls');
				this.list.eq(0).addClass('active_ls').find(".main_ban_ls").eq(0).addClass('on');

				if(this.pasing.size() > 0){
					
					var img_length1 = this.pasing.eq(0).find("img").attr("src").length - 3;
					this.imgType1 = this.pasing.eq(0).find("img").attr("src").substr(img_length1 , 3);

					this.pasing.eq(0).addClass("on");
					this.pasing.eq(0).find("img").attr("src", this.pasing.eq(0).find("img").attr("src").replace("."+this.imgType1,"_on."+this.imgType1));

					this.pasing.click(function() {
						if(_this.current == $(this).index()) return false;
						_this.current = $(this).index();
						if(_this.current == _this.last){
							nextAdd = 0;
						}else{
							nextAdd = _this.current + 1;
						}

						_this.list.css({'z-index':'0'});
						_this.list.css({'left':'200%','position': 'absolute'});
						_this.list_wrap.css({'left':'0'});
						_this.list.eq(_this.current - 1).css({'left':'-100%', 'position': 'absolute'});
						_this.list.eq(_this.current).css({'left':'0', 'position': 'static'});
						_this.list.eq(nextAdd).css({'left':'100%', 'position': 'absolute', 'z-index':1});

						_this.actionCallBack();
					});
				}
				

				$(this).find(".main_ban_ls").mouseenter(function() {
					if($(this).parents(".view3_slide_list").hasClass("active_ls")) {
						_$this.find(".main_ban_ls").removeClass('on');
						$(this).addClass('on');
						_this.stepNum = _$this.find(".main_ban_ls").index($(this));
					}
				});

				this.prev.on('click',function() {
					_this.action_prev();
				});

				this.next.on('click',function() {
					_this.action_next();
				});

				$(this).bind("mouseenter",function(e) {
					//alert(e.target.getAttribute('class'));
					_this.stopAuto();
				});

				$(this).bind("mouseleave",function(e) {
					_this.autoAction();
				});

				if(this.auto) {
					this.autoAction();
				}
			}catch(e){}
		},

		action_prev : function() {
			var _this = this;
			var prevAdd = 0;

			this.list_wrap.stop().animate({'left':'100%'},{
				step : function(now, fx) {
					if(parseInt(now) > 50){
						prevAdd = _this.current - 2;
						_this.list.eq(prevAdd).css('left', '-200%');
					}
				},

				complete : function() {
					_this.current--;

					if(_this.current < 0){
						_this.current = _this.last;
						nextAdd = 0;
					}else{
						nextAdd = _this.current + 1;
					}

					_this.list.css({'z-index':'0'});
					_this.list_wrap.css({'left':'0'});
					_this.list.eq(_this.current - 1).css({'left':'-100%', 'position': 'absolute'});
					_this.list.eq(_this.current).css({'left':'0', 'position': 'static'});
					_this.list.eq(nextAdd).css({'left':'100%', 'position': 'absolute', 'z-index':1});

					_this.actionCallBack();
				}
			},this.speed);
		},

		action_next : function() {
			var _this = this;
			var nextAdd = 0;

			this.list_wrap.stop().animate({'left':'-100%'},{
				step : function(now, fx) {
					if(parseInt(now) <= -50){
						if(_this.current == _this.last - 1){
							nextAdd = 0;
						}else if(_this.current == _this.last){
							nextAdd = 1;
						}else{
							nextAdd = _this.current + 2;
						}
						_this.list.eq(nextAdd).css('left', '200%');
					}
				},

				complete : function() {
					_this.current++;

					if(_this.current > _this.last){
						_this.current = 0;
					}

					_this.list.css({'z-index':'0'});
					_this.list_wrap.css({'left':'0'});
					_this.list.eq(_this.current - 1).css({'left':'-100%', 'position': 'absolute', 'z-index':1});
					_this.list.eq(_this.current).css({'left':'0', 'position': 'static'});
	

					if(_this.current == _this.last){
						_this.next = 0;
					}else{
						_this.next = _this.current + 1;
					}

					_this.list.eq(_this.next).css({'left':'100%', 'position': 'absolute'});

					_this.actionCallBack();
				}
			},this.speed);
		},

		autoAction : function() {
			var _this = this;

			_this.stopAuto();
			if(this.auto){
				this.auto_obj = setInterval(function() {
					_this.stepList();
				},_this.interval_time);
			}
		},

		stopAuto : function() {
			if(this.auto){
				clearInterval(this.auto_obj);
			}
		},

		stepList : function(){
			var _this = this;

			this.stepNum++;
			if(this.stepNum > 11){
				this.stepNum = 0;
			}

			if(this.stepNum%4 == 0) this.action_next();
			
			$("#ts").text(this.stepNum);
			$(this).find(".main_ban_ls").removeClass('on');
			$(this).find(".main_ban_ls").eq(this.stepNum).addClass('on');

		},

		actionCallBack : function() {
			var _this = this;
			
			if(_this.pasing.size() > 0){
				_this.pasing.each(function(n) {
					if(_this.current == n){
						$(this).addClass("on");
						$(this).find("img").attr("src", $(this).find("img").attr("src").replace("."+_this.imgType1,"_on."+_this.imgType1));
					}else{
						$(this).removeClass("on");
						$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_on."+_this.imgType1,"."+_this.imgType1));
					}
				});
			}

			this.list.removeClass('active_ls');
			this.list.eq(this.current).addClass('active_ls');
			this.slideCnt.text(this.current + 1);

			this.stepNum = this.current*4;
			$(this).find(".main_ban_ls").removeClass('on');
			$(this).find(".main_ban_ls").eq(this.stepNum).addClass('on');
		}
	};
})(jQuery);
/* ------------------------------ // 브랜드관 슬라이드 On /Off (메인) --------------------------- */