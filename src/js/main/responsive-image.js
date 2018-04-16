const currentTime = new Date();
currentTime.setMilliseconds(0);
currentTime.setMinutes(0);


export default {
    props: {
      src: {
          type: String,
          default: _ => '',
          required: true
      },
       alt: {
          type: String,
          default: _ => ''
       },
       separator: {
          type: String,
          default: _ => 'm_'
       },
       isMobile: {
          type: Boolean,
          default: _ => false
       }
    },
    data() {
        return {
          imgFileNameExp: /([^\/]+)\.(jpg|png|gif)$/i
        };
    },
    computed: {
      computeSrc() {
        return(location.hostname === 'localhost' ? '.' : 'http://image2.hanssem.com/event') + (this.isMobile ? `${this.src.replace(this.imgFileNameExp, '')}${this.separator}${this.imgFileNameExp.exec(this.src)[0]}` : this.src) + `?v=${currentTime.getTime()}`;
      }
    },
    template:`<img v-bind:src="computeSrc" v-bind:alt="alt" />`
}
