/** 2015.12.16 공통 검색 정의
 *   1. 자동완성
 *   2. 최근검색어
 *   3. 추천(인기) 검색어
 *   4. 기획전
 *   
 *   history
 *   		1. 2016.01.28 : 인기검색어 관리자로 부터 조회 기능 삭제
 */
var _srchWiseLogParam = "";
$(function() {
	$("#_searchKey").placeholder();
	var _error_code = '001';
	var _key_event_call = false;
	var defaultSearchKey = $("#_searchKey").attr('holder');
	var defaultSearchLink = $("#_searchKey").attr('placeLink');
	$("#_searchKey").val(defaultSearchKey);
	var timeObj;
	var intervalSec = 1;
	var protocol = "https:" === window.location.protocol ? "https://" : "http://";
	var domain = "https:" === window.location.protocol ? "xsearch.hanssem.com:8443/ksf" : "xsearch.hanssem.com:7612/ksf";
	var _rootUrl = protocol + domain;
	
	setTimeout(function() {
		ranking.search();
	},0);
	
	/** 
	 *   검색버튼 선택시 호출
	 *   1. 검색어를 쿠키에 add(최신검색어 출력 용도)
	 *   2. 통합검색 화면 이동
	 */
	$("#wrap").click(function(e) {
		if(!$("#search_root").has(e.target).length) {
			$("#searchInfoPop").hide();
			if(ParamValidate.isEmpty($("#_searchKey").val())) {
				$("#_searchKey").val(defaultSearchKey);
			}
		}
	});
	

	$( "#searchButton").click(function() {
		if(!ParamValidate.isEmpty($("#_searchKey").val())) {
			if($("#_searchKey").val() == defaultSearchKey) {
				var openNewWindow = window.open('about:blank');
				openNewWindow.location.href=defaultSearchLink;
			}else{searchSubmit();}
		}else{
			searchSubmit();
		}
	});
	
	var searchSubmit = function() {
		$("#searchInfoPop").hide();
		q = $.trim($( "#_searchKey" ).val());
		
		if(ParamValidate.isEmpty(q)) {
			alert("검색어를 입력해 주십시오.");
		}else{
			recent.add(q);
			
			if(q == defaultSearchKey) {
				$("#_searchKey").val(defaultSearchKey);
				var openNewWindow = window.open('about:blank');
				openNewWindow.location.href=defaultSearchLink;
				_key_event_call = false;
			}else{
				$( "form[name=search-form]" ).attr("action","/search/search.do?searchKey=" + q + _srchWiseLogParam).submit();
			    _key_event_call = true;
			}
		}
		return false;
	};
	
	/** 
	 *   검색란 focus 시 호출
	 *   1. 검색 layer 표출
	 *   2. 조건에 따라 자동완성 view or 최신/추천 검색어 view 표출
	 *   	 * 검색어의 유무에 따라 자동완성 view or 최신/추천 검색어 view 표출
	 *      * 기획전 view는 무조건 표출
	 */
	$( "#_searchKey" ).on("focus", function() {
		if(!ParamValidate.isEmpty($("#_searchKey").val())) {
			if($("#_searchKey").val() == defaultSearchKey) $("#_searchKey").val('');
		}
		
		if(_error_code == '999') {
			$('#wrap').trigger("click");
			return false;
		}
		
		var _$categoryArea = $( '#wrap .all_category' );
		if ( _$categoryArea.is(':visible') ) {
			$( '#gnb_area .category > a' ).trigger("click");
		}
		
		$("#gnb_area").children().find("all_category").addClass("dp_none");
		var _$bottom_keysearch_root = $("#bottom_keysearch_root");
		var _$auto_sch_box = $("#auto_sch_box");
		
		$("#searchInfoPop").show();
		
		if($( "#_searchKey" ).val()) {
			_$bottom_keysearch_root.hide();
			_$auto_sch_box.show();
			autocomplete.search();
		}else{
			_$bottom_keysearch_root.show();
			_$auto_sch_box.hide();
			//plan.basic();
		}
		recent.search();
		//ranking.search();
		//plan._initialize();
	});
	
	/** 
	 *   검색란에 keyword 입력 or 삭제시 호출
	 *   1. 조건에 따라 자동완성 view or 최신/추천 검색어 view 표출
	 *   	 * 검색어의 유무에 따라 자동완성 view or 최신/추천 검색어 view 표출
	 *      * 기획전 view는 무조건 표출
	 */
    $( "#_searchKey" ).bind("keyup", function(e) {
    	searchKeyEvent(e);
    });
    
    /*$( "#_searchKey" ).keyup(function() {
	   searchKeyEvent();
    });*/
   
    var searchKeyEvent = function(e) {
    	intervalSec = 1;
    	var keyID = (e.which) ? e.which : e.keyCode;
		if (keyID == 13) {if(!_key_event_call){searchSubmit(); e.returnValue=false;}}
		else{
			var _$bottom_keysearch_root = $("#bottom_keysearch_root");
			var _$auto_sch_box = $("#auto_sch_box");
		   	
			if($( "#_searchKey" ).val()) {
				_$auto_sch_box.show();
				_$bottom_keysearch_root.hide();
				autocomplete.search();
			}else{
				_$auto_sch_box.hide();
				_$bottom_keysearch_root.show();
			}
			
			if(is_complete_korean($( "#_searchKey" ).val()) && $( "#_searchKey" ).val().length > 1) {
				timerInit();
			}else{
				if($( "#_searchKey" ).val().length == 0) {
					clearInterval(timeObj);
					plan.basic();
					$("#sch_cat_root").hide();
				}
			}
		}
		
		return false;
   }
    
    var confPlanAndCat = function() {
		plan.keyword();
		searchCategorize($( "#_searchKey" ).val());
    };
    
    var timerInit = function() {
		clearInterval(timeObj);
		timeObj = setInterval(function(){showPlanAndCat()},1000); // 1초간격으로 호출
	};

	var showPlanAndCat = function() {
		intervalSec--;
		if(intervalSec < 1){
			clearInterval(timeObj);
			confPlanAndCat();
		}
	};
    
    /** 
	 *   자동완성 관련
	 */
    var autocomplete = {
    		/** 
    		 *   main : 검색
    		 *   1. 입력된 키워드로 자동완성 api 호출
    		 *      * 옵션은 selector : search-form 에 정의
    		 */
    		search : function() {
    			//if($( "#_searchKey" ).val()) {
    				var searchKey = $( "#_searchKey" ).val();
    	    		$("#_term").val(searchKey);
    	    		if(!ParamValidate.isEmpty($("#_term").val())) {
    	    			$.ajax({
        	    	        url      : _rootUrl + "/api/suggest",
        	    			//url     : "http://10.20.51.59:8612/ksf/api/suggest",
        	    	        type  : 'post',	
        	    	        data	 : $('#search-form').serialize() + "&target=complete",
        	    	        dataType : 'jsonp',
        	    	        cache    : false,
        	    	        async    : false,
        	    	        success  : function(result) {
        	    	        	_error_code = '001';
        	    	        	// 자동완성 추가
        	    	        	var suggestions = result.suggestions[0];
        	    	        	var ul = $("#autocomp_root");
        	    	        	ul.children().detach();
        	    	        	
        	    	        	for(var i=0; i<suggestions.length; i++) {
        	    	        		ul.append($('<li/>').attr("class","dep1 auto")
    	    	    	        			.append($('<a/>').attr("href","#go")
    	    	    	        				.append(autocomplete.highlight(suggestions[i][0], searchKey))
    	    	    	        			)
        	    	        		);
        	    	        	}
        	    	        }
        	    	    })
        	    	    .error(function(xhr, textStatus, errorThrown) {
        	    	    	_error_code = '999';
        	    	    	//UI.alert(SYSTEM_ERROR_MESSAGE);
        	    	    	
        	    	    	if(SERVER_TYPE == 'DEV' || SERVER_TYPE == 'LOCAL') UI.alert("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+errorThrown);
        	    	    });
    	    		}
    	    	//}
    		},
    		/** 
    		 *   sub : highlight 정의
    		 *   1. 입력된 키워드와 자동완성 item의 같은 keyword를 highlight 처리
    		 *   2. parameter : 자동완성 item, 검색 keyword
    		 */
    		highlight : function(value, seed) {
    			var that = this;
    			var re;
    			
    			try{
    				re = new RegExp( "^" + this.escapeRegex( seed ), "i" ); // starts with	
    			}catch(e){}

    			return value.replace( re, "<span class='point'>$&</span>" );
    		},
    		escapeRegex : function(value) {
    			return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&").replace(/\s/g, "").replace(/[^\\]{1}/g, "$&\\s*");
    		}
    }
    
    /** 
	 *   카테고리 검색 
	 *   1. 입력된 키워드로 대 or 중 카테로리 검색
	 *   2. parameter : 검색 keyword
	 */
    var searchCategorize = function(searchStr) {
    	var url = "/search/search-category-ajax.do";
    	$.post(url, {"query" : searchStr}, function(result) {
    		var _$sch_cat_root = $("#sch_cat_root");
    		_$sch_cat_root.children().detach();
    		
    		var categoriez = result.categoriez;
    		
    		if(typeof categoriez !== 'undefined' && categoriez.length > 0) {
    			_$sch_cat_root.show();
    			
				for(var i=0; i<categoriez.length; i++) {
					_$sch_cat_root.append(
		    				$('<li/>').append($('<a/>').attr("href","/category/goHsmLctgy.do?ctgrNo="+categoriez[i].ctgnol).text(categoriez[i].ctgnml))
		    							 .append("&nbsp;&gt;&nbsp;")
		    							 .append($('<a/>').attr("href","/category/goHsmMctgy.do?ctgrNo=" +categoriez[i].ctgnom).text(categoriez[i].ctgnmm))
	    			);
	    		}
    		}else{
    			_$sch_cat_root.hide();
    		}
    	},"json");
    }
    
    /** 
	 *   추천(인기) 검색어 관련 전역 변수 및 함수 정의
	 */
    var ranking_global = (function() {
    	var _passiveMgmtYN = "N";
    	var _adminPopularKeywords = new Object();
    	
    	var _getPassiveMgmtYN = function() {
    		return _passiveMgmtYN;
    	}
    	
    	var _setPassiveMgmtYN = function(_p) {
    		_passiveMgmtYN = _p;
    	}

    	var _getAdminPopularKeywords = function() {
    		return _adminPopularKeywords;
    	}
    	
    	var _setAdminPopularKeywords = function(obj) {
    		_adminPopularKeywords = obj;
    	}
    	
    	return {
    		getPassiveMgmtYN : _getPassiveMgmtYN,
    		setPassiveMgmtYN : _setPassiveMgmtYN,
    		getAdminPopularKeywords : _getAdminPopularKeywords,
    		setAdminPopularKeywords : _setAdminPopularKeywords
    	};
    }());
    
    /** 
	 *   추천(인기) 검색어 관련
	 */
    var ranking = {
		/** 
		 *   sub : 검색 
		 *   1. konan 검색엔진으로 부터 검색
		 *   2. parameter : 검색 maxcount
		 *   3. konan 검색 + 수동 검색어 조합하여 view 완성
		 */
    	_fromKonan : function(max_count) {
	    	var url = _rootUrl + "/api/rankings?domain_no=0&max_count=" + max_count;
    		
	    	$.get(url, function(result) {
	    		_error_code = '001';
	    		
	    		var _$recom_pop_root = $("#recom_pop_root");
	    		_$recom_pop_root.text('').children().detach();

	    		_$recom_pop_root.append(
	    				$("<ul/>").attr("class","sches")
	    		);
	    		
	    		var ul = _$recom_pop_root.children();
	    		
	    		for(var i=0; i<result.length; i++) {
	    			ul.append($('<li/>').attr("class","recom_li")
	    					.append($('<a/>').attr("href","#").text(result[i][0]))
	    			);
				}
	    		
	    		var _passiveMgmtYN = ranking_global.getPassiveMgmtYN();
	    		if(_passiveMgmtYN == "Y") {
	    			var _adminPopularKeywords = ranking_global.getAdminPopularKeywords();
		    		
		    		for(var i=0; i<_adminPopularKeywords.length; i++) {
		    			ul.append($('<li/>').attr("class","recom_li")
		    					.append($('<a/>').attr("href","#").text(_adminPopularKeywords[i].popularKeyword))
		    			);
					}
	    		}
	    	},"jsonp")
	    	.error(function(xhr, textStatus, errorThrown) {
    	    	_error_code = '999';
    	    	//UI.alert(SYSTEM_ERROR_MESSAGE);
    	    	if(SERVER_TYPE == 'DEV' || SERVER_TYPE == 'LOCAL') UI.alert("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+errorThrown);
    	    });
	    },
	    /** 
		 *   sub : 검색 
		 *   1. 관리시스템이 정한 검색어 조회
		 */
	    _fromAdmin : function() {
	    	var url = "/search/search-popular-keyword-ajax.do";
	    	
	    	var _passiveMgmtYN = "";

	    	$.get(url, function(result) {
	    		if(result.resultCode == "001") {
	    			ranking_global.setPassiveMgmtYN("Y");
	    			ranking_global.setAdminPopularKeywords(result.popularKeywords);
	    		}else if(result.resultCode == "002"){
	    			ranking_global.setPassiveMgmtYN("N");
	    		}else{
	    			ranking_global.setPassiveMgmtYN("N");
	    		}
	    	},"json");
	    },
	    /** 
		 *   main : 검색 
		 *   1. 관리시스템이 정한 검색어 조회
		 *   2. 검색어 수동표출 여부에 따라 konan으로 부터 조회된 검색어들의 개수 제한
		 */
	    search : function() {
	    	ranking_global.setPassiveMgmtYN("Y");
	    	this._fromKonan(10);
	    	
	    	/* 2016.01.28 관리자 시스템으로 부터 인기검색어 조회 기능 삭제
	    	this._fromAdmin();
	    	var _passiveMgmtYN = ranking_global.getPassiveMgmtYN();
	    	
	    	if(_passiveMgmtYN == "Y") {
	    		this._fromKonan(5);
	    	}else{
	    		this._fromKonan(10);
	    	}*/
	    }
    };
    
    /** 
	 *   최신 검색어 관련
	 */
	var recent = {
			/** 
			 *   sub : 쿠키 옵션 정의
			 *   1. 쿠리명 : hsm_konan-recent
			 *   2. 검색어 구분자 : '__'
			 *   3. 만료일 : 1년
			 *   4. 전체 페이지에 적용
			 */
			options: {
				cookie: { // e.g. { expires: 7, path: '/', domain: 'konantech.com', secure: true }
					name: "hsm_konan-recent",
					separator: "__",
					expires: 365,
					path : '/'
				},
				max_count: 10
			},
			/** 
			 *   sub : 검색된 keyword를 최신검색어 view에 insert
			 *   1. 이미 같은 항목이 있다면 이미 있던 항목을 삭제
			 *   2. keyword를 insert
			 *   3. parameter : keyword
			 */
			add : function( item ) {
				var _$recent_pop_root = $("#recent_pop_root");
				var term = item;
				
				if ( term ) {
					_$recent_pop_root.children().find( "a" ).filter(function() { return $(this).text() === term; }).parent().remove();
					this._renderItem(_$recent_pop_root.children(), term, false);
					
					if (_$recent_pop_root.children().children().size() > this.options.max_count) {
						_$recent_pop_root.children().find( "li:last ").remove();
					}
					
					this._write();
				}
			},
			/** 
			 *   sub : 검색 keyword를 view의 최상단 or 최하단에 위치시킨다.
			 *   1. parameter : 해당 view root, keyword, append or beforeInsert(boolean)
			 */
			_renderItem: function(ul, item, append) {
				var li = $( "<li/>" ).attr("class","recent_li").append( $( "<a/>" ).text(item) );
				return append ? li.appendTo(ul) : li.prependTo(ul);
			},
			/** 
			 *   sub : 검색된 keyword를 쿠키에 추가
			 */
			_write: function() {
				var _$recent_pop_root = $("#recent_pop_root");
			    $.cookie("hsm_konan-recent", escape(_$recent_pop_root.children().find( "a" ).map(function() {
					return $(this).text();
				}).get().join(this.options.cookie.separator)), this.options.cookie);
			},
			/** 
			 *   main : 검색
			 *   1. 최신 검색어가 없을 경우 - 추천검색어 tab 영역을 표출
			 */
			search : function() {
				var _$recent_pop_root = $("#recent_pop_root");
		    	_$recent_pop_root.children().children().detach();

		    	var cookie = $.cookie("hsm_konan-recent");
		    	var items = (cookie) ? unescape(cookie).split(this.options.cookie.separator) : null;
		    	
		    	if (items) {
					$.each( items, function( index, item ) {
						_$recent_pop_root.children().append(
							$( "<li/>" ).attr("class","recent_li").append( $( "<a/>" ).text(item))
						)
					});
					$("#bottom_keysearch_root").children().trigger("tabs:change_index",0);
				}else{
					$("#bottom_keysearch_root").children().trigger("tabs:change_index",1);
				}
		    }
	};
	
	/** 
	 *   기획전 관련 전역 변수 및 함수 정의
	 */
    var plan_global = (function() {
    	var _$plan_default;
    	
    	var _getPlan_default = function() {
    		return _$plan_default;
    	}
    	
    	var _setPlan_default = function(_elements) {
    		_$plan_default = _elements;
    	}

    	return {
    		getPlan_default : _getPlan_default,
    		setPlan_default : _setPlan_default
    	};
    }());
	
    /** 
	 *   기획전 관련
	 */
	var plan = {
			/** 
			 *   url : search-top-plan-ajax.do
			 */
			url : "/search/search-top-plan-ajax.do",
			/** 
			 *   sub : default 검색.
			 *   1. 검색 keyword 를 배제한 검색
			 *   2. view 초기화
			 *   3. view clone 저장(keyword로 검색된 항목이 없을 시 표출하기 위함)
			 */
			basic : function() {
				if(!plan_global.getPlan_default()) {
					this._search();
					//this._initialize();
					plan_global.setPlan_default($("#roll_list").parent().clone());
				}else{
					$("#roll_list").parent().replaceWith(plan_global.getPlan_default()[0].outerHTML);
				}
			},
			/** 
			 *   sub : keyword 검색.
			 *   1. 검색 keyword 로 검색
			 *   2. view 초기화
			 */
			keyword : function() {
				$('#plantop-query').val($("#_searchKey").val());
				this._search();
				//this._initialize();
			},
			/** 
			 *   main : 검색.
			 *   1. keyword로 검색시 항목이 없을 때 default 검색 view 표출 
			 */
			_search : function() {
				$.post(this.url, $("#plansearch-form").serialize(), function(result) {
		    		var _$roll_list = $("#roll_list");
		    		_$roll_list.children().detach();
					
		    		_$roll_list.append($('<ul/>').attr("class","rolling ui-list-items"));
		    		var _$ul = _$roll_list.children();
		    		
		    		var plans = result.plans;
		    		for(var i=0; i<plans.length; i++) {
		    			var imageNo = parseInt(plans[i].shpno/1000);
		    			
		    			_$ul.append($('<li/>').attr("class","ui-list-item")
		    					.append($('<a/>').attr("href","/plan/planDetail.do?shpNo="+plans[i].shpno+"&search=planshp").attr("target","_blank")
		    							.append($('<div/>').attr("class","list")
		    									.append($('<img/>').attr("src",SCH_IMG_URL+"/plan/200/" + imageNo + "/" + plans[i].shpno + "_P3.jpg").attr("alt",plans[i].shpnm).attr("width","128px").attr("height","128px"))
		    									.append($('<p/>').attr("class","title").text(plans[i].shpnm))
		    							)
		    					)
		    			);
		    		}
		    		
		    		if(typeof plans.length === 'undefined' || plans.length == 0) {
		    			_$roll_list.parent().replaceWith(plan_global.getPlan_default()[0].outerHTML);
		    		}
		    	},"json")
		    	.done(function() {
		    		plan._initialize();
				})
				.error(function(xhr, textStatus, errorThrown) {
	    	    	_error_code = '999';
	    	    	//UI.alert(SYSTEM_ERROR_MESSAGE);
	    	    	if(SERVER_TYPE == 'DEV' || SERVER_TYPE == 'LOCAL') UI.alert("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+errorThrown);
	    	    });
			},
			/** 
			 *   sub : view 초기화.
			 *   1. 이미지 슬라이드 관련 초기화 
			 */
			_initialize : function() {
				// view 초기화
				var _$target = $( '#roll_list' ).parent();
	    		
	            _$target.removeClass("ui-overlay-list-apply").overlayList({
	    	        loop: true
	    	    });
	            
	            var _$controller = _$target.find( '.ui-controller' ).removeClass("disabled");
	            var _$prevBtn = _$controller.find( '.ui-controller-prev' ).attr("disabled",false).removeClass("disabled");
	            var _$nextBtn = _$controller.find( '.ui-controller-next' ).attr("disabled",false).removeClass("disabled");
			}
	}
	
	/** 
	 *   자동완성 item 선택시 호출
	 */
	$(document).on("click", ".dep1.auto", function(e) {
		$("#_searchKey").val($(this).children().text());
		_srchWiseLogParam = "&search=automatic_keyword"; //wiselog param 추가
		$("#s_type").val('3'); // 자동완성 keywordType
		$("#searchButton").trigger("click");
	    //return false;
	});
	
	/** 
	 *   최신검색어 or 추천(인기)검색어 선택시 호출
	 */
	$(document).on("click", ".recent_li, .recom_li", function(e) {
		$("#_searchKey").val($(this).text());
		$(".sches").children().removeClass("on");
		$(this).addClass("on");
		if($(this).hasClass("recent_li")) {
			$("#s_type").val('1'); // 최근검색어 keywordType
			_srchWiseLogParam = "&search=recent_keyword"; //wiselog param 추가
		} else if($(this).hasClass("recom_li")) {
			$("#s_type").val('2'); // 인기검색어 keywordType
			_srchWiseLogParam = "&search=recommend_keyword"; //wiselog param 추가
		}
		$("#searchButton").trigger("click");
	    //return false;
	});
	
	/**
	 * 한글 완성 체크
	 */
	var is_complete_korean = function(str){
		for(var i = 0; i < str.length; i++){
			var chr = str.substr(i,1);
			chr = escape(chr);
			if(chr.charAt(1) == "u"){
				chr = chr.substr(2, (chr.length - 1));
				if((chr < "AC00") || (chr > "D7A3")) {
					return false;
				}
			}
			else{
				return false;
			}
		}
		return true;
	}
});