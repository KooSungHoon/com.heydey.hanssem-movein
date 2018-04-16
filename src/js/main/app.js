'use strict';

import Vue from 'vue/dist/vue.min';
import { kimpo, isu, ilsan, kwangkyo, kwangkyoDusan, incheonCity, newMansion } from './mansions/mansions.confg';
import slideComponent from './hanssem-slide/hanssem-slide.component';
import tabComponent from './tab/tab.component';
import { getTabImage, getWayImage } from './setTabImage';
import sizeComponent from './size-content/size-content.component';
import typeComponent from './type-content/type-content.component';
import storeInfoComponent from './store-informaition/store-information.component';
import reponsiveImgComponent from './responsive-image';
import { userAgent } from './userAgent';

const pages = {
    '10000001':kimpo,
    '10000002':kwangkyo,
    '10000003':incheonCity,
    '10000004':isu,
    '10000005':kwangkyoDusan,
    '10000006':ilsan,
    '10000007': newMansion
};

const current = pages[window.currentPage || 'kimpo'] || pages[Object.keys(pages)[0]];
current.sizes.forEach(size => {
    if(size && Array.isArray(size.data)) {
        size.data.forEach(category => {
            if(category && category.name) {
                category.tabImgPath = getTabImage(category.name);
            }
        });
    }
});

current.stores.forEach(store => {
   if(store && Array.isArray(store.traffics)) {
       store.traffics.forEach(way => {
           way.imagePath = getWayImage(way.type);
       });
   }
});

Vue.component('hanssemTab', tabComponent);
Vue.component('sizeContent', sizeComponent);
Vue.component('type-content', typeComponent);
Vue.component('hanssemSlide', slideComponent );
Vue.component('storeInformation', storeInfoComponent);
Vue.component('responsive-img', reponsiveImgComponent);

new Vue({
    el: '#mansion-content',
    data() {
        return Object.assign({
            current: current,
            active: '',
            currentIndex: 0
        }, userAgent);
    },
    computed: {
        triggerSize() {
            return this.current.sizes.length - this.maxTab;
        },
        maxTab() {
            return this.isMobile ? 4 : 5;
        }
    },
    methods: {
        setActive(sizeName) {
            this.active = sizeName;
        },
        nextTab() {
            if(this.triggerSize <= this.currentIndex) {
                this.currentIndex = 0;
            } else {
                ++this.currentIndex;
            }
        },
        prevTab() {
            if(this.currentIndex > 0) {
                --this.currentIndex;
            }
        }
    },
    mounted() {
        this.active = this.current.sizes[0].name;
    }
});
