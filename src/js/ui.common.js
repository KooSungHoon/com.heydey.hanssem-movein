/**
 * 공통 UI 요소 적용
 * @version 2016.01.28
 */
;(function ($) {
    //페이지 JS 중복 삽입 체크
    UI.checkOverlapJS( 'ui.common' );

    var _parallaxScrollUpdatePool = [];

    // ----- 상단 오른쪽 베너 적용 ----- //
    $( '.header_banner' ).overlayList({
        loop: true
    });

    // ----- 상단 통합검색 Layer 베너 적용 ----- //
    $( '.sch_right_rolling' ).overlayList({
        loop: true
    });
    
    // ----- 상단 Location ----- //
    (function () {
        var _selectIdx = -1;
        var _$li = $( '#container .location > ul > li' );

        _$li.find( '>a' ).on( 'click', function (e) {
            var idx = $( this ).closest( 'li' ).index();

            if ( idx === _selectIdx ) {
                closeDepth( _selectIdx );
                _selectIdx = -1;
            } else {
                closeDepth( _selectIdx );
                openDepth( idx );
                _selectIdx = idx;
            }
        });

        function outSideClickHandler (e) {
            if ( $(e.target).closest('.location').length ) return;
            closeDepth( _selectIdx );
            _selectIdx = -1;
        }

        function openDepth ( idx ) {
            var $li = _$li.eq( idx ),
                $img = $li.find( ' a > img' ),
                path = $img.attr( 'src' );

            $li.addClass( 'active' ).find( '.lc_pop' ).removeClass( 'dp_none' );
            if ( path ) $img.attr( 'src', path.replace('icon_location_open.gif', 'icon_location_close.gif') );

            $( document ).on( 'mousedown', outSideClickHandler );
        }

        function closeDepth ( idx ) {
            var $li = _$li.eq( idx ),
                $img = $li.find( ' a > img' ),
                path = $img.attr( 'src' );

            $li.removeClass( 'active' ).find( '.lc_pop' ).addClass( 'dp_none' );
            if ( path ) $img.attr( 'src', path.replace('icon_location_close.gif', 'icon_location_open.gif') );

            $( document ).off( 'mousedown', outSideClickHandler );
        }
    }());


    // ========== Quick Menu 처리 ========== //
	if ( $('#quick_menu').length ) {
	    (function () {
	        var _$quickMenu = $( '#quick_menu' );

            _$quickMenu.find( '>ul > li > a' ).on( 'click', function (e) {
                e.preventDefault();
                _$quickMenu.find( '.pop_bubble' ).closeLayer();
                $( this ).parent().find( '.pop_bubble' ).openLayer();

                // 다른 오브젝트 클릭시 닫힘
                $( document ).on( 'mousedown', outSideClickHandler );
            });

            _$quickMenu.find( '.q_top' ).on( 'click', function (e) {
                e.preventDefault();
                $( window ).scrollTop(0);
            });

            _$quickMenu.on( 'layer:close', '.pop_bubble', function (e) {
                $( document ).off( 'mousedown', outSideClickHandler );
            });

            function outSideClickHandler (e) {
                if ( $(e.target).closest('#quick_menu').length ) return;
                _$quickMenu.find( '.pop_bubble' ).closeLayer();
            }
	    }());
	}
	


    /**********************  JS 재적용 가능한 요소들 모음 **********************/
    //동적으로 생성된 요소들의 JS를 적용할때 사용한다, 한번 적용되었던 요소들에는 재 적용되지 않는다.
    UI.resetCommonJS = function () {
        //IE8,9 대응 placeholder
        $( 'input, textarea' ).placeholder();

        //SelectBox 세팅
        $( '.ui-select-box' ).selectBox();

        //selectbox option의 다양한 디자인이 들어갔을때 아래와 같이 사용
        $( '.ui-design-select-box' ).selectBox({
            designOption: true
        });

        //selectbox option 과 선택 value의 다양한 디자인이 들어갔을때 아래와 같이 사용 (별점)
        $( '.ui-design-value-select-box' ).selectBox({
            designOption: true,
            designValue: true
        });

        //NumberCounter 세팅
        $( '.ui-number-counter' ).numberCounter();

        //성별 radioSelect
        $( '.ui-radio-select' ).radioSelect();

        //Tab Controller 세팅
        $( '.ui-tab-area' ).tabs();

        //Tab 안에 또 tab이 있는 Controller 세팅
        $( '.ui-sub-tab-area' ).tabs();


        //퀵메뉴 내부의 배너들
        $( '#quick_menu' ).find( '.poptype2 .pop_bubble_cont , .poptype4 .pop_bubble_cont' ).overlayList();
        $( '#quick_menu .poptype6 .pop_bubble_cont' ).slideList({
            viewLength: 3
        });

        // ========== parallaxScroll 좌표 수동 업데이트 ========== //
        for ( var key in _parallaxScrollUpdatePool ) {
            _parallaxScrollUpdatePool[key]();
        }
    };

    //최초 1번 적용
    UI.resetCommonJS();
})(jQuery);

//----- 전체 카테고리 ----- //
function sitemap_close(e){
	if ( $(e.target).closest('.mall_gnb').length ) return;
	$( document ).off('mousedown', sitemap_close);
	$(".sitemap").slideUp();
}

$(document).ready(function() {
	$(".more_ls").click(function() {
		$(this).hide()
		$(this).next(".cut_ls").css("display","block");
		$(this).parent().find(".hidden_ls").show();
	});

	$(".cut_ls").click(function() {
		$(this).hide()
		$(this).prev(".more_ls").css("display","block");
		$(this).parent().find(".hidden_ls").hide();
	});

	$(".close_sitemp").click(function() {
		$(".sitemap").slideUp();
	});

	$(".open_sitemap").click(function() {
		$(".sitemap").show();
		$( document ).on( 'mousedown', sitemap_close);
	});

	$(".sitemap_view_all_img").click(function() {
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$(this).attr("src",$(this).attr("src").replace("_on.png",".png"));
			$(".hidden_ls").hide();
			$(".more_ls").show();
			$(".cut_ls").hide();
		}else{
			$(this).addClass("on");
			$(this).attr("src",$(this).attr("src").replace(".png","_on.png"));
			$(".hidden_ls").show();
			$(".more_ls").hide();
			$(".cut_ls").css("display","block");
		}
	});
});