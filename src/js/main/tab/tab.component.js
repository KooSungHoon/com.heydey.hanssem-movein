import { userAgent } from '../userAgent';

export default {
    props: {
        name: {
            type: String,
            required: true,
            default: (_ => '')
        },
        isActive: {
            type: Boolean,
            required: true,
            default: _ => false
        },
        imagePath: {
            type: String,
            required: true,
            default: _ => ''
        },
        tabClass: {
            type: String,
            default: _ => ''
        },
        isMobile: {
            type: Boolean,
            default: _ => false
        },
        size: {
            type: String,
            default: _ => ''
        },
        transform: {
            type: String,
            default: _ => ''
        }
    },
    data() {
        return {
            activeRegExp: /(?:on|off)\.(.*)$/,
            extExp: /\.(jpe?g|png|gif)$/
        };
    },
    computed: {
        tabImagePath() {
            const ext = (this.extExp.exec(this.imagePath || '') || [])[0] || '';
            return this.imagePath.replace(this.activeRegExp, `${this.isActive ? 'on' : 'off'}${ext}`);
        },
        getStyle() {
            return {
                width: (this.size > 0 ? Math.max(this.size, this.getTabMaxSize) + '%' : ''),
                display: 'inline-block',
                transform: this.transform
            };
        },
        getTabMaxSize() {
            return this.isMobile ? 25 : 20;

        },
    },
    methods: {
        tabClick() {
            this.$emit('active', this.name);
        }
    },
    template: `<a v-bind:class="tabClass" v-on:click="tabClick()" v-bind:style="getStyle"><responsive-img v-bind:src="tabImagePath" alt="메뉴 탭" v-bind:is-mobile="isMobile" ></responsive-img></a>`
}
