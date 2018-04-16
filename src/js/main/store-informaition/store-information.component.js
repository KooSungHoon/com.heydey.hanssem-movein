import { userAgent } from "../userAgent";

export default {
    props: {
        title: {
            type: String,
            default: _ => ''
        },
        description: {
            type: Array,
            default: _ => []
        },
        infoClass: {
            type: String,
            default: _ => ''
        },
        stores: {
            type: Array,
            default: _ => []
        }
    },
    computed: {
        descToHTML() {
            return this.description.join('<br>');
        }
    },
    data() {
      return Object.assign({}, userAgent);
    },
    template: `
    <div id="pos3" class="cont hanssem_product_wrap">
        <h2>{{title}}</h2>
        <p class="sub_title" v-html="descToHTML"></p>
        <store v-for="store in stores" 
                        v-bind:key="store.name"
                        v-bind:name="store.name"
                        v-bind:img-src="store.imagePath" 
                        v-bind:category="store.category" 
                        v-bind:sub-category="store.categorySub"
                        v-bind:traffics="store.traffics"
                        v-bind:info="isMobile ? store.m_storeInfo : store.storeInfo"
                        v-bind:store-class="'store_map_wrap'"
                        v-bind:is-mobile="isMobile"
                        v-bind:link="isMobile ? store.m_link : store.link"
                        ></store>
    </div>
    `,
    components: {
        'store': {
            props: {
                name: { type: String },
                imgSrc: { type: String },
                category: { type: Array, default: _ => [] },
                subCategory: { type: Array, default: _ => [] },
                info: { type: Array, default: _ => [] },
                storeClass: { type: String },
                isMobile: {
                    type: Boolean
                },
                traffics: {
                  type: Array
                },
                link: {
                    type: String
                }
            },
            computed: {
              categoryToHTML() {
                  return this.category.join(',');
              },
              subCategoryToHTML() {
                  return this.subCategory.join(',').replace(/\,\<br\>\,/i, ',<br>');
              },
              infoToHTML() {
                  return this.info.join('<br>');
              }
            },
            methods: {
                getSerializeStation(stations) {
                    return stations.join(',').replace(/\,\<br\>\,/gi, ',<br>');
                }
            },
            template: `
             <div v-bind:class="storeClass">
                <responsive-img v-bind:src="imgSrc" v-bind:is-mobile="isMobile"></responsive-img>
                <div class="store_desc">
                    <a v-bind:href="link ? link : 'javascript:void(0);'" class="store_name" target="_blank">{{name}}</a>
                    <p class="red_text">{{categoryToHTML}}</p>
                    <p class="black_text" v-html="subCategoryToHTML"></p>
                </div>
                <table class="store_map_info" v-if="infoToHTML">
                    <tbody v-if="isMobile">
                         <tr>
                            <th style="text-align: left;"><span class="store_info_text" >·매장정보</span></th>
                        </tr>
                        <tr>
                            <td style="text-align: left"><span class="store_info_text2" v-html="infoToHTML"></span></td>
                        </tr>    
                    </tbody>    
                    <tbody v-if="!isMobile">
                        <tr>
                            <th><span class="store_info_text">·매장정보</span></th>
                            <td><span class="store_info_text2" v-html="infoToHTML"></span></td>
                        </tr> 
                    </tbody>
                </table>
                <div class="way_info" v-if="traffics && traffics.length > 0">
                    <h2><span class="store_info_text">·교통안내</span></h2>
                    <div class="ways" v-for="way in traffics">
                        <div class="way_img"><responsive-img v-bind:src="way.imagePath" v-bind:is-mobile="false"></responsive-img></div>
                        <span class="way_station" v-html="getSerializeStation(way.stations)"></span>
                    </div>
                    
                       
                </div>
            </div>
            `
        }
    }
};
