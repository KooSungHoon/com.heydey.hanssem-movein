import storeTabs from '../product/store-tab';
import { userAgent } from "../userAgent";

export default {
    props: {
        size: {
            type: Object,
            required: true,
            default: function() {
                return {};
            }
        },
        contentClass: {
            type: String,
            default: function() {
                return '';
            }
        },
        current: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return Object.assign({
            active: '',
            productTabs: [
                { name: '한샘상품', imagePath: '/movein/common/store_tab/2dep_tab1_off.png' },
                { name: '입점상품', imagePath: '/movein/common/store_tab/2dep_tab2_off.png' }
            ]
        }, userAgent);
    },
    computed: {},
    methods: {
        setActive(name) {
            this.active = name;
        }
    },
    mounted() {
        this.active = this.productTabs[0].name;
    },
    template: `
        <section v-bind:class="contentClass" style="margin: 0;">
            <div class="product_tab_wrap clfix">
                 <hanssem-tab 
                 v-for="tab in productTabs"
                  v-bind:key="tab.name"
                   tab-class="product_tab"
                    v-bind:name="tab.name"
                     v-on:active="setActive" 
                     v-bind:imagePath="tab.imagePath" 
                     v-bind:is-mobile="isMobile"
                     v-bind:is-active="tab.name === active"></hanssem-tab> 
            </div>
            <hanssem-product-content v-if="active === '한샘상품'" v-bind:size="size" v-bind:is-mobile="isMobile"></hanssem-product-content>
            <no-hanssem-product-content v-if="active === '입점상품'"></no-hanssem-product-content>
            <div class="cont hanssem_product_wrap" v-if="active === '한샘상품'">
                <responsive-img v-bind:src="current.subImagePath" v-bind:is-mobile="isMobile"></responsive-img>
            </div>
            <store-information
                v-if="active === '한샘상품'"
                v-bind:title="current.storeIntroTitle"
                v-bind:description="current.storeIntroDesc"
                v-bind:info-class="'cont hanssem_product_wrap'"
                v-bind:stores="current.stores"
    ></store-information>
        </section>
    `,
    components: {
        'hanssem-product-content': {
            props: {
                size: {
                    type: Object,
                    required: true,
                    default: function() {
                        return {};
                    }
                },
                contentClass: {
                    type: String,
                    default: function() {
                        return '';
                    }
                },
                isMobile: {
                    type: Boolean,
                    default: function() {
                        return false;
                    }
                }
            },
            data() {
                return {
                    active: '',
                }
            },
            methods: {
                setActive(name) {
                    this.active = name;
                }
            },
            mounted() {
                this.active = this.size.data[0].name;
            },
            template: `
            <article v-bind:class="contentClass">
                <h2 class="red_line" style="margin: 0;"><responsive-img v-bind:src="size.mainImgPath" alt="평형 메인 타이틀 이미지" v-bind:is-mobile="isMobile" ></responsive-img></h2>
                <div class="red_line">
                    <div v-bind:class="'sub_tab_container all_room_tab_wrap clfix ' + size.name">
                            <hanssem-tab v-for="type in size.data" v-bind:tab-class="'room_tab'" v-bind:key="type.name" 
                                                              v-bind:is-active="active === type.name" 
                                                              v-bind:imagePath="type.tabImgPath" 
                                                              v-bind:name="type.name"
                                                              v-on:active="setActive"
                                                              v-bind:is-mobile="isMobile"
                                                          ></hanssem-tab>                                      
                    </div>
                </div>
                <type-content v-if="active === type.name" v-for="type in size.data" 
                                     v-bind:key="type.name"    
                                     v-bind:name="type.name"
                                     v-bind:type-slide="type.slides"
                                     v-bind:match-code="type.key"
                                     type-class="product_container"
                                     ></type-content>
            </article>
            
            `
        },
        'no-hanssem-product-content': {
            props: {},
            data() {
                return Object.assign({
                    active: '',
                    subActive: '',
                    storeTabs: storeTabs
                }, userAgent)
            },
            methods: {
                setActive(name) {
                    this.active = name;
                    this.subActive = 'banner1';
                },
                setSubActive(name) {
                    this.subActive = name;
                }
            },
            mounted() {
                this.active = this.serializeTabs[0].name;
                const subTabActive = this.serializeTabs.find(tab => tab.name === this.active);
                if(subTabActive) {
                    this.subActive = subTabActive.subTabs[0].name;
                }
            },
            computed: {
                serializeTabs() {
                    return [].concat(...this.storeTabs);
                },
                currentTarget() {
                    if(this.active && this.subActive) {
                        const currentTab = this.serializeTabs.find(tab => tab.name === this.active);

                        return currentTab && currentTab.subTabs.find(subTab => subTab.name === this.subActive);
                    }
                }
            },
            template: `
                <div class="store_product_container" style="display: inline-block;"> 
                        <div class="store_tab_wrap clfix" v-for="tabs in storeTabs" >
                            <hanssem-tab tab-class="store_tab"  v-for="tab in tabs" v-bind:key="tab.name" 
                                                              v-bind:is-active="active === tab.name" 
                                                              v-bind:imagePath="tab.imagePath" 
                                                              v-bind:name="tab.name"
                                                              v-bind:is-mobile="isMobile"
                                                              v-on:active="setActive"
                                                              ></hanssem-tab>
                        </div>
                        <div v-for="tab in serializeTabs" class="store_sub_tab_wrap clfix" v-if="active === tab.name">
                              <hanssem-tab tab-class="banner_tab_life"  v-for="subTab in tab.subTabs" v-bind:key="subTab.name" 
                                                              v-bind:is-active="subActive === subTab.name" 
                                                              v-bind:imagePath="subTab.imagePath" 
                                                              v-bind:name="subTab.name"
                                                              v-on:active="setSubActive"
                                                              ></hanssem-tab>
                        </div>
                        <a class="banner_link" style="width:100%;" v-if="currentTarget" v-bind:href="currentTarget.targetLink" target="_blank"><responsive-img class="store_banner" style="width: 100%;" v-bind:src="currentTarget.targetImgPath" v-bind:is-mobile="false"></responsive-img></a> 
                </div>
            
            `

        }
    }
};
