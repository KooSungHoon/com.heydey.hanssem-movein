Number.prototype.numberFormat = function(){
    if(this==0) return 0;
 
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
 
    return n;
};

if (!Array.prototype.remove) {
	Array.prototype.remove = function(val, all) {
		var i, removedItems = [];
		if (all) {
			for(i = this.length; i--;){
				if (this[i] === val) removedItems.push(this.splice(i, 1));
			}
		}
		else {  //same as before...
			i = this.indexOf(val);
			if(i>-1) removedItems = this.splice(i, 1);
		}
	    return removedItems;
	};
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}


$(function(){
	
	$.ajaxSetup({
		async : false,
		cache : false,
		beforeSend : function(xhr){
			xhr.setRequestHeader("ajax",true);
		},
		/*	,complete : function(xhr, textStatus){

				
		}*/
		error: function(xhr, textStatus, errorThrown){
			if(SERVER_TYPE == "LOCAL" || SERVER_TYPE == "DEV")   	    
				UI.alert(SYSTEM_ERROR_MESSAGE);
		}	
	});
});

var Common = {};

/**
 * Ajax 로그인 체크
 * 
 * Ajax success 맨위에 아래 소스 추가
 */
Common.ajaxGoLogin = function(data){
	/* ajax, load함수를 사용했을 때 아래 조건문으로 처리 됩니다. */
	if(!$.isPlainObject(data)){
		if(data.indexOf("notLogin") >= 0)
			Common.loginPopupLayer();
		return true;
	}
	
	/* data.resultCode가 notLogin이면 로그인 페이지로 이동합니다. */
	if(data.resultCode == "notLogin") {
		Common.loginPopupLayer();
		return true;
	}
	
	return false;
};


	
/**
 * 팝업 윈도우 화면의 중간에 위치.
 * 
 * @param winUrl 새창 url
 * @param winName 새창 이름
 * @param winWidth 창 넓이
 * @param winHeight 창 높이
 * @param winScroll 스크롤 여부 (yes|no)
 * @param winResize 리사이즈 여부 (yes|no)
 * @param winLeft 창 좌측 위치 값이 없으면 해상도 가로값
 * @param winTop 창 탑 위치 값이 없다면 해상도 세로값 
 * 
 * 예) Common.popUpWindow('주소','윈도우이름',500,400,'yes','no');
 * 
 */
Common.popUpWindow = function( winUrl, winName, winWidth, winHeight, winScroll, winResize, winLeft, winTop) {
	if(typeof(winLeft)=="undefined") winLeft = parseInt((window.screen.width-parseInt(winWidth))/2, 10); //해상도가로
	if(typeof(winTop)=="undefined") winTop = parseInt((window.screen.height-parseInt(winHeight))/2, 10); //해상도세로
	if( ((window.screen.height-80)-winHeight)<0 ){
		winHeight = window.screen.height-80;
		winTop = 0;
	}
	var newWin=window.open(winUrl, winName,"width="+winWidth+",height="+winHeight+",scrollbars="+winScroll+",resizable="+winResize+",left=" + winLeft + ",top=" + winTop+",directories=no,status=no,menubar=no");
	if(newWin) newWin.focus();
};


/* 회원가입 */
Common.goRegist = function(){	
	document.location.href = SERVER_HTTPS_URL + "/customer/newMemberIntro.do";
};

/* 바닥 로그인 */
Common.goLogin = function(){	
	location.href = SERVER_HTTPS_URL + "/customer/mallLoginMain.do?returnUrl="+encodeURIComponent(location.href);
};

/* 바닥 로그인 */
Common.goLoginUrl = function(url){	
	location.href = SERVER_HTTPS_URL + "/customer/mallLoginMain.do?returnUrl="+encodeURIComponent(url);
};

Common.goUrl = function(url){	
	location.href = SERVER_URL + url;
};

Common.goSSLUrl = function(url){	
	location.href = SERVER_HTTPS_URL + url;
};

//로그인 레이어 팝업
Common.goLayerLogin = function(){	
	$.ajax({
        url      : "/customer/loginConfirmAjax.do",
        type     : 'get',
        dataType : 'json',
        cache    : false,
        async    : false,
        success  : function(json) {
        	if(json.loginConfirm == "login")
        	    UI.alert("이미 로그인되어 있습니다.");
        	else
        		Common.loginPopupLayer();
        }	
    });
};

/**
 * 로그아웃
 * @param returnUrl
 * 수정 16.11.01 로그아웃 실행 후, 페이지 이동처리 추가 (김동진)
 * 예) logout(); [로그아웃 후, 메인으로 이동(default)] 
 * 예) logout("void"); [로그아웃 후, 페이지 이동없음]
 * 예) logout("/csCenter/csMain.do"); [로그아웃 후, 특정페이지로 이동]
 */
Common.logout = function(returnUrl){	
	$.ajax({
        url      : "/customer/logout.do",
        type     : 'get',		
        dataType : 'json',
        cache    : false,
        async    : false,
        success  : function(json) {
        	if (typeof returnUrl === "undefined") {
        		location.href = "/";
        	} else if(returnUrl == "void") {
        		
        	} else {
        		location.href = encodeURIComponent(returnUrl);
        	}
        }	
    });
};

// 로그인 팝업
Common.loginPopupLayer = function(onlyCustLoginYN){
	
	//회원로그인만 가능한 여부
	onlyCustLoginYN = onlyCustLoginYN || "N";
	
	$("#loginPopupLayer").load("/customer/mallLoginSub.do", function(){
		$(this).openLayer({modal:true});
		if(onlyCustLoginYN == "Y"){
			$("#parentsTab").hide();
			$("div.layer_popup.login").find("div.ui-tab-contents.tab_body").css("border-top","0");
		}
	});	

};

// 상품상세에서 로그인 팝업
Common.loginPopupGoodsLayer = function(){

	$("#loginPopupLayer").load("/customer/mallLoginGoodsSub.do", function(){
		$(this).openLayer({modal:true});
	});	

};

Common.loginPopupClose = function(){
	$('#loginPopupLayer').empty().closeLayer();
};

/* 네이버 로그인 */
Common.goNaverLogin = function(returnUrl) {
	if (returnUrl != null && typeof(returnUrl) != "undefined") {
		Common.setCookie("oauthNaverCookieReturnUrl", returnUrl, 1);
	}
	Common.popUpWindow("/naverOauth/loginPopup.do", "naverAuthorizePopup", 460, 530, "no", "yes");
};

//*******************************링크 끝*******************************

/**
* 쿠키 셋팅
* @param name 쿠키이름
* @param value 쿠키값
* @param expiredays 날짜 ( 1:하루 )
*
* setCookie( "Notice", "done" , 1); 하루동안 쿠키 저장
*/
Common.setCookie = function( name, value, expiredays ){ 
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays ); 
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
};

/**
* 쿠키값 가져오기
* @param name 쿠키이름
* @return String 쿠키값
*
* getCookie(쿠키이름)
*/
Common.getCookie = function(name){
	var prefix = name + "=";
	var cookieStartIndex = document.cookie.indexOf(prefix);
	if (cookieStartIndex == -1)
		return "";
	var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
	if (cookieEndIndex == -1)
		cookieEndIndex = document.cookie.length;
	return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
};

/**
* 쿠키 소멸
* @param name 쿠키이름
*/
Common.clearCookie = function(name){
	var today = new Date();
	//어제 날짜를 쿠키 소멸 날짜로 설정한다.
	var expire_date = new Date(today.getDate() - 1);
	document.cookie = name + "= " + "; path=/; expires=" + expire_date.toGMTString();
};

String.prototype.toInt = function () {
	if(typeof this == 'string') {
		if (/^-/.test(this)) {
	        return this.replace(/\..*$/g, '').replace(/[^\d]/g, '') * -1;
	    } else {
	        return this.replace(/\..*$/g, '').replace(/[^\d]/g, '') * 1;
	    }	
	}
};
String.prototype.toNum = function () {
	if(typeof this == 'string') {
		if (/^-/.test(this)) {
	        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '');
	    } else {
	        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '');
	    }	
	}
};
String.prototype.toNum2 = function (type) {
	if(typeof this == 'string' || type == "A") {
		if (/^-/.test(this)) {
	        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '') * -1.0;
	    } else {
	        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '') * 1.0;
	    }	
	}
};
String.prototype.numberFormat = function (type) {
	var ret = "";
	if(typeof this == 'string' || type == "A") {
		var num = (this.toNum2("A") + '').split(/\./);
		var commal = function (text) {
			var ret = text.replace(/(\d)(\d{3},)/g, '$1,$2');
			if (ret == text) return ret;
			return commal(ret);
		};
		var commar = function (text) {
			var ret = text.replace(/(,\d{3})(\d)/g, '$1,$2');
			if (ret == text) return ret;
			return commar(ret);
		};
		var ret = commal(num[0].replace(/(\d)(\d{3})$/g, '$1,$2'));
		if (num.length > 1) {
			ret += '.' + commar(num[1].replace(/^(\d{3})(\d)/g, '$1,$2'));
		}
	}
	
	return ret;
};

//3자리 콤마 구분
Common.GetNumberFormat = function(str) {
	return str.numberFormat("A");
};


//히든생성
Common.makeHidden = function(hiddenName, hiddenValue) {
  var objHidden = document.createElement("input");
  objHidden.type = "hidden";
  objHidden.id = hiddenName;
  objHidden.name = hiddenName;
  objHidden.value = hiddenValue;
  
  return objHidden;
};

/* 관심상품 담기 */
Common.addWishList = function(gdsNo, fnc){
	$.ajax({
        url      : "/goods/insertWishList.do",
        type     : 'post',		
        data	 : {gdsNo : gdsNo},
        dataType : 'json',
        cache    : false,
        async    : false,
        success  : function(json) {
        	
        	/* L: 로그인 필요, Y : 위시리스트 등록, A : 중복 */
        	if(json.wishResult == "L"){
        		UI.confirm("관심상품은 로그인후 사용 가능합니다. 로그인을 하시겠습니까?")
        		.done(function(){	Common.goLayerLogin();	})
        		.fail(function(){});
        	}else if(json.wishResult == "Y"){
        		UI.alert("관심상품에 상품이 등록되었습니다.");
        	}else if(json.wishResult == "A"){
        		UI.alert("이미 관심상품에 등록된 상품입니다.");
        	}
        		
    		if($.isFunction(fnc))
    			fnc(json.wishResult);
        }	
    });
};

/**
 * JSP -> Controller Base64 암복호화 처리 (한글깨짐 해결)
 * User : Base64.encode(str);
 * 2014.09.23 백승익 추가
 * */
var Base64 = {		 
		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	 
		// public method for encoding
		encode : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
	 
			input = Base64._utf8_encode(input);
	 
			while (i < input.length) { 
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
	 
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
	 
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
	 
				output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
			}
			return output;
		},
	 
		// public method for decoding
		decode : function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
	 
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	 
			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
	 
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
	 
				output = output + String.fromCharCode(chr1);
	 
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = Base64._utf8_decode(output);
			return output;
		},
	 
		// private method for UTF-8 encoding
		_utf8_encode : function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		},
	 
		// private method for UTF-8 decoding
		_utf8_decode : function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
	 
			while ( i < utftext.length ) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
		
};

Common.commentVideoUrl = function(videoUrl){
	
	var youtubeVideoUniqueVal;
	var youtubeIframeUrl = "https://www.youtube.com/embed/";
	var param = "?wmode=opaque";	//레이어가 밑으로 깔리는 현상 방지
	
	/* 유투브 */
	if(videoUrl.indexOf("/youtu.be/") > -1){
		youtubeVideoUniqueVal = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
		return youtubeIframeUrl + youtubeVideoUniqueVal+param;
	}else if(videoUrl.indexOf("//www.youtube.com/embed/") > -1){
		return videoUrl + param;
	}else if(videoUrl.indexOf("//www.youtube.com/watch?v=") > -1){
		youtubeVideoUniqueVal = videoUrl.substring(videoUrl.lastIndexOf("=") + 1);
		return youtubeIframeUrl + youtubeVideoUniqueVal + param;
	}
	
	/* 네이버 */
	if(videoUrl.indexOf("//serviceapi.nmv.naver.com/flash/convertIframeTag.nhn") > -1){
		if(videoUrl.indexOf("&width") > -1){
			return  videoUrl.substring(0, videoUrl.indexOf("&width")) + param;
		}else{
			return videoUrl + param;
		}			
	}
	
	return "";
};
// Failysite 선택
function goFamilySite(fUrl) {
	if(fUrl != "") {
		window.open(fUrl, '_blank');	
	}
}
// 즐겨찾기 추가
function addFavorite(){
	//window.external.AddFavorite("http://www.mall.hanssem.com/main.html","[한샘] 가고 싶은 곳, 머물고 싶은 곳");
	//var title = document.title; //현재 보고 있는 페이지의 Title
	var title = "[한샘] 가고 싶은 곳, 머물고 싶은 곳"; //몰메인
	var url = "http://www.mall.hanssem.com/main.html";//location.href; //현재 보고 있는 페이지의 Url
	if(window.sidebar && window.sidebar.addPanel){ // Firefox
		window.sidebar.addPanel(title, url,"");
	}else if(window.opera && window.print){ // Opera
		var elem = document.createElement('a');
		elem.setAttribute('href',url);
		elem.setAttribute('title',title);
		elem.setAttribute('rel','sidebar');
		elem.click();
	}else if( navigator.userAgent.search('Trident') != -1 ){ // Internet Explorer
		window.external.AddFavorite( url, title);
	}else{
		alert("이용하시는 웹 브라우저는 기능이 지원되지 않습니다.\n\nCtrl+D 키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
		return true;
	}
}

// 로그인 여부
Common.cookieIsLogin = function(){ 

	var cookie_is_login = false;
	var cookie_login_id = Common.getCookie("loginCookieId");
	
    if (cookie_login_id != null && cookie_login_id != "") {
    	cookie_is_login = true;
    }
    
    return cookie_is_login;
};

/**
* 모바일 여부
* @return boolean
*/
Common.isMobile = function(){	
	try {
		var deviceChannel = Base64.decode(Common.getCookie("deviceChannel"));
		if( $.trim(deviceChannel) != "" ) {
			return true;
		} else {
			return false;
		}
	} catch(e) {
		if (window.console) {console.log(e);}
	}
	return false;
};

function footerPopup(urls, _width, _height){
	window.open(urls,'HANSSEM','top=0,left=0,width='+_width+', height='+_height+',scrollbars=no,resizable=no');
}

function goShopInfo(){
	var openNewWindow = window.open("about:blank");
	openNewWindow.location.href = "http://company.hanssem.com/customer_support/location_way/shop.do";
}

/**
 * SMS 인증 번호 확인
 * @param emmaCerfNum 인증키
 * @param cerfiOwnPhone 인증번호
 * @returns {Boolean}
 */
function cerfiCheck(emmaCerfNum, cerfiOwnPhone) {
	var resultCd = false;
	$.ajax({
		url: "/customer/checkCerfNumAjax.do",
		type: "post",
		data: { "emma_cerf_num" : emmaCerfNum, "cerfi_own_phone": cerfiOwnPhone },
		dataType : 'json',
		async : false,
		cache : false,
		success: function(json) {
			if(json.resultCode == "success") {
				resultCd = true;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			
		}
	});
	
	return resultCd;
}

/*
* 브라우저 ie6, ie7, ie8 접속시 
* 안내페이지로 분기
*/

var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);

if( (Common.getCookie("bwflag") =="ie8") || (Common.getCookie("bwflag") =="ie7") || (Common.getCookie("bwflag") =="ie6") ){//현재버전으로 보기 했음

}else{//현재버전으로 보기 안했을경우
	
	if((navigator.userAgent.toLowerCase().indexOf('msie 8') != -1) ||  (trident !=null && trident[1] == '4.0')){
		//location.href = "/init_info.html";
	}else if(navigator.userAgent.toLowerCase().indexOf('msie 7') != -1){
		location.href = "/init_info.html";
	}else if(navigator.userAgent.toLowerCase().indexOf('msie 6') != -1){
		location.href = "/init_info.html";
	}
}






/* -------------------------------- 공통 레이어 ----------------------------- */
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
/* // -------------------------------- 공통 레이어 ----------------------------- */

//선물매출 쿠키 생성
var analysisGiftCookie = {
	cookie_option: {
		name: "",
		separator: ",",
		expires: 30,
		path : '/',
		max : 10,
		datemax : 3,
	},
	addZero : function (number){
		if (number < 10) return "0" + number;
		return number;
    },
	getCurTime : function() {
		var d = new Date();
		var mon = this.addZero(d.getUTCMonth() + 1);
		var date = this.addZero(d.getUTCDate());
		var hour = this.addZero(d.getUTCHours()+9); // 영국시간+9 = 한국시간
		var min = this.addZero(d.getUTCMinutes());
		return mon + "" + date + "" + hour + "" + min;
	},
	getReferer : function(_tp) {
		if (_tp == "CATEGORY") {
			if (location.href.indexOf("referer=outer") > -1) {
				return "outer";
			} else if (location.href.indexOf("referer=email") > -1) {
				return "email";
			} else if (location.href.indexOf("gnb=0100148") > -1) {
				return "gnb";
			} else if (location.href.indexOf("templateType=03") > -1) {
				return "main";
			} else if (location.href.indexOf("categoryall=") > -1) {
				return "";
			} else {
				return "lnb";
			}
		}
		if (_tp == "PLAN") {
			if (location.href.indexOf("referer=outer") > -1) {
				return "outer";
			} else if (location.href.indexOf("referer=email") > -1) {
				return "email";
			} else if (location.href.indexOf("gnb=0100148") > -1) {
				return "gnb";
			} else if (location.href.indexOf("planshp=category_") > -1) {
				return "planshp";
			} else if (location.href.indexOf("wlp=") > -1) {
				return "lnb";
			} else {
				return "lnb"; // 위에 해당되지 않는경우 referer='lnb' 2017-05-16 by.박형준
			}
		}
		// _tp == "GOODS" 상품은 컨트롤러단에서 처리 2017-05-18 by.박형준
	},
	set : function(_tp, _val, _referer) {
		if (_tp == "CATEGORY") {
			this.cookie_option.name = "HS_RECENT_CTGNOS";
			this.cookie_option.datemax = 3;
		}
		
		var cookies_str = _val + "|" + this.getCurTime() + "|" + _referer;
		var arrCookieValue = Common.getCookie(this.cookie_option.name).split(this.cookie_option.separator);
		for(var i=0; i < arrCookieValue.length ;i++) {
			if (arrCookieValue[i].split("|")[0] == _val) {
				arrCookieValue[i] = "";
			}
		}
		cookies_str = cookies_str + this.cookie_option.separator;
		for( var i=0; i < arrCookieValue.length ;i++ ){
			if( arrCookieValue[i] != "" && i < this.cookie_option.max - 1 ){
				if( i < this.cookie_option.datemax - 1 ){ // 최근3건만 ◾대카번호-중카번호-소카번호|MMddHHmm|referer
					cookies_str += arrCookieValue[i] + this.cookie_option.separator;
				}
				else{ // 나머지 7건 ◾대카번호-중카번호-소카번호
					cookies_str += arrCookieValue[i].split("|")[0] + "||" + this.cookie_option.separator;
				}
			}
		}
		Common.setCookie(this.cookie_option.name, cookies_str, this.cookie_option.expires);
	}
}
function goAnswerList(url){
	if(!Common.cookieIsLogin()){
		UI.confirm("비회원의 경우, 문의 내용에 대한 답변을 이메일로 못 받으신 경우에는<br/>고객센터(1688-4945)로 문의해주시기 바랍니다.<br/>로그인하시겠습니까?",{
	        confirmLabel : "예",
	        cancelLabel : "아니오"
	    }).done(function(){
	        location.href= SERVER_HTTPS_URL+url;
	    });
	}else{
		location.href= SERVER_HTTPS_URL+url;
	}
}

//*******************************날짜관련 함수 SART *******************************
/**
 * 현재일부터 theOffsetInSeconds 만큼 변경된 날짜를 얻는다. (yyyyMMddHHmmss)
 * @returns 20170630183255
 * @author 김동진
 * @since 2017.06.30
 */
Common.getStrDateInSeconds = function(theOffsetInSeconds){
	var strFullDate;
	$.ajax({
        url      : "/common/getStrDateInSeconds.do",
        type     : 'get',
        data     : {"theOffsetInSeconds" : theOffsetInSeconds},
        dataType : 'text',
        cache    : false,
        async    : false,
        success  : function(result) {
        	strFullDate = result;
        }
    });
	return strFullDate;
};

//*******************************날짜관련 함수 END *******************************

/**
 * 스트링 변환
 * var str = "abc"; a 를 f 로 바꿀때   str.replaceAll("a","f")  형태로 사용한다.
 * 바꿀 대상 스트링 중에 정규식 표현 문자 『  . 또는 / 또는 (  또는 )   』
 * 가 들어 있을 경우 \\ (역슬래시 두개) 를 앞에 붙여서 표현한다.
 * 예) var str = "12.34"; 에서 . 을 "" 로 replace 할 경우  replaceStr(str, "\\.","");
 * @param from 바꿀 대상 스트링
 * @param to 목적 스트링
 * @return string
 */
//////////////////////////////////////////////////////////////////////
//혁신 프로젝트 수정
//1. 작업자 : 신호섭
//2. 용도 : String객체에 replaceAll 추가
//BEGIN
String.prototype.replaceAll = function(from, to) {
	if (typeof this != "string") return "";
    return this.replace(new RegExp(from, "g"), to);
}
//END
//////////////////////////////////////////////////////////////////////