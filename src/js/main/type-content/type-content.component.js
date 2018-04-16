import { productData } from '../product/product';
import { userAgent } from '../userAgent';

export default {
  props: {
      typeSlide: {
          type: Array,
          default: function() {
            return [];
          }
      },
      matchCode: {
          type: String,
          required: true,
          default: function() {
              return '';
          }
      },
      typeClass: {
        type: String,
        default: function() {
            return '';
        }
      },
      name: {
          type: String,
          required: true,
          default: function() {
              return '';
          }
      }
  },
  data() {
      return Object.assign({
        productData
      }, userAgent);
  },
  computed: {
      matchProductList() {
          return this.productData.filter(product => new RegExp(`^(${this.matchCode})$`, 'i').test(product.matchCode));
      }
  },
  mounted() {},
  template: `
    <article role="main" v-bind:class="typeClass">
        <hanssem-slide v-bind:images="typeSlide" v-bind:slide-class="'current-slide'" v-bind:is-mobile="isMobile" v-bind:is-trigger="!isMobile" ></hanssem-slide>
        <a class="product_link"
            v-for="(product, index) in matchProductList" 
            v-bind:key="index" 
            v-bind:href="isMobile ? product.mobileProductPath : product.pcProductPath" target="_blank"><responsive-img v-bind:src="product.imgSrc" alt="상품 이미지" v-bind:is-mobile="isMobile"></responsive-img></a>
    </article>
  `,
};