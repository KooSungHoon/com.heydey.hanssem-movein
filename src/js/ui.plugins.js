/**
 * 공통 UI 요소, Custom Plug-in
 * @version 2016.01.21
 */
;(function ($, $B) {
    var _selectBoxId = 0,
        _selectBoxs = [];

    //jQuery Plugin 으로 선언
    $.fn.extend({

        some: function ( callback ) {
            if ( !callback ) return this;

            var length = this.length;

            for ( var i = 0; i < length; ++i ) {
                if ( callback.call(this, i, this.get(i)) ) break;
            }
        },

        /**
         * 남은 시간을 표시할수 있도록 거꾸로 돌아가는 타이머
         * $(target).on('remaintimer:timer', function (e, date) {date.day, date.hour, date.minute, date.second});
         * $(target).on('remaintimer:complete', function (e) {종료시 발생});
         * $(target).trigger('remaintimer:reset', options ); 시간 재설정
         * $(target).trigger('remaintimer:stop' ); 타이머 정지
         * @param   {Object}    options
         *      -   {Int}   startTime    시작 시간 설정 (UTC milisecond형식)
         *      -   {Int}   finishTime   종료시간 설정 (UTC milisecond형식)
         */
        remainTimer: function ( options ) {
            var _options = options || {};

            this.each( function ( idx, el ) {
                var $target = $( el ),
                    $day = $target.find( '.ui-remain-timer-day' ),
                    $hour = $target.find( '.ui-remain-timer-hour' ),
                    $minute = $target.find( '.ui-remain-timer-minute' ),
                    $second = $target.find( '.ui-remain-timer-second' );

                if ( !$target.hasClass('ui-remain-timer-apply') ) {
                    $target.addClass( 'ui-remain-timer-apply' );

                    var rTimer = new $B.utils.RemainTimer( _options.startTime, _options.finishTime, {
                        onTimer: function (e) {
                            var date = {
                                day: e.day,
                                hour: $B.string.format( e.hour, 2 ),
                                minute: $B.string.format( e.minute, 2 ),
                                second: $B.string.format( e.second, 2 )
                            };

                            $day.text( date.day );
                            $hour.text( date.hour );
                            $minute.text( date.minute );
                            $second.text( date.second );

                            $target.trigger( 'remaintimer:timer', date );
                        },
                        onComplete: function (e) {
                            $target.trigger( 'remaintimer:complete' );
                        }
                    }).start();

                    //재설정
                    $target.on( 'remaintimer:reset remaintimer:stop', function (e, options ) {
                        if ( e.type === 'remaintimer:reset' ) {
                            rTimer.reset( options.startTime, options.finishTime ).start();
                        } else {
                            rTimer.stop();
                        }
                    });
                }
            });

            return this;
        },

        /**
         * SelectBox
         * 동적으로 selectbox의 option을 추가했을시 화면에 적용을 위하여 $(target).trigger('selectbox:updated') 해줘야 한다.
         * @param   {Object}    options
         *      -   {Boolean}   designOption    true를 설정시 리스트를 동적으로 생성하지 않는다.
         *      -   {Boolean}   designValue     designOption=true 시 선택된 value의 디자인이 들어갈때 설정
         */
        selectBox: function( options ) {
            this.each( function ( idx, el ) {
                if ( !$(el).hasClass('ui-select-box-apply') ) {
                    _selectBoxs.push( new SelectBox($(this), _selectBoxId, options) );
                    _selectBoxId++;
                }
            });

            return this;
        },

        //NumberCounter
        numberCounter: function () {
            this.each( function ( idx, el ) {
                if ( !$(el).hasClass('ui-number-counter-apply') ) {
                    new NumberCounter( $(this) );
                }
            });

            return this;
        },

        /**
         * Tab관리
         * $(target).on('tabs:change', function (e, index) { index }) 으로 현재 열린 탭의 index를 전달 받을수 있다.
         * $(target).trigger('tabs:change_index', index) 로 활성화 시킬 탭을 변경할 수 있다.
         * @param {Object}      options
         *      - {Boolean}     eventBlock  클릭이벤트 전달을 막는다. (a href=의 동작을 막는다), 기본설정=true
         *      - {Boolean}     autoPlay    자동 플레이 설정, 기본설정=false
         *      - {Number}      delayTime   autoPlay 지연시간 (1000/1초), 기본설정=4000
         */
        tabs: (function () {
            function changeTab ( $target, idx, oldIdx, silent ) {
                var $tabs = $target.find( '>.ui-tabs > .ui-tab-item' ),
                    $contents = $target.find( '>.ui-tab-contents > .ui-tab-contents-item' );

                if ( idx >= $tabs.length ) return;

                $tabs.removeClass( 'active' );
                $tabs.eq( idx ).addClass( 'active' );
                $contents.css( 'display', 'none' );
                $contents.eq( idx ).css( 'display', 'block' );
                if ( !silent && idx !== oldIdx ) $target.trigger( 'tabs:change', idx );
            }

            return function ( options ) {
                var _options = options || {};
                _options.eventBlock = ( typeof _options.eventBlock === 'boolean' ) ? _options.eventBlock : true;

                this.each( function ( idx, el ) {
                    var _$target = $( el );
                    var _selectIdx = 0, _timer, _itemLength = _$target.find( '>.ui-tabs > .ui-tab-item' ).length;

                    if ( !_$target.hasClass('ui-tab-apply') ) {
                        _$target.addClass( 'ui-tab-apply' );

                        changeTab( _$target, _selectIdx, _selectIdx, true );

                        _$target.find( '>.ui-tabs > .ui-tab-item > a' ).on( 'click', function (e) {
                            if ( _options.eventBlock ) e.preventDefault();
                            var idx = $( e.currentTarget ).parent().index();
                            changeTab( _$target, idx, _selectIdx );
                            _selectIdx = idx;
                        });

                        _$target.on( 'tabs:change_index', function (e, index) {
                            changeTab( _$target, index, _selectIdx );
                            _selectIdx = index;
                        });

                        if ( _options.autoPlay ) {
                            _timer = new $B.utils.Timer( _options.delayTime || 4000, 0, {
                                onTimer: function (e) {
                                    var idx = _selectIdx + 1;
                                    if ( idx >= _itemLength ) idx = 0;
                                    changeTab( _$target, idx, _selectIdx );
                                    _selectIdx = idx;
                                }
                            }).start();

                            _$target.on( 'mouseover mouseout', function (e) {
                                if ( e.type == 'mouseover' ) {
                                    _timer.stop();
                                } else {
                                    _timer.reset().start();
                                }
                            });
                        }
                    }
                });

                return this;
            }
        }()),

        /**
         * 레이어 팝업 열기 (X버튼의 닫기 이벤트는 자동으로 등록된다)
         * $(target).on('layer:open layer:close', function ) 으로 열고 닫히는 시점의 이벤트를 받을수 있다.
         */
        openLayer: function ( options ) {
            if ( this.hasClass('ui-layer-open-apply') ) return this;

            var self = this,
                options = options || {};

            this.find( '.ui-layer-close' ).off( 'click' ).on( 'click', function (e) {
                e.preventDefault();
                self.closeLayer();
            });

            if ( options.modal ) {
                this.addClass( 'ui-layer-modal' );
                $( '#ui-modal-area, #ui-modal-area .ui-modal-dim' ).css( 'display', 'block' );
                $( '#ui-modal-area .ui-modal-default-layer' ).css( 'display', 'none' );
                this.css( 'zIndex', '10000' );
            }

            this.css( 'display', 'block' ).addClass( 'ui-layer-open-apply' );
            this.trigger( 'layer:open' );
            return this;
        },

        /**
         * 레이어 팝업 강제로 닫기
         */
        closeLayer: function () {
            if ( !this.hasClass('ui-layer-open-apply') ) return this;
            this.find( '.ui-layer-close' ).off( 'click' );
            this.css( 'display', 'none' );
            if ( this.hasClass('ui-layer-modal') ) $( '#ui-modal-area, #ui-modal-area .ui-modal-dim' ).css( 'display', 'none' );
            this.removeClass( 'ui-layer-open-apply' );
            this.removeClass( 'ui-layer-modal' );
            this.trigger( 'layer:close' );
            return this;
        },

        /**
         * radioBox 형태의 selectBox
         */
        radioSelect: (function () {
            function updated ( $target ) {
                var $select = $target.find( '>.ui-radio-select-input' ),
                    $options = $select.find( '>option' );

                var buttonHtml = '',
                    isAllDisabled = $select.attr( 'disabled' );

                $target.find( '>.ui-radio-select-btn' ).remove();
                $options.each( function ( idx, el ) {
                    var $option = $( el ),
                        disabled = '', selected = '', attrDisabled = '', attrSelected = '';

                    if ( $option.attr('disabled') || isAllDisabled ) {
                        disabled = 'disabled';
                        attrDisabled = 'disabled="disabled"';
                    }

                    if ( $option.attr('selected') ) {
                        selected = 'selected';
                        attrSelected = 'selected="selected"';
                    }

                    buttonHtml += '<button class="index' + idx + ' design_radio ui-radio-select-btn ' + disabled + ' ' + selected + '" ' + attrDisabled + ' ' + attrSelected + 'data-index="' + idx + '">' + $option.text() + '</button>';
                });

                $target.append( buttonHtml );
            }

            function changeValue ( $target, selectIdx ) {
                if ( selectIdx !== $target._selectIdx ) {
                    var $select = $target.find( '>.ui-radio-select-input' ),
                        $options = $select.find( '>option' );

                    $options.attr( 'selected', false ).eq( selectIdx ).attr( 'selected', true );
                    $target.find( '>.ui-radio-select-btn' ).removeClass( 'selected' ).eq( selectIdx ).addClass( 'selected' );

                    $select.trigger( 'change' );
                    $target._selectIdx = selectIdx;
                }
            }

            return function () {
                this.each( function ( idx, el ) {
                    var $target = $( el );
                    $target._selectIdx = -1;

                    if ( !$target.hasClass('ui-radio-select-apply') ) {
                        $target.addClass( 'ui-radio-select-apply' );

                        updated( $target );

                        $target.on( 'click', '>.ui-radio-select-btn', function (e) {
                            e.preventDefault();
                            var idx = $( e.target ).data( 'index' );

                            changeValue( $target, idx );
                        });

                        $target.on( 'radioselect:updated', function (e) {
                            updated( $target );
                            changeValue( $target, $target.find('>.ui-radio-select-input > option[selected=selected]').index() );
                        });
                    }
                });

                return this;
            }
        }()),

        /**
         * 최소 최대 값을 선택할수 있는 슬라이더
         * $(target).on(' rangeslider:change', function (e, min, max) {})
         * $(target).trigger('rangeslider:reset', [시작값, 끝값])
         * @param {Object}      options
         *      - {Array}   values  설정값, [시작값, 끝값], 기본값=[min, max]
         *      - {Number}  range   슬라이드가 움딕일때 한번 반환될 수치의 범위, 기본값=1
         *      - {Boolean} numberFormat   true를 설정하면 "1,000" 형식으로 표현된다, 기본값=false
         */
        rangeSlider: function ( options ) {
            this.each( function ( idx, el ) {
                var $target = $( el );

                if ( !$target.hasClass('ui-range-slider-apply') ) {
                    $target.addClass( 'ui-range-slider-apply' );
                    new RangeSlider( $target, options );
                }
            });

            return this;
        },

        /**
         * 드레그하여 값을 선택할수 있는 슬라이더
         * $(target).on('slider:init slider:change', function (e, value) {})
         * @param {Object}      options
         *      - {Number}  range       슬라이드가 움딕일때 한번 반환될 수치의 범위, 기본값=1
         *      - {Number}  baseWidth   슬라이드의 가로폭, 실행시점에 사이즈를 구할수 없을때 설정
         *      - {Number}  min         최소값
         *      - {Number}  max         최대값
         *      - {Boolean} readonly    읽기전용 설정
         */
        slider: function ( options ) {
            this.each( function ( idx, el ) {
                var $target = $( el );

                if ( !$target.hasClass('ui-slider-apply') ) {
                    $target.addClass( 'ui-slider-apply' );
                    new Slider( $target, options );
                }
            });

            return this;
        },

        /**
         * 오버랩되는 리스트 베너 관리
         * $(target).on('overlaylist:change overlaylist:init', function (e, index, total) {}) 으로 변경된 아이템의 index 반환
         * $(target).trigger('overlaylist:change_index', index) 로 강제 설정가능
         * $(target).trigger('overlaylist:timer_start overlaylist:timer_stop') 으로 autoPlay 일시정지 재시작
         * @param {Object}      options
         *      - {Boolean}     autoPlay    자동 플레이 설정, 기본설정=false
         *      - {Number}      delayTime   autoPlay 지연시간 (1000/1초), 기본설정=4000
         *      - {String}      motionType  "overlay", "none" 기본설정="none"
         *      - {Number}      duration    모션이 animate되는 속도, 기본설정=400
         *      - {Boolean}     loop        아이템이 끝이 없이 무한으로 보여져야 할때 true, 기본설정=false
         *      - {Boolean}     disableItemHide     motionType='none'시 비활성화 아이템 감추지 않기, 기본설정=true
         *      - {Boolean}     disableItemOverlay  motionType='slide'시 비활성화 아이템 overlay효과 주기, 기본설정=false
         */
        overlayList: function( options ) {
            this.each( function ( idx, el ) {
                var $target = $( el );

                if ( !$target.hasClass('ui-overlay-list-apply') ) {
                    $target.addClass( 'ui-overlay-list-apply' );
                    new OverlayList( $target, options );
                }
            });

            return this;
        },

        /**
         * 슬라이드 리스트 관리 (좌우 슬라이딩)
         * $(target).on('slidelist:change slidelist:init', function (e, index, total) {}) 으로 변경된 아이템의 index 반환
         * $(target).trigger( 'slidelist:timer_start slidelist:timer_stop' ) 으로 autoPlay 일시정지 재시작
         * @param {Object}      options
         *      - {Boolean}     autoPlay    자동 플레이 설정, 기본설정=false
         *      - {Number}      delayTime   autoPlay 지연시간 (1000/1초), 기본설정=4000
         *      - {String}      motionType  "slide", "none" 기본설정="none"
         *      - {String}      axis        motionType이 "slide"였을때 슬라이드 방향축, "vertical", "horizontal" 기본설정="horizontal"
         *      - {Number}      duration    모션이 animate되는 속도, 기본설정=400
         *      - {Int}         viewLength   화면의 보여질 갯수, 기본설정=1
         *      - {Int}         moveLength  버튼 클릭시 한번에 움직여야 하는 갯수, 기본설정=viewLength
         *      - {Boolean}     loop        아이템이 끝이 없이 무한으로 보여져야 할때 true, 기본설정=false
         *      - {Boolean}     eventBlock    클릭이벤트 전달을 막는다. (a href=의 동작을 막는다), 기본설정=false
         *      - {Number}      itemWidth   아이템 하나의 가로사이를 해당값으로 계산 되도록 설정
         */
        slideList: function( options ) {
            this.each( function ( idx, el ) {
                var $target = $( el );

                if ( !$target.hasClass('ui-slide-list-apply') ) {
                    $target.addClass( 'ui-slide-list-apply' );
                    new SlideList( $target, options );
                }
            });

            return this;
        },

        /**
         * Triple Type Swipe Slide 관리
         * @param {Object}  options
         *      - {Boolean}   autoPlay    자동 플레이 설정
         *      - {Number}    delayTime   autoPlay 지연시간 (1000/1초) 기본값 4000
         *      - {Number}    duration    모션이 animate되는 속도, 기본설정=400
         *      - {Number}    startX      모션이 시작되는 X좌표
         */
        tripleSlide: function ( options ) {
            this.each( function ( idx, el ) {
                var _options = options || {};

                if ( !$( el ).hasClass('ui-triple-slide-apply') ) {
                    $( el ).addClass( 'ui-triple-slide-apply' );
                    new TripleSlide( $(this), _options );
                }
            });

            return this;
        },

        /**
         * 해당 이미지명에 _on 넣어주기
         * @param {String}    type  "on, off" on설정시 "_on"을 넣고 off설정시 "_on"을 빼준다.
         */
        changeOverImg: function ( type ) {
            this.each( function ( idx, el ) {
                var imgPath = $( el ).attr( 'src' );

                if ( imgPath ) {
                    imgPath = imgPath.replace( /(\w+)(\.[a-z]{3,4})$/i, function ( v, fileName, ext ) {
                        if ( type === 'on' ) {
                            return ( /_on$/.test(fileName) ) ? v : fileName + '_on' + ext;
                        } else {
                            return fileName.replace( /_on$/, '' ) + ext;
                        }
                    });

                    $( el ).attr( 'src', imgPath );
                }
            });

            return this;
        }
    });


    /**
     * 오버랩 베너 리스트 관리
     * @constructor
     */
    var OverlayList = function ( $target, options ) {
        var _options = options || {};

        var DELAY_TIME = _options.delayTime || 4000,
            ANI_DURATION = ( typeof _options.duration === 'number' ) ? _options.duration : 400,
            MOTION_TYPE = _options.motionType || 'none',
            DISABLE_ITEM_HIDE = ( typeof _options.disableItemHide === 'boolean' ) ? _options.disableItemHide : true,
            DISABLE_ITEM_OVERLAY = ( typeof _options.disableItemOverlay === 'boolean' ) ? _options.disableItemOverlay : false;

        var _$target = $target,
            _$ul = _$target.find( '.ui-list-items' ),
            _$items = _$ul.find( '.ui-list-item' ),
            _$controller = _$target.find( '.ui-controller' ),
            _$prevBtn = _$controller.find( '.ui-controller-prev' ),
            _$nextBtn = _$controller.find( '.ui-controller-next' ),
            _$thumbsArea = _$target.find( '.ui-thumbs' ),
            _$thumbs = _$thumbsArea.find( '.ui-thumb' );

        var _timer;

        var _itemLength = _$items.length,
            _selectedIdx = -1,
            _isDisabled = false;

        // =============== Initialize =============== //

        initialize();

        // =============== Private Methods =============== //

        function initialize () {
            setArrowState();

            if ( _itemLength > 1 ) {
                setAutoPlay();
                setButton();
                itemChange( _selectedIdx + 1, 'none', true );

                _$target.on( 'overlaylist:change_index overlaylist:timer_start overlaylist:timer_stop', function ( e, idx ) {
                    switch ( e.type ) {
                        case 'overlaylist:change_index':
                            if ( _timer ) _timer.reset().start();
                            itemChange( idx, MOTION_TYPE );
                            setArrowState();
                            break;
                        case 'overlaylist:timer_start':
                            if ( _timer ) _timer.start();
                            break;
                        case 'overlaylist:timer_stop':
                            if ( _timer ) _timer.stop();
                            break;
                    }
                });

                _$thumbs.find( 'a' ).on( 'click', function (e) {
                    e.preventDefault();
                    var $thumb = $( this ).closest( '.ui-thumb' ),
                        idx = $thumb.index();

                    itemChange( idx, MOTION_TYPE );
                    setArrowState();
                });
            } else {
                _$thumbsArea.addClass( 'disabled' );
            }

            _$target.trigger( 'overlaylist:init', [_selectedIdx, _itemLength] );
        }

        function setButton () {
            _$prevBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass( 'disabled' ) ) return;

                itemChange( _selectedIdx - 1, MOTION_TYPE );
                setArrowState();
            });

            _$nextBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass( 'disabled' ) ) return;

                itemChange( _selectedIdx + 1, MOTION_TYPE );
                setArrowState();
            });

            if ( _options.autoPlay ) {
                _$prevBtn.on( 'mouseover mouseout', mouseHandler );
                _$nextBtn.on( 'mouseover mouseout', mouseHandler );
                _$ul.on( 'mouseover mouseout', '.ui-list-item', mouseHandler );
                _$thumbs.on( 'mouseover mouseout', mouseHandler );
            }
        }

        function setAutoPlay () {
            if ( !_options.autoPlay ) return;

            _timer = new $B.utils.Timer( DELAY_TIME, _itemLength, {
                onTimer: function (e) {
                    itemChange( _selectedIdx + 1, MOTION_TYPE );
                    setArrowState();
                },
                onComplete: function (e) {
                    _timer.reset().start();
                }
            }).start();
        }

        function mouseHandler (e) {
            if ( e.type === 'mouseover' ) {
                if ( _timer ) _timer.stop();
            } else {
                if ( _timer ) _timer.reset().start();
            }
        }

        function itemChange ( idx, motionType, silent ) {
            if ( _selectedIdx == idx || _isDisabled ) return;
            if ( idx >= _itemLength ) {
                idx = 0;
            } else if ( idx < 0 ) {
                idx = _itemLength - 1;
            }

            var $item = _$items.eq( idx ),
                $oldItem = _$items.eq( _selectedIdx );

            if ( motionType === 'overlay' ) {
                _isDisabled = true;
                $oldItem.css({
                    display: 'block'
                });

                if ( DISABLE_ITEM_OVERLAY ) {
                    _$items.stop().animate( {opacity: 0}, {
                        duration: ANI_DURATION
                    });
                }

                $item.stop().css({
                    display: 'block',
                    opacity: 0
                });

                _$ul.append( $item );
                $item.stop().animate( {opacity: 1}, {
                    duration: ANI_DURATION,
                    complete: function () {
                        _isDisabled = false;
                    }
                });
            } else {
                if ( DISABLE_ITEM_HIDE || silent ) $oldItem.css( 'display', 'none' );
                $item.css( 'display', 'block' );
                _$ul.append( $item );
            }

            //thumbs
            _$thumbs.removeClass( 'active' ).eq( idx ).addClass( 'active' );

            _selectedIdx = idx;

            if ( !silent ) _$target.trigger( 'overlaylist:change', [_selectedIdx, _itemLength] );
        }

        //좌우화살표 상태 처리
        function setArrowState () {
            if ( _itemLength < 2) {
                _$prevBtn.attr( 'disabled', true ).addClass( 'disabled' );
                _$nextBtn.attr( 'disabled', true ).addClass( 'disabled' );
                _$controller.addClass( 'disabled' );
            } else {
                if ( !_options.loop || (!_options.loop && _options.autoPlay) ) {
                    //prev
                    if ( _selectedIdx > 0 ) {
                        _$prevBtn.attr( 'disabled', false ).removeClass( 'disabled' );
                    } else {
                        _$prevBtn.attr( 'disabled', true ).addClass( 'disabled' );
                    }

                    //next
                    if ( _selectedIdx < _itemLength - 1  ) {
                        _$nextBtn.attr( 'disabled', false ).removeClass( 'disabled' );
                    } else {
                        _$nextBtn.attr( 'disabled', true ).addClass( 'disabled' );
                    }
                }
            }
        }
    };


    /**
     * 슬라이드 리스트 관리
     * @constructor
     */
    var SlideList = function ( $target, options ) {
        var _options = options || {};

        var VIEW_LENGTH = _options.viewLength || 1,
            DELAY_TIME = _options.delayTime || 4000,
            ANI_DURATION = ( typeof _options.duration === 'number' ) ? _options.duration : 400,
            MOTION_TYPE = _options.motionType || 'none',
            AXIS = _options.axis || 'horizontal',
            EVENT_BLOCK = _options.eventBlock || false;

        var _$target = $target,
            _$viewport = _$target.find( '.ui-list-viewport' ),
            _$ul = _$target.find( '.ui-list-items' ),
            _$controller = _$target.find( '.ui-controller' ),
            _$prevBtn = _$controller.find( '.ui-controller-prev' ),
            _$nextBtn = _$controller.find( '.ui-controller-next' ),
            _$items;

        var _timer,
            _listIndexManager;

        var _originItemLength, _itemLength, _itemSize, _maxIdx,
            _originSelectedIdx = -1,
            _isDisabled = false;

        // =============== Initialize =============== //

        initialize();

        // =============== Private Methods =============== //

        function initialize () {
            getItems();
            _originItemLength = _itemLength;
            setItems();

            if ( _itemLength > VIEW_LENGTH ) {
                getSize();
                setSize();
            }

            setButton();
            setAutoPlay();
            selectItem( 0, true );
            setArrowState( 0 );

            _listIndexManager = new ListIndexManager( _originItemLength, _options, {
                onChangeOriginIndex: listIndexEventHandler,
                onChangeIndex: listIndexEventHandler,
                onCorrectIndex: listIndexEventHandler
            });

            _$target.on( 'slidelist:timer_start slidelist:timer_stop', function (e) {
                if ( e.type === 'slidelist:timer_start' ) {
                    if ( _timer ) _timer.start();
                } else {
                    if ( _timer ) _timer.stop();
                }
            });

            _$target.trigger( 'slidelist:init', [_originSelectedIdx, _originItemLength] );
        }

        function listIndexEventHandler (e) {
            //console.log( '>>>>>>>>', e.type, '  index:', e.index, e.originIndex );
            switch ( e.type ) {
                case 'change-origin-index':
                    selectItem( e.originIndex );
                    break;
                case 'change-index':
                    itemMove( e.index, MOTION_TYPE );
                    break;
                case 'correct-index':
                    itemMove( e.index, 'none' );
                    break
            }
        }

        function getItems () {
            _$items = _$ul.find( '.ui-list-item' );
            _itemLength = _$items.length;
            _maxIdx = _itemLength - VIEW_LENGTH;
        }

        //아이템 origin 갯수 대비 실제 갯수 설정
        function setItems () {
            _$items.each( function ( idx, el ) {
                //origin-index 속성 추가
                $( el ).attr( 'data-origin-idx', idx );
            });

            if ( _options.loop && _itemLength > VIEW_LENGTH ) {
                cloneItem();
                getItems();
            }

            _$items.each( function ( idx, el ) {
                //index 속성 추가
                $( el ).attr( 'data-idx', idx );
            });
        }

        //아이템 복사
        function cloneItem () {
            var $firstItems = _$items.slice( _itemLength - VIEW_LENGTH, _itemLength ).clone(),
                $lastItems = _$items.slice( 0, VIEW_LENGTH ).clone();

            if ( $firstItems.length ) $firstItems.insertBefore( _$items.eq(0) );
            if ( $lastItems.length ) _$ul.append( $lastItems );
        }

        function setButton () {
            _$prevBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass('disabled') || _isDisabled ) return;
                _listIndexManager.prev();
            });

            _$nextBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass('disabled') || _isDisabled ) return;
                _listIndexManager.next();
            });

            _$ul.on( 'click', '.ui-list-item > a', function (e) {
                if ( EVENT_BLOCK ) e.preventDefault();
                var $target = $( e.currentTarget ).closest( '.ui-list-item' ),
                    originIdx = $target.data( 'origin-idx' ),
                    idx = $target.data( 'idx' );

                selectItem( originIdx );
            });

            if ( _options.autoPlay ) {
                _$prevBtn.on( 'mouseover mouseout', mouseHandler );
                _$nextBtn.on( 'mouseover mouseout', mouseHandler );
                _$ul.on( 'mouseover mouseout', '.ui-list-item', mouseHandler );
            }
        }

        function mouseHandler (e) {
            if ( e.type === 'mouseover' ) {
                if ( _timer ) _timer.stop();
            } else {
                if ( _timer ) _timer.reset().start();
            }
        }

        //아이템 이동
        function itemMove ( idx, motionType ) {
            if ( _isDisabled ) return;

            var posStyle = {};

            _isDisabled = true;
            setArrowState( idx );

            if ( AXIS === 'horizontal' ) {
                posStyle = {
                    marginLeft: indexToPosition( idx ) + 'px'
                }
            } else {
                posStyle = {
                    marginTop: indexToPosition( idx ) + 'px'
                }
            }

            if ( motionType === 'slide' ) {
                _$ul.animate( posStyle, {
                    duration: ANI_DURATION,
                    complete: function () {
                        _isDisabled = false;
                    }
                });
            } else {
                _$ul.css( posStyle );
                _isDisabled = false;
            }
        }

        //선택된 item 활성화
        function selectItem ( originIdx, silent ) {
            if ( _originSelectedIdx == originIdx || _isDisabled ) return;

            //_$items.removeClass( 'active' ).filter( '[data-origin-idx=' + originIdx + ']' ).addClass( 'active' );
            _originSelectedIdx = originIdx;

            //이벤트 전달
            if ( !silent ) _$target.trigger( 'slidelist:change', [originIdx, _originItemLength] );
        }

        function setAutoPlay () {
            if ( !_options.autoPlay ) return;

            _timer = new $B.utils.Timer( DELAY_TIME, _itemLength, {
                onTimer: function (e) {
                    _listIndexManager.next();
                },
                onComplete: function (e) {
                    _timer.reset().start();
                }
            }).start();
        }

        //좌표 반환
        function indexToPosition ( idx ) {
            return -( idx * _itemSize );
        }

        //ul 사이즈 설정
        function setSize () {
            if ( _itemLength > VIEW_LENGTH ) {
                _$ul.css( (AXIS === 'horizontal') ? 'width' : 'height', _itemLength * _itemSize + 'px' );
            }
        }

        function getSize () {
            if ( _options.itemWidth ) {
                _itemSize = _options.itemWidth;
            } else {
                if ( _itemLength > 1 ) {
                    _itemSize = Math.max( getItemSize(0), getItemSize(1) );
                } else {
                    _itemSize = getItemSize( 0 );
                }
            }
        }

        function getItemSize ( idx ) {
            var marginFirstName, marginLastName, methodName;

            if ( AXIS === 'horizontal' ) {
                marginFirstName = 'marginLeft';
                marginLastName = 'marginRight';
                methodName = 'outerWidth';
            } else {
                marginFirstName = 'marginTop';
                marginLastName = 'marginBottom';
                methodName = 'outerHeight';
            }

            var marginFirst = _$items.eq( idx ).css( marginFirstName ),
                marginLast = _$items.eq( idx ).css( marginLastName );

            marginFirst = Number( $B.style.parseValue(marginFirst).value );
            marginLast = Number( $B.style.parseValue(marginLast).value );

            return _$items.eq( idx )[methodName]() + marginFirst + marginLast;
        }

        //좌우화살표 상태 처리
        function setArrowState ( idx ) {
            if ( _itemLength <= VIEW_LENGTH ) {
                _$prevBtn.attr( 'disabled', true ).addClass( 'disabled' );
                _$nextBtn.attr( 'disabled', true ).addClass( 'disabled' );
                _$controller.addClass( 'disabled' );
            } else {
                if ( !_options.loop ) {
                    //prev
                    if ( idx > 0 ) {
                        _$prevBtn.attr( 'disabled', false ).removeClass( 'disabled' );
                    } else {
                        _$prevBtn.attr( 'disabled', true ).addClass( 'disabled' );
                    }

                    //next
                    if ( idx < _maxIdx  ) {
                        _$nextBtn.attr( 'disabled', false ).removeClass( 'disabled' );
                    } else {
                        _$nextBtn.attr( 'disabled', true ).addClass( 'disabled' );
                    }
                }
            }
        }
    };

    /**
     * 리스트형 Index Data 관리
     * @param {Int}         totalLength
     * @param {Object}      options
     *      - {Int}         viewLength  화면의 보여질 갯수, 기본설정=1
     *      - {Int}         moveLength 이동시 한 구간의 갯수, 기본설정=viewLength
     *      - {Boolean}     loop        아이템이 끝이 없이 무한으로 보여져야 할때 true, 기본설정=false
     * @param {Object}      dispatchs   전달 받을 이벤트들
     *      - {Function}    onChangeOriginIndex   index가 변경되었으시 callback {type:'change', originIndex, index}
     *      - {Function}    onChangeIndex   index가 변경되었으시 callback {type:'change', originIndex, index}
     *      - {Function}    onCorrectIndex  rangeIndex 보정이 발생시 callback {type:'correct', originIndex, index}
     */
    var ListIndexManager = function ( totalLength, options, dispatchs ) {
        var _options = ( typeof options === 'object' ) ? options : {},
            _dispatchs = ( typeof dispatchs === 'object' ) ? dispatchs : {};

        var VIEW_LENGTH = _options.viewLength || 1,
            MOVE_LENGTH = ( _options.moveLength ) ? Math.min( VIEW_LENGTH, _options.moveLength ) : VIEW_LENGTH;

        var _selectIdx = -1,
            _moveIdx = -1,
            _originIdx = -1,
            _originStartIdx = 0, _originEndIdx = 0,
            _originLength = totalLength,
            _totalLength = _originLength;

        // ========== Initialize ========== //
        initialize();

        // ========== Public Methods ========== //

        //구간이동
        this.prev = function () {
            var originIdx = correctOriginIdx( _originIdx - MOVE_LENGTH );
            //추가
            eventDispatch( 'change-origin-index', originIdx );
            setOriginIdxToSelectIdx( originIdx, -MOVE_LENGTH, 'prev' );
            return this;
        };

        this.next = function () {
            var originIdx = correctOriginIdx( _originIdx + MOVE_LENGTH );
            //추가
            eventDispatch( 'change-origin-index', originIdx );
            setOriginIdxToSelectIdx( originIdx, MOVE_LENGTH, 'next' );
            return this;
        };

        this.setIndex = function ( originIdx, rangeLength, direction ) {
            var originIdx = correctOriginIdx(originIdx);
            eventDispatch( 'change-origin-index', originIdx );
            setOriginIdxToSelectIdx( originIdx, rangeLength, direction );
            return this;
        };

        // ========== Protected Methods ========== //
        function initialize () {
            if ( _options.loop ) {
                if ( _totalLength > VIEW_LENGTH ) {
                    _totalLength = _originLength + ( VIEW_LENGTH * 2 );
                    _originStartIdx = VIEW_LENGTH;
                    _originEndIdx = _originStartIdx + _originLength - 1;
                }
            }

            _selectIdx = _originStartIdx;
            _moveIdx = _selectIdx;
            _originIdx = 0;

            eventDispatch( 'correct-index', _originStartIdx );
            eventDispatch( 'change-origin-index', 0 );
        }

        function setOriginIdxToSelectIdx ( originIdx, rangeLength, direction ) {
            //이동할 index를 미리 확인하여, 보정할것인지 바꿀것인지 결정
            var nextSelectIdx = _selectIdx + rangeLength,
                isCorrect = isCorrectSelecteIdx( nextSelectIdx, direction ),
                correctSelectIdx;

            //console.log( 'originIdx:', originIdx, '  _selectIdx:', _selectIdx, '  direction:', direction );
            //console.log( 'nextSelectIdx:', nextSelectIdx, '  _moveIdx:', _moveIdx, ' 보정?:', isCorrect );

            if ( _options.loop ) {
                if ( isCorrect ) {
                    correctSelectIdx = getCorrectSelectIdx( _moveIdx, direction );
                    eventDispatch( 'correct-index', correctSelectIdx );
                    //보정이후 selectIdx도 보정
                    nextSelectIdx = getCorrectSelectIdx( nextSelectIdx, direction );
                    eventDispatch( 'change-index', nextSelectIdx );
                } else {
                    eventDispatch( 'change-index', nextSelectIdx );
                }
            } else {
                nextSelectIdx = getCorrectSelectIdx( nextSelectIdx, direction );
                eventDispatch( 'change-index', nextSelectIdx );
            }
        }

        function getCorrectSelectIdx ( selectIdx, direction ) {
            var result = 0;

            if ( _options.loop ) {
                var endIdx = ( _originStartIdx + _originLength );

                if ( direction === 'next' ) {
                    result = ( selectIdx + VIEW_LENGTH ) - endIdx;
                } else {
                    result = endIdx - ( VIEW_LENGTH - selectIdx );
                }
            } else {
                var rest = _originLength % VIEW_LENGTH;

                if ( selectIdx >= _originLength - rest ) {
                    result = selectIdx - ( MOVE_LENGTH - rest );
                    if (rest > MOVE_LENGTH) {
                    	result = selectIdx;
                    }
                } else if ( selectIdx < 0 ) {
                    result = 0;
                } else {
                    result = selectIdx;
                }
            }

            return result;
        }

        function isCorrectSelecteIdx ( selectIdx, direction ) {
            var result = false;

            if ( direction === 'next' ) {
                if ( selectIdx + VIEW_LENGTH > _totalLength - 1 ) result = true;
            } else {
                if ( selectIdx < 0 ) result = true;
            }

            return result;
        }

        //한번 움직일양 계산
        function getRangeLength ( originIdx ) {
            var currentOriginIdx = selectIdxToOriginIdx( _selectIdx ),
                result = 0;

            if ( originIdx > _originLength ) {
                result = originIdx - _originLength;
            } else if ( originIdx < 0 ) {
                result = originIdx;
            } else {
                result = originIdx - currentOriginIdx;
            }
            return result;
        }

        //selectIdx 대비 originIdx 반환
        function selectIdxToOriginIdx ( selectIdx ) {
            var result = -1;

            if ( selectIdx < _originStartIdx ) {
                result = ( _originLength - _originStartIdx ) + selectIdx;
            } else if ( _options.loop && selectIdx > _originEndIdx ) {
                result = selectIdx - ( _originLength + _originStartIdx );
            } else {
                result = selectIdx - _originStartIdx;
            }

            return result;
        }

        //origin index 최대, 최소값 보정
        function correctOriginIdx ( originIdx ) {
            if ( originIdx < 0 ) {
                originIdx = _originLength + originIdx;
            } else if ( originIdx > _originLength - 1 ) {
                originIdx = originIdx - _originLength;
            }

            return originIdx;
        }

        //다음 화면의 보여지는 영역에 있는지 체크
        function isViewNextIndex ( nextSelectIdx, auto ) {
            var range = ( auto ) ? MOVE_LENGTH : VIEW_LENGTH;
            return _moveIdx <= nextSelectIdx && ( _moveIdx + range ) > nextSelectIdx;
        }

        function eventDispatch ( type, idx ) {
            var callIdx = _moveIdx;

            if ( type === 'change-origin-index' ) {
                _originIdx = idx;
            } else {
                _selectIdx = idx;

                if ( type === 'change-index' ) {
                    //var isView = isViewNextIndex(idx);
                    //console.log( '---isView:', isView, ' idx:', idx );
                    //
                    //if ( isView ) {
                    //    return;
                    //} else {
                    //    _moveIdx = idx;
                    //}

                    _moveIdx = idx;

                    callIdx = _moveIdx;
                } else {
                    callIdx = idx;
                    _moveIdx = idx;
                }

                _originIdx = selectIdxToOriginIdx( _selectIdx );
            }

            var eventName = 'on' + $B.string.capitalize( $B.string.camelCase(type) );
            if ( _dispatchs[eventName] ) _dispatchs[eventName].call( this, {type: type, originIndex: _originIdx, index: callIdx} );
        }
    };

    /**
     * Triple Type Swipe Slide 관리
     * @constructor
     */
    var TripleSlide = function ( $target, options ) {
        var _options = options || {};

        var VIEW_LENGTH = 3;

        var _$target = $target,
            _$ul = _$target.find( '.ui-list-items' ),
            _$items = _$ul.find( '.ui-list-item' ),
            _$controller = _$target.find( '.ui-controller' ),
            _$prevBtn = _$controller.find( '.ui-controller-prev' ),
            _$nextBtn = _$controller.find( '.ui-controller-next' ),
            _$thumbArea = _$controller.find( '.ui-thumbs' ),
            _$thumbs;

        var _itemOriginLength = _$items.length,
            _itemLength = _itemOriginLength,
            _isDisabled = false,
            _itemSize = 0,
            _selectIdx = -1,
            _originIdx = _selectIdx;

        var _timer;

        /* ----- Initialize ----- */
        initialize();

        /* ----- Protected Methods ----- */

        function initialize () {
            setItems();
            cloneThumb();
            setSize();
            addEvents();
            setAutoPlay();

            if ( _itemOriginLength >= VIEW_LENGTH ) {
                moveTo( 2 );
                selectItem( _selectIdx );
            }
        }

        function setItems () {
            _$items.each( function ( idx, el ) {
                $( el ).attr( 'data-origin-idx', idx );
            });
            //3개 보다 작을때
            if ( _itemOriginLength >= VIEW_LENGTH ) cloneItems();

            _$items.each( function ( idx, el ) {
                $( el ).attr( 'data-idx', idx );
            });
        }

        function cloneThumb () {
            var thumbHtml = _$thumbArea.html(),
                html = '';

            for ( var i = 0; i < _itemOriginLength; ++i ) {
                html += thumbHtml;
            }

            _$thumbArea.html( html );
            _$thumbs = _$thumbArea.find( '.ui-thumb' );
        }

        function setAutoPlay () {
            if ( _options.autoPlay ) {
                _timer = new $B.utils.Timer( _options.delayTime || 4000, 0, {
                    onTimer: function (e) {
                        move( 'next', 1 );
                    }
                }).start();
            }
        }

        function addEvents () {
            _$target.on( 'mouseover mouseout', mouseHandler );

            _$prevBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass('disabled') ) return;
                move( 'prev', 1 );
            });

            _$nextBtn.on( 'click', function (e) {
                e.preventDefault();
                if ( $(this).hasClass('disabled') ) return;
                move( 'next', 1 );
            });

            _$thumbs.find( '>a' ).on( 'click', function (e) {
                e.preventDefault();
                if ( _isDisabled ) return;

                var originIdx = $( this ).closest( '.ui-thumb' ).index();

                if ( _originIdx < originIdx ) {
                    move( 'next', originIdx - _originIdx );
                } else if ( _originIdx > originIdx ) {
                    move( 'prev', _originIdx - originIdx );
                }
            });
        }

        function mouseHandler (e) {
            if ( e.type === 'mouseover' ) {
                if ( _timer ) _timer.stop();
            } else {
                if ( _timer ) _timer.reset().start();
            }
        }

        function selectItem ( idx ) {
            var originIdx = _$items.eq( idx ).data( 'origin-idx' );
            _$thumbs.removeClass( 'active' ).eq( originIdx ).addClass( 'active' );
            _originIdx = originIdx;
            _selectIdx = idx;
        }

        function move ( type, range ) {
            if ( _isDisabled ) return;
            _isDisabled = true;

            var nextIdx;

            if ( type === 'next' ) {
                nextIdx = _selectIdx + range;
            } else {
                nextIdx = _selectIdx - range;
            }

            _$ul.stop().animate({ marginLeft: getItemX(nextIdx) + 'px' }, {
                duration: _options.duration || 400,
                complete: function () {
                    moveComplete( type );
                }
            });

            _selectIdx = nextIdx;
        }

        function moveTo ( idx ) {
            _$ul.stop().css({ marginLeft: getItemX(idx) + 'px' });
            _selectIdx = idx;
        }

        function moveComplete ( type ) {
            _isDisabled = false;

            //위치 보정
            var correctIdx = correctSelectIdx( type );
            if ( correctIdx > -1 ) moveTo( correctIdx );

            selectItem( _selectIdx );
        }

        function correctSelectIdx ( type ) {
            var result = -1;

            if ( type === 'next' ) {
                if ( _selectIdx + 1 === _itemLength - 1 ) {
                    result = 2;
                }
            } else {
                if ( _selectIdx === 1 ) {
                    result = _itemLength - 3;
                }
            }

            return result;
        }

        function getItemX ( idx ) {
            return -( (_itemSize * idx) - (_options.startX || 0) );
        }

        function cloneItems () {
            var $firstItems = _$items.slice( _itemLength - 2, _itemLength ).clone(),
                $lastItems = _$items.slice( 0, 2 ).clone();

            if ( $firstItems.length ) $firstItems.insertBefore( _$items.eq(0) );
            if ( $lastItems.length ) _$ul.append( $lastItems );

            _$items = _$ul.find( '.ui-list-item' );
            _itemLength = _$items.length;
        }

        function setSize () {
            _itemSize = _$items.outerWidth();
            _$ul.css( 'width', (_itemSize * _itemLength) + 'px' );
        }
    };


    /**
     * NumberCounter
     * @constructor
     */
    var NumberCounter = function ( $target ) {
        var _$target = $target,
            _$increase = _$target.find( '.ui-increase' ),
            _$decrease = _$target.find( '.ui-decrease' ),
            _$input = _$target.find( '.ui-number-input' );

        var _min = 0,
            _max = 1,
            _isDisabled = false;


        // ========== Initialize ========== //
        initialize();

        // ========== Protected Methods ========== //

        function initialize () {
            setOption();
            setBtnStatus( Number(_$input.val()) );

            _$increase.on( 'click', buttonHandler );
            _$decrease.on( 'click', buttonHandler );
            _$input.on( 'numbercounter:change_value', function (e, value) {
                value = Number( value );
                rangeCorrection( value );
                setBtnStatus( value );
            });
            _$target.addClass( 'ui-number-counter-apply' );
        }

        function setOption () {
            _min = _$input.attr( 'min' );
            _max = _$input.attr( 'max' );
            _isDisabled = _$input.attr( 'disabled' );

            if ( _isDisabled ) {
                _$input.addClass( 'disabled' );
            } else {
                _$input.removeClass( 'disabled' );
            }

            if ( !_min ) _min = 0;
            if ( !_max ) _max = 1;
            if ( !_min > _max ) _min = _max;
        }

        function buttonHandler (e) {
            var count = _$input.val();

            if ( $(e.currentTarget).hasClass('ui-increase') ) {
                count++;
            } else {
                count--;
            }

            rangeCorrection( count );
            setBtnStatus( count );
        }

        //최소, 최대 값을 벗어나면 조절하여 input에 출력
        function rangeCorrection ( val, silent ) {
            var oldValue = _$input.val();

            if ( _max < val ) {
                val = _max;
            } else if ( _min > val ) {
                val = _min;
            }

            _$input.val( val );

            if ( !silent && oldValue !== val ) {
                _$input.trigger( 'change' );
            }
        }

        //버튼 상태 설정
        function setBtnStatus ( val ) {
            if ( _isDisabled ) {
                _$increase.attr( 'disabled', true ).addClass( 'disabled' );
                _$decrease.attr( 'disabled', true ).addClass( 'disabled' );

                return;
            }

            if ( _max <= val ) {
                _$increase.attr( 'disabled', true ).addClass( 'disabled' );
            } else {
                _$increase.attr( 'disabled', false ).removeClass( 'disabled' );
            }
            if ( _min >= val ) {
                _$decrease.attr( 'disabled', true ).addClass( 'disabled' );
            } else {
                _$decrease.attr( 'disabled', false ).removeClass( 'disabled' );
            }
        }
    };


    /**
     * RangeSlider
     * @constructor
     */
    var RangeSlider = function ( $target, options ) {
        var _options = options || {};

        var _$target = $target,
            _$minInput = _$target.find( '.ui-range-slider-min-input' ),
            _$maxInput = _$target.find( '.ui-range-slider-max-input' ),
            _$minIcon = _$target.find( '.ui-range-slider-min-icon' ),
            _$maxIcon = _$target.find( '.ui-range-slider-max-icon' ),
            _$slideBar = _$target.find( '.ui-range-slider-bar' ),
            _$progress = _$target.find( '.ui-range-slider-progress' );

        var _min = 0, _max = 0,
            _iconWidth = _$minIcon.width(),
            _values, _currentMin, _currentMax, _activeBtnType,
            _range, _rangeMin, _rangeMax;

        // ========== Initialize ========== //
        initialize();

        // ========== Protected Methods ========== //

        function initialize () {
            setData();
            addEvents();

            _$target.on( 'rangeslider:reset', function ( e, minValue, maxValue ) {
                resetData( minValue, maxValue );
            });

            if ( $B.array.is(_options.values) && _options.values.length > 1 ) {
                resetData( _currentMin, _currentMax );
            } else {
                resetData( _min, _max, true );
            }
        }

        function addEvents () {
            _$minInput.on( 'keydown focusin focusout', keyHandler );
            _$maxInput.on( 'keydown focusin focusout', keyHandler );
            _$minIcon.on( 'mousedown click', dragHandler );
            _$maxIcon.on( 'mousedown click', dragHandler );
        }

        function dragHandler (e) {
            e.preventDefault();
            //e.stopPropagation();

            switch ( e.type ) {
                case 'mousedown':
                    _activeBtnType = $( this ).hasClass( 'ui-range-slider-min-icon' ) ? 'min' : 'max';
                    $( document ).on( 'mousemove', dragHandler );
                    $( document ).on( 'mouseup', dragHandler );
                    $( this ).focus();
                    break;
                case 'mouseup':
                    _activeBtnType = '';
                    $( document ).off( 'mousemove', dragHandler );
                    $( document ).off( 'mouseup', dragHandler );
                    break;
                case 'mousemove':
                    var posX = e.clientX - _$slideBar.offset().left,
                        posPer = pxToPercent( posX ),
                        percent = getCorrectX( _activeBtnType, posPer ),
                        value = percentToValue( percent );

                    setIconPosition( _activeBtnType, percent );
                    setInputValue( _activeBtnType, value );
                    break;
            }
        }

        function keyHandler (e) {
            var type = ( $(this).hasClass('ui-range-slider-min-input') ) ? 'min' : 'max';

            if ( e.type === 'keydown' ) {
                if ( !isNumberKeyCode(e.which) ) e.preventDefault();
            } else if ( e.type === 'focusin' ) {
                if ( type === 'min' ) {
                    setInputValue( type, _currentMin, true, true );
                } else {
                    setInputValue( type, _currentMax, true, true );
                }
            } else {
                correctValue( type );

                if ( type === 'min' ) {
                    setIconPosition( type, valueToPercent(_currentMin) );
                } else {
                    setIconPosition( type, valueToPercent(_currentMax) );
                }
            }
        }

        function setIconPosition ( type, percent ) {
            var iconW = pxToPercent( _iconWidth );

            if ( type === 'min' ) {
                var maxPer = valueToPercent( _currentMax );
                _$minIcon.css( 'left', percent + '%' );
                _$progress.css({
                    left: percent + '%',
                    width: ( maxPer - percent ) + '%'
                });
            } else {
                var minPer = valueToPercent( _currentMin );
                _$maxIcon.css( 'left', percent + '%' );
                _$progress.css( 'width', (percent - minPer) + '%' );
            }
        }

        function pxToPercent ( x ) {
            return x / _$slideBar.width() * 100;
        }

        function valueToPercent ( value ) {
            return ( value - _min ) / ( _max - _min ) * 100;
        }

        function percentToValue ( per ) {
            return ( (( _max - _min ) * per) / 100 ) + _min;
        }

        //최소 최대치를 넘지않게 보정하여 퍼센트로 반환
        function getCorrectX ( type, percentX ) {
            if ( type === 'min' ) {
                var max = valueToPercent( _currentMax );
                //TODO: range 값 반영하기

                if ( percentX < 0 ) {
                    percentX = 0;
                } else if ( max < percentX ) {
                    percentX = max;
                }
            } else {
                var min = valueToPercent( _currentMin );

                if ( percentX > 100 ) {
                    percentX = 100;
                } else if ( min > percentX ) {
                    percentX = min;
                }
            }

            return percentX;
        }

        function getInputValue ( type ) {
            var value = '';

            if ( type === 'min' ) {
                value = _$minInput.val();
            } else {
                value = _$maxInput.val();
            }

            return Number( value.replace(/,/g, '') );
        }

        function setInputValue ( type, value, silent, isValue ) {
            var rangeValue = valueToRangeValue( value ),
                viewString = valueToNumberFormat( rangeValue, isValue ),
                isChange = isChangeValue( type, rangeValue );

            if ( type === 'min' ) {
                _$minInput.val( viewString );
                _rangeMin = rangeValue;
                _currentMin = value;
            } else {
                _$maxInput.val( viewString );
                _rangeMax = rangeValue;
                _currentMax = value;
            }

            if ( !silent && isChange ) _$target.trigger( 'rangeslider:change', [_rangeMin, _rangeMax] );
        }

        function valueToRangeValue ( value ) {
            return Math.floor( value / _range ) * _range;
        }

        function valueToNumberFormat ( value, isValue ) {
            if ( !isValue && _options.numberFormat ) value = $B.string.numberFormat( value );
            return value;
        }

        function isChangeValue ( type, value ) {
            if ( type === 'min' ) {
                return _rangeMin !== value;
            } else {
                return _rangeMax !== value;
            }
        }

        function correctValue ( type, minValue, maxValue, slient ) {
            var minValue = ( typeof minValue === 'number' ) ? minValue : getInputValue( 'min' );
            var maxValue = ( typeof maxValue === 'number' ) ? maxValue : getInputValue( 'max' );

            if ( _min > minValue ) minValue = _min;
            if ( _max < maxValue ) maxValue = _max;

            if ( type === 'min' ) {
                if ( _rangeMax <= minValue ) minValue = _rangeMax - _range;
                setInputValue( type, minValue, slient );
            } else if ( type === 'max' ) {
                if ( _rangeMin >= maxValue ) maxValue = _rangeMin + _range;
                setInputValue( type, maxValue, slient );
            } else {
                if ( _rangeMin >= maxValue ) maxValue = _rangeMin + _range;
                if ( maxValue <= minValue ) minValue = _rangeMax - _range;
                setInputValue( 'min', minValue, slient );
                setInputValue( 'max', maxValue, slient );
            }
        }

        function isNumberKeyCode ( keyCode ) {
            //숫자키, 백스페이스, Delete, Tab, Shift
            return ( (keyCode > 47 && keyCode < 58) || (keyCode > 95 && keyCode < 106)
                        || keyCode === 8 || keyCode === 9 || keyCode === 16 || keyCode === 46 );
        }

        function resetData ( min, max, slient ) {
            correctValue( 'all', min, max, slient );
            setIconPosition( 'min', valueToPercent(_currentMin) );
            setIconPosition( 'max', valueToPercent(_currentMax) );
        }

        function setData () {
            _min = getInputValue( 'min' );
            _max = getInputValue( 'max' );

            _range = _options.range || 1;

            if ( $B.array.is(_options.values) && _options.values.length > 1 ) {
                _values = _options.values;
            } else {
                _values = [_min, _max];
            }

            _currentMin = _values[0];
            _currentMax = _values[1];
            _rangeMin = _currentMin;
            _rangeMax = _currentMax;
        }
    };


    /**
     * SelectBox
     * @constructor
     */
    var SelectBox = function ( $target, id, options ) {
        var _options = options || {},
            _id = id;

        var _this = this,
            _$target = $target,
            _$originSelect = $target.find( 'select.ui-input-select' ),
            _$face = $target.find( '.ui-select-box-face' ),
            _$container = _$target.find( '.ui-select-options' );

        var _isOpen = false,
            _selectIdx = -1;

        // ========== Initialize ========== //
        initialize();

        // ========== Public Methods ========== //
        this.closeOption = function () {
            if ( _isOpen ) {
                _$container.removeClass( 'active' );
                _$container.removeClass( 'select_bottom' );
                _isOpen = false;
            }
        };

        // ========== Protected Methods ========== //

        function initialize () {
            update( true );
            addEvent();

            _$originSelect.css( 'display', 'none' );
            _$target.addClass( 'ui-select-box-apply' );
        }

        function update ( silent ) {
            drawFace();
            drawOptions();
            setSelectOption( _$originSelect.find('option[selected=selected]' ).index(), silent );
            setSelectDisabled();
            setSelectBoxWidth();
        }

        function addEvent () {
            _$target.on( 'selectbox:updated', function () {
                update( true );
            });
            _$target.on( 'click', '.ui-select-box-face', toggleList );
            _$container.on( 'click', '.ui-select-option > a', optionClick );
        }

        function setSelectBoxWidth () {
            if ( _options.designOption ) return;
            _$target.css( 'width', _$originSelect.outerWidth() );
        }

        function drawFace () {
            if ( _$face.length < 1 ) {
                _$face = $( '<a href="javascript:;" class="select ui-select-box-face"></a>' );
                _$face.insertBefore( _$originSelect );
            }

            if ( _$originSelect.attr('disabled') ) {
                _$face.addClass( 'disabled' );
            } else {
                _$face.removeClass( 'disabled' );
            }
        }

        function drawOptions () {
            if ( _$container.length < 1 ) {
                _$container = $( '<ul class="option_box ui-select-options"></ul>' );
            }

            if ( _options.designOption ) {
                return;
            } else {
                _$container.find( '>.ui-select-option' ).remove();
            }

            var options = '';

            _$originSelect.find( 'option' ).each( function ( idx, el ) {
                var visibility = ( $(el).is('[visibility=hidden]') ) ? 'style="display:none"' : '';
                options += '<li class="ui-select-option" ' + visibility + '><a href="javascript:;">' + $(el).text() + '</a></li>';
            });

            _$container.append( options );
            _$target.append( _$container );
        }

        function setOptionHeight () {
            _$container.css( 'height',  'auto' );

            var minH = 150,
                winH = $( window ).height(),
                scrollY = $( window ).scrollTop(),
                posY = _$container.offset().top - scrollY,
                optionH = _$container.outerHeight(),
                faceH = _$face.outerHeight(),
                bottomH = winH - posY,//아랫공간
                topH = winH - bottomH - faceH,//윗공간
                posH = bottomH;

            //list 위아래 보여지기 설정
            //아랫공간이 작을때
            if ( topH > bottomH && bottomH < minH && bottomH < optionH ) {
                _$container.addClass( 'select_bottom' );
                posH = topH;
            } else {
                _$container.removeClass( 'select_bottom' );
            }

            if ( posH < optionH ) {
                _$container.css( 'height',  posH + 'px' );
            }

            _$container.scrollTop( 0 );
        }

        function changeSelectTitle ( value ) {
            if ( _options.designValue ) {
                _$face.html( value );
            } else {
                _$face.text( value );
            }
        }

        function setSelectOption ( selectIdx, silent ) {
            selectIdx = ( selectIdx < 0 ) ? 0 : selectIdx;

            var $options = _$originSelect.find( '>option' );

            $options.prop( 'selected', false ).attr( 'selected', false );
            $options.eq( selectIdx ).prop( 'selected', true ).attr( 'selected', true );

            _$container.find( '.ui-select-option > a' ).each( function ( idx, el ) {
                var $option = $( el );

                if ( selectIdx === idx ) {
                    $option.addClass( 'selected' );
                } else if ( $option.hasClass('selected') ) {
                    $option.removeClass( 'selected' );
                }
            });

            var selectOptionHtml = ( _options.designValue ) ?
                    _$container.find( '.ui-select-option:eq(' + selectIdx + ') > a' ).html() : $options.eq( selectIdx ).text();
            changeSelectTitle( selectOptionHtml );

            if ( silent !== true && _selectIdx !== selectIdx ) {
                _selectIdx = selectIdx;
                _$originSelect.trigger( 'change' );
            } else {
                _selectIdx = selectIdx;
            }
        }

        function setSelectDisabled () {
            var $options = _$originSelect.find( 'option' );

            _$container.find( '.ui-select-option > a' ).each( function ( idx, el ) {
                if ( $options.eq(idx).attr('disabled') ) {
                    $( el ).addClass( 'disabled' );
                }
            });
        }

        function toggleList (e) {
            if ( _$face.hasClass('disabled') ) return;

            _closeSelectOptions( _id );

            if ( _isOpen ) {
                _this.closeOption();
            } else {
                openOption();
            }

            return false;
        }

        function openOption () {
            _$container.addClass( 'active' );
            setOptionHeight();
            _isOpen = true;
        }

        function optionClick () {
            var $option = $( this ).parent();

            var idx = $option.index(),
                disabled = $option.find( '>a' ).hasClass( 'disabled' );

            if ( !disabled ) {
                toggleList();
                setSelectOption( idx );
            }

            return false;
        }
    };

    //select options 열린것들 닫기
    function _closeSelectOptions ( excludeId ) {
        var length = _selectBoxs.length;

        for ( var i = 0; i < length; ++i ) {
            if ( excludeId !== i ) {
                _selectBoxs[i].closeOption();
            }
        }
    }

    $( document ).on( 'click', _closeSelectOptions );


    /**
     * UI Modal
     */
    var UI = {
        /**
         * 모달 alert 열기
         * @param   {String}    message
         * @param   {Object}    options
         *  -   {Boolean}   textAlignCenter 메세지의 텍스트 정렬을 중앙정렬로 설정, 기본값=false
         *  -   {String}    title           별도의 타이틀을 넣을려면 입력한다.
         *  -   {String}    confirmLabel    확인 버튼 label을 새로 설정할때
         * @return  {Promise}   UI.alert(message).done(function(){//확인버튼 클릭시})
         */
        alert: function ( message, options ) {
            var options = options || {};
            options.isAlert = true;
            return this.modal( message, options );
        },

        /**
         * 모달 alert 열기
         * @param   {String}    message
         * @param   {Object}    options
         *  -   {Boolean}   textAlignCenter 메세지의 텍스트 정렬을 중앙정렬로 설정, 기본값=false
         *  -   {String}    title           별도의 타이틀을 넣을려면 입력한다.
         *  -   {String}    confirmLabel    확인 버튼 label을 새로 설정할때
         *  -   {String}    cancelLabel     취소 버튼 label을 새로 설정할때
         * @return  {Promise}   UI.confirm(message).done(function(){//확인버튼 클릭시}).fail(function(){//취소버튼 클릭시})
         */
        confirm: function ( message, options ) {
            return this.modal( message, options );
        },

        /**
         * 화면의 최상단의 모달로 레이어를 띄운다.
         * @param   {String}    message
         * @param   {Object}    options
         *  -   {Boolean}   isAlert         alert으로 띄울때, 기본설정
         *  -   {Boolean}   textAlignCenter 메세지의 텍스트 정렬을 중앙정렬로 설정, 기본값=false
         *  -   {String}    title           별도의 타이틀을 넣을려면 입력한다.
         *  -   {String}    confirmLabel    확인 버튼 label을 새로 설정할때
         *  -   {String}    cancelLabel     취소 버튼 label을 새로 설정할때
         *  -   {Boolean}   isNoDimm        Dimm Layer 사용안함 설정, 기본값=false
         *  @return  {Promise}   UI.modal(message).done(function(){//확인버튼 클릭시}).fail(function(){//취소버튼 클릭시})
         */
        modal: function ( message, options ) {
        	
            var options = options || {},
                deferred = new $.Deferred();

            var $returnFocus = $( document.activeElement ),
                $modalArea = $( '#ui-modal-area' ),
                $dim = $modalArea.find( '.ui-modal-dim' ),
                $title = $modalArea.find( '.ui-modal-title' ),
                $contents = $modalArea.find( '.ui-modal-contents-area' ),
                $close = $modalArea.find( '.ui-modal-btn-close' ),
                $btnConfirm = $modalArea.find( '.ui-modal-btn-confirm' ),
                $btnCancel = $modalArea.find( '.ui-modal-btn-cancel' ),
                $defaultLayer = $modalArea.find( '.ui-modal-default-layer' ),
                $btnArea = $modalArea.find( '.ui-modal-btn-area' );

            if ( $modalArea.hasClass('ui-modal-open-apply') ) return;
            $modalArea.addClass( 'ui-modal-open-apply' );

            if ( options.title ) {
                $title.css( 'display', 'block' ).text( options.title );
            } else {
                $title.css( 'display', 'none' ).text( '' );
            }

            $btnConfirm.text( options.confirmLabel || '확인' ).on( 'click', clickHandler );
            $btnCancel.text( options.cancelLabel || '취소' ).on( 'click', clickHandler );

            if ( options.isAlert ) {
                $close.css( 'display', 'none' );
                $btnArea.removeClass( 'both_btn' );
                $btnCancel.css( 'display', 'none' );
                $btnConfirm.focus();
            } else {
                $close.css( 'display', 'block' ).on( 'click', clickHandler ).focus();
                $btnArea.addClass( 'both_btn' );
                $btnCancel.css( 'display', 'block' );
            }

            $contents.html( message );

            if ( options.textAlignCenter ) {
                $contents.addClass( 'text_align_center' );
            } else {
                $contents.removeClass( 'text_align_center' );
            }

            if (!options.isNoDimm) {
                $dim.css( 'display', 'block' );
                $dim.css( 'z-index', '99999999' );
            }
            $defaultLayer.css( 'display', 'block' );
            $defaultLayer.css( 'z-index', '9999999999' );
            $modalArea.css( 'display', 'block' );

            //포지션
            var winH = $( window ).height(),
                layerH = $defaultLayer.outerHeight(),
                posY = ( (winH * 0.5) - (layerH * 0.5) ) / winH * 100;

            if ( posY < 0 ) posY = 0;
            $defaultLayer.css( 'top', posY + '%' );

            function clickHandler (e) {
                e.preventDefault();
                $btnConfirm.off( 'click', clickHandler );
                $btnCancel.off( 'click', clickHandler );
                $close.off( 'click', clickHandler );
                $defaultLayer.css( 'display', 'none' );
                $defaultLayer.css( 'z-index', '' );
                if (!options.isNoDimm) {
                    $dim.css( 'display', 'none' );
                    $dim.css( 'z-index', '' );
                    $modalArea.css( 'display', 'none' );
                }
                $defaultLayer.css( 'z-index', '' );
                $modalArea.removeClass( 'ui-modal-open-apply' );
                $returnFocus.focus();

                if ( $(this).hasClass('ui-modal-btn-confirm') ) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }

            return deferred.promise();
        },

        /**
         * JS중복 삽입 체크
         * @param   {String}    jsFileName  JS파일명
         */
        checkOverlapJS: function ( jsFileName ) {
            if ( UI[jsFileName] ) {
                throw new Error( '[JS 중복삽입 오류] "' + jsFileName + '.js" 파일이 중복 삽입 되었습니다.' );
            } else {
                UI[jsFileName] = true;
            }
        }
    };


    /**
     * 슬라이더
     * @constructor
     */
    var Slider = function ( $target, options ) {
        var _options = options || {};

        var MIN = _options.min || 0,
            MAX = _options.max || 1,
            RANGE = _options.range || 1;

        var _$target = $target,
            _$sliderBar = _$target.find( '.ui-slider-bar' ),
            _$thumb = _$sliderBar.find( '.ui-slider-thumb' ),
            _$value = _$sliderBar.find( '.ui-slider-value' ),
            _$progress = _$sliderBar.find( '.ui-slider-progress' );

        var _currentValue = -1,
            _moveValue = _currentValue,
            _baseWidth, _baseX;

        // ---------- Initialize ---------- //
        initialize();

        // ---------- Protected Methods ---------- //
        function initialize () {
            setSize();
            addEvents();
            setCurrentPage( _$target.data('value') || _options.value || MIN );

            dispatchEvent( 'init', _currentValue );
        }

        function setCurrentPage ( value ) {
            var per = valueToPercent( value );
            setIconPosition( per );
            setValue( per );
            _currentValue = _moveValue;
        }

        function addEvents () {
            if ( !_options.readonly ) _$thumb.on( 'mousedown', dragHandler );

            $( window ).on( 'load resize', function (e) {
                setSize();
            });
        }

        function dragHandler (e) {
            e.preventDefault();

            switch ( e.type ) {
                case 'mousedown':
                    $( document ).on( 'mousemove', dragHandler );
                    $( document ).on( 'mouseup', dragHandler );
                    break;
                case 'mouseup':
                    $( document ).off( 'mousemove', dragHandler );
                    $( document ).off( 'mouseup', dragHandler );
                    dispatchEvent( 'change', _moveValue );
                    break;
                case 'mousemove':
                    var posX = e.clientX - _baseX,
                        percent = pxToPercent( posX );

                    setIconPosition( percent );
                    setValue( percent );
                    break;
            }
        }

        function setSize () {
            _baseWidth = _options.baseWidth || _$sliderBar.outerWidth();
            _baseX = _$sliderBar.offset().left || 0;
        }

        function valueToPercent ( val ) {
            return ( val - MIN ) / ( MAX - MIN ) * 100;
        }

        function setIconPosition ( per ) {
            _$thumb.css( 'left', per + '%' );
        }

        function setValue ( per ) {
            var val = ((MAX - MIN) * per) / 100 + MIN;
            val = valueToRangeValue( val );

            _$progress.css( 'width', per + '%' );
            _$value.text( val );
            _moveValue = val;
        }

        function valueToRangeValue ( value ) {
            return Math.round( value / RANGE ) * RANGE;
        }

        function pxToPercent ( x ) {
            var per = x / _baseWidth * 100;

            if ( per < 0 ) {
                per = 0;
            } else if ( per > 100 ) {
                per = 100;
            }

            return per;
        }

        function dispatchEvent ( type, value ) {
            if ( type === 'change' ) {
                if ( _currentValue !== value ) {
                    _$target.trigger( 'slider:' + type, value );
                }
            } else {
                _$target.trigger( 'slider:' + type, value );
            }

            _currentValue = value;
        }
    };


    window.UI = window.UI || UI;
})(jQuery, ixBand);