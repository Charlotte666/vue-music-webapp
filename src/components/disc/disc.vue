<template>
  <!-- isDisc 是否是歌单 -->
  <transition name="slide">
    <div class="disc">
      <music-list
        :title="title"
        :bg-image="bgImage"
        :songs="songs"
        :isDisc="true"
        :isFavorite="isFavorite"
        @favoriteChange="toggleFavorite"
      ></music-list>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import { sheetMixin } from "common/js/mixin";
import MusicList from "components/music-list/music-list";
import { mapMutations, mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
export default {
  mixins: [sheetMixin],
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },

  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getSongList();
  },

  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
  
.disc {
   position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>