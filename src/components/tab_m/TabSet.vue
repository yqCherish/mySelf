<template>
  <div>
    <!-- Nav tabs -->
    <ul class="vux-tab" role="tablist">
      <template v-for="t in headers">
        <li v-if="!t._tabgroup" class="vux-tab-item vux-center tab_border_right" :class="{active:t.active, disabled:t.disabled}" @click.prevent="select(t)">
          <a :class="{tab_active:t.active}" href="#"><slot name="header">{{{t.header}}}</slot></a>
        </li>
      </template>
    </ul>
    <div class="tab-content" v-el:tab-content>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {coerce} from '../carousel/utils/utils.js'

  export default {
    props: {
      navStyle: {
        type: String,
        default: 'tabs'
      },
      effect: {
        type: String,
        default: 'fadein'
      },
      active: {
        twoWay: true,
        type: Number,
        coerce: coerce.number,
        default: 0
      }
    },
    data () {
      return {
        show: null,
        headers: [],
        tabs: []
      }
    },
    created () {
      this._tabset = true
    },
    watch: {
      active (val) {
        this.show = this.tabs[val]
      }
    },
    ready () {
      this.show = this.tabs[this.active]
    },
    methods: {
      select (tab) {
        if (!tab.disabled) {
          this.active = tab.index
        }
      }
    }
  }
</script>

<style scoped>
  .nav-tabs {
    margin-bottom: 15px;
  }
  .tab_active{
    color:rgb(16, 152, 247);
  }
</style>
