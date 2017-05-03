<template>
  <div class="carousel slide" data-ride="carousel">
    <!-- Indicators -->
    <ol class="carousel-indicators" v-show="indicators">
      <li v-for="i in indicator" @click="indicatorClick($index)" v-bind:class="{active:$index === index}"><span></span></li>
    </ol>
    <!-- Wrapper for slides -->
    <div class="carousel-inner" @touchstart="touchStart($event)" @touchend="touchEnd($event)" role="listbox">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {coerce} from './utils/utils.js'
  import $ from './utils/NodeList.js'
  let startx, starty;
  export default {
    props: {
      indicators: {
        type: Boolean,
        coerce: coerce.boolean,
        default: true
      },
      controls: {
        type: Boolean,
        coerce: coerce.boolean,
        default: true
      },
      interval: {
        type: Number,
        coerce: coerce.number,
        default: 5000
      }
    },
    data () {
      return {
        indicator: [],
        index: 0,
        isAnimating: false
      }
    },
    watch: {
      index(newVal, oldVal) {
        this.slide(newVal > oldVal ? 'left' : 'right', newVal, oldVal)
      }
    },
    methods: {
      indicatorClick(index) {
        if (this.isAnimating || this.index === index) return false
        this.isAnimating = true
        this.index = index
      },
      touchStart(e){
        console.log(1);
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
      },
      touchEnd(e){
        let endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        let direction = this.getDirection(startx, starty, endx, endy);
        switch (direction) {
          case 0:
            console.log("未滑动！");
            break;
          case 1:
            console.log("向上！")
            break;
          case 2:
            console.log("向下！")
            break;
          case 3:
            this.next();
            break;
          case 4:
            this.prev();
            break;
          default:
        }
      },
      slide (direction, next, prev) {
        if (!this.$el) { return }
        const $slider = $('.item', this.$el)
        if (!$slider.length) { return }
        const selected = $slider[next] || $slider[0]
        $(selected).addClass(direction === 'left' ? 'next' : 'prev')
        // request property that requires layout to force a layout
        var x = selected.clientHeight
        $([$slider[prev], selected]).addClass(direction).on('transitionend', () => {
          $slider.off('transitionend').className = 'item'
          $(selected).addClass('active')
          this.isAnimating = false
        })
      },
      next() {
        if (!this.$el || this.isAnimating) { return false }
        this.isAnimating = true
        this.index + 1 < $('.item', this.$el).length ? this.index += 1 : this.index = 0
      },
      prev() {
        if (!this.$el || this.isAnimating) { return false }
        this.isAnimating = true
        this.index === 0 ? this.index = $('.item', this.$el).length - 1 : this.index -= 1
      },
      toggleInterval (val) {
        if (val === undefined) { val = this._intervalID }
        if(this._intervalID) {
          clearInterval(this._intervalID)
          delete this._intervalID
        }
        if(val && this.interval > 0) {
          this._intervalID = setInterval(this.next, this.interval)
        }
      },
      getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;

        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
          return result;
        }

        var angle = this.getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
          result = 1;
        } else if (angle > 45 && angle < 135) {
          result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 3;
        } else if (angle >= -45 && angle <= 45) {
          result = 4;
        }

        return result;
      },
      getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
      }
    },
    ready () {
      this.toggleInterval(true)
      $(this.$el).on('mouseenter', () => this.toggleInterval(false)).on('mouseleave', () => this.toggleInterval(true))
    },
    beforeDestroy () {
      this.toggleInterval(false)
      $(this.$el).off('mouseenter mouseleave')
    }
  }
</script>

<style scoped>
  .carousel-control {
    cursor: pointer;
  }
</style>
