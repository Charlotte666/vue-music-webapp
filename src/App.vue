<template>
  <div id="#app" @touchmove.prevent v-cloak>
    <about ref="about"></about>
    <m-header @open="open"></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <MVplayer></MVplayer>

  </div>
</template>

<script>
import MVplayer from "components/MVplayer/MVplayer";
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import About from "components/about/about";
import Tab from "components/tab/tab";
export default {

  methods: {
    open() {
      this.$refs.about.show();
    }
  },

  components: {
    Player,
    MHeader,
    Tab,
    About,
    MVplayer
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#app {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

</style>