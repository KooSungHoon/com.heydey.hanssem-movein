import '../slide.jquery';

export default {
  props: {
      images: {
          type: Array,
          default() {
              return [];
          }
      },
      slideClass: {
          type: String,
      },
      isMobile: {
          type: Boolean
      },
      isTrigger: {
          type: Boolean
      }
  },
   mounted() {
      if(Array.isArray(this.images) && this.images.length > 0) {
          $(this.$el).slide_func({
              speed : 400,				//  이미지 넘어가는 속도
              interval_time : 3000,		//  동작 간격 시간 1000 = 1초
              auto : true	,		//  자동 슬라이드 true, false
              limited : false // 이미지 유한 슬라이드
          });
      }
   },
    template: `
           <div v-bind:class="'slide_node ' + slideClass">
            <ul class="slide_node_view" >
                <li class="slide_node_list" v-for="image in images"><responsive-img v-bind:src="image" alt="메인 슬라이드 이미지" v-bind:is-mobile="isMobile" ></responsive-img></li>
            </ul>
            <div class="btn_wrap" v-if="!isMobile && isTrigger">
				<a href="javascript:void(0);" class="slide_view_prev">이전</a>
				<a href="javascript:void(0);" class="slide_view_next">다음</a>
			</div>
			<div class="btn_wrap" v-if="!isMobile && isTrigger">
				<div class="slide_cnt">
					<span class="slide_cnt_num">1</span> / <span class="slide_cnt_tot">0</span>
				</div>
			</div>
        </div>
    `
};



