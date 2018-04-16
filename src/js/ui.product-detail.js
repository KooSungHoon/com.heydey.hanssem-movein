/**
 * 상품상세 페이지 - UI 요소 적용
 * @version 2015.11.16
 */
;(function ($, $B) {
	
    var _parallaxScrollUpdatePool = [];

    // ========== 상단 gnb_area 스크롤에 따른 fixed처리 ========== //
    (function () {
        var _$gnb = $( '#gnb_area' ),
            _$tabAreas = $( '.ui-tab-position-area' ),
            _$tabs = _$tabAreas.find( '> .tab_wrap' );

        if ( !_$gnb.length ) return;

        var _docH = $( document ).outerHeight(),
            _gnbY = _$gnb.offset().top,
            _gnbH = _$gnb.height(),
            _scrollY = 0,
            _isScrollDown = false;

        var _gnbScroll = new $B.utils.ParallaxScroll( 'vertical', getGnbPositions(), {
            onDeactivate: gnbScrollHandler,
            onScroll: gnbScrollHandler
        });

        var _tabScroll = new $B.utils.ParallaxScroll( 'vertical', getTabPositions(), {
            onActivate: tabScrollHandler,
            onDeactivate: tabScrollHandler
        });

        function gnbScrollHandler (e) {
            switch ( e.type ) {
                case 'deactivate':
                    _$gnb.removeClass( 'fixed' );
                    break;
                case 'scroll':
                    var scrollY = e.scrollY;

                    //deactivate
                    if ( e.index === 0 ) {
                        //scroll down
                        if ( _scrollY < scrollY ) {
                            _$gnb.removeClass( 'fixed' );
                            _$tabs.addClass( 'scroll_down' );
                            _isScrollDown = true;
                        } else {
                            _$gnb.addClass( 'fixed' );
                            _$tabs.removeClass( 'scroll_down' );
                            _isScrollDown = false;
                        }
                    }

                    _scrollY = scrollY;
                    break;
            }
        }

        function tabScrollHandler (e) {
            switch ( e.type ) {
                case 'activate':
                    _$tabs.removeClass( 'fixed' ).eq( e.index ).addClass( 'fixed' );
                    break;
                case 'deactivate':
                    _$tabs.removeClass( 'fixed' );
                    break;
            }
        }

        //스크롤에 반응할 좌표설정
        function getTabPositions () {
            var result = [],
                tabLength = _$tabAreas.length;

            for ( var i = 0; i < tabLength; ++i ) {
                var position = {
                    start: _$tabAreas.eq(i).offset().top - _gnbH,
                    end: _docH
                };

                if ( i > 0 ) {
                    var prevPosition = result[i - 1];
                    prevPosition.end = position.start;
                }

                result.push( position );
            }

            return result;
        }

        function getGnbPositions () {
            _docH = $( document ).outerHeight();

            return [
                {
                    start: _gnbY,
                    end: _docH
                }
            ];
        }

        function tabPositionUpdate () {
            _gnbScroll.update( getGnbPositions() );
            _tabScroll.update( getTabPositions() );
        }

        $( window ).load( tabPositionUpdate );
        $( document ).on( 'click', tabPositionUpdate );

        _parallaxScrollUpdatePool.push( tabPositionUpdate );

        // ----- 탭 클릭시 해당 영역으로 이동 ----- //
        _$tabs.find( '> .tab_tit > li > a' ).on( 'click', function (e) {
            e.preventDefault();

            var id = $( this ).attr( 'href' );
            $( 'html, body' ).scrollTop( $(id).offset().top - _gnbH );
        });
    }());
    
    // ========== 오른쪽 "상품비교" detail_side_wrap 스크롤에 따른 fixed처리 ========== //
    (function () {
        var _$area = $( '.detail_info_wrap' ),
            _$target = _$area.find( '.detail_side_wrap' );

        if ( !_$target.length ) return;

        var _pScroll = new $B.utils.ParallaxScroll( 'vertical', getPositions(), {
            onDeactivate: scrollHandler,
            onActivate: scrollHandler
        });

        function scrollHandler (e) {
            switch ( e.type ) {
                case 'activate':
                    _$target.addClass( 'fixed' );
                    break;
                case 'deactivate':
                    _$target.removeClass( 'fixed' );
                    break;
            }
        }

        //스크롤에 반응할 좌표설정
        function getPositions () {
            return [{
                start: _$area.offset().top + 510,
                end: $( document ).height()
            }];
        }

        function positionUpdate () {
            _pScroll.update( getPositions() );
        }

        $( window ).load( positionUpdate );
        $( document ).on( 'click', positionUpdate );

        _parallaxScrollUpdatePool.push( positionUpdate );
    }());    

    // ========== "포토 상품후기", "동영상 상품후기" 적용 ========== //
    $( '.ui-slide-multi' ).slideList({
        eventBlock: false,
        motionType: 'slide',
        viewLength: 4,
        moveLength: 4
    });

    // ========== "상품비교", "여성이 함께 구매하신 상품" 적용 ========== //
    //$( '.ui-overlay-list' ).overlayList();


    // ========== 하단 구매 레이어 올리기 ========== //
    $( '.detail_fixed_ui' ).click(function(){
        $( '.detail_fixed' ).toggleClass( 'active' );
        $( '.detail_fixed_cont' ).stop().slideToggle();
    })
    
    // ========== 상품후기 보기 ========== //
    $( '.review_list .info a' ).click( function (e) {
        e.preventDefault();
        $( this ).closest( '.info' ).next( '.view' ).stop().slideToggle();
    });

    // ========== 상품문의 보기 ========== //
    $( '.detail_qna a.info' ).click( function (e) {
        e.preventDefault();
    	$( this ).closest( 'li' ).find( '> .view' ).stop().slideToggle( 'fast' );
    });
    $( '.qna_close' ).click( function (e) {
        e.preventDefault();
        $( this ).closest( '.view' ).stop().slideToggle( 'fast' );
    });
    
    // ========== 패키지 상품 팝업 배너 리스트 ========== //
    $( '.shop_basket_list' ).slideList({
        eventBlock: false,
        motionType: 'slide',
        viewLength: 4,
        moveLength: 1,
        itemWidth : 138
    });
    
    
})(jQuery, ixBand);


// ========== 상품 확대보기 레이어 팝업 ========== //
function fncGoodsExpandEvent(){

    // ---------- 상품사진 1단 ---------- //
    $( '.large_photo_area' ).each( function ( idx, el ) {
        var _$target = $( el ),
            _$imgArea = _$target.find( '.pop_enlarge_large_img' ),
            _$imgs = _$imgArea.find( '>.thumb_content' ),
            _$listSlide = _$target.find( '.pop_enlarge_slide' ),
            _$list = _$listSlide.find( '.ui-list-item' );

        var _selectIdx = -1;

        if ( _$target.hasClass('ui-js-apply') ) return;
        _$target.addClass( 'ui-js-apply' );

        _$list.find( '> a' ).on( 'click', function (e) {
            e.preventDefault();
            setItem( $(this).parent().data('origin-idx'), true );
        });

        _$listSlide.slideList({
            motionType: 'slide',
            viewLength: 7,
            itemWidth: 74
        });

        $( '.pop_enlarge' ).on( 'layer:open layer:close', function (e) {
            if ( e.type === 'layer:open' ) {
                if ( _$list.length > 1 ) setItem( 0, false );
            } else {
                if ( isVideoItem(_selectIdx) ) {
                    _$imgs.eq( _selectIdx ).addClass( 'dp_none' );
                    videoOff( _selectIdx );
                }

                _selectIdx = -1;
            }
        });


        function setItem ( idx, isAni ) {
            if ( idx === _selectIdx ) return;

            if ( isVideoItem(_selectIdx) ) {
                _$imgs.eq( _selectIdx ).addClass( 'dp_none' );
                videoOff( _selectIdx );
            }

            if ( isVideoItem(idx) ) {
                videoOn( idx );
                _$imgs.eq( idx ).removeClass( 'dp_none' );
                _$imgArea.append( _$imgs.eq(idx) );
            } else {
                var $img = _$imgs.eq( idx ).stop().css( 'opacity', 0 );
                _$imgArea.append( $img );

                if ( isAni ) {
                    $img.animate( {opacity: 1}, {
                        duration: 300
                    });
                } else {
                    $img.stop().css( 'opacity', 1 );
                }
            }

            _$list.removeClass( 'active' ).eq( idx ).addClass( 'active' );
            _selectIdx = idx;
        }

        function videoOn ( idx ) {
            var $video = _$imgs.eq( idx ).find( 'iframe' ),
                videoSrc = $video.data( 'video-src' );

            if ( videoSrc ) {
                $video.attr( 'src', videoSrc ).data( 'video-src', '' );
            }
        }

        function videoOff ( idx ) {
            var $video = _$imgs.eq( idx ).find( 'iframe' ),
                videoSrc = $video.attr( 'src' );

            if ( videoSrc ) {
                $video.attr( 'src', '' ).data( 'video-src', videoSrc );
            }
        }

        function isVideoItem ( idx ) {
            return _$list.eq( idx ).find( '.vdo' ).length > 0;
        }
    });

}

/* NumberCounter 갱신  */
$.fn.fncNumberCounterRenew = function(){
	$(this).each(function(i, inpAmount){

		if(Number($(inpAmount).val()) > Number($(inpAmount).attr("min"))){
				$(inpAmount).prev("button").removeClass("disabled").prop("disabled", false);
			
		}else if(Number($(inpAmount).val()) == Number($(inpAmount).attr("min"))){
				$(inpAmount).prev("button").addClass("disabled").prop("disabled", true);
		}

		if(Number($(inpAmount).val()) ==  Number($(inpAmount).attr("max"))){
				$(inpAmount).next("button").addClass("disabled").prop("disabled", true);
		}else if(Number($(inpAmount).val()) <  Number($(inpAmount).attr("max"))){
				$(inpAmount).next("button").removeClass("disabled").prop("disabled", false);	
		}
	});
};


/* 한개의 금액 obj NumberCounter 갱신  */
function fncNumberCounterRenewOne(inpAmount){
	if(Number($(inpAmount).val()) > Number($(inpAmount).attr("min"))){
			$(inpAmount).prev("button").removeClass("disabled").prop("disabled", false);
		
	}else if(Number($(inpAmount).val()) == Number($(inpAmount).attr("min"))){
			$(inpAmount).prev("button").addClass("disabled").prop("disabled", true);
	}

	if(Number($(inpAmount).val()) ==  Number($(inpAmount).attr("max"))){
			$(inpAmount).next("button").addClass("disabled").prop("disabled", true);
	}else if(Number($(inpAmount).val()) <  Number($(inpAmount).attr("max"))){
			$(inpAmount).next("button").removeClass("disabled").prop("disabled", false);	
	}
};
