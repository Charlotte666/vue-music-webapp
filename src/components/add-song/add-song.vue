<template>
  <transition name="slideDown">
    <div class="add-song" v-show="addSongVisible" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到队列</h1>
         <div class="close" @click="hide">
          <mu-icon-menu icon="close"/>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll
            :refreshDelay="refreshDelay"
            ref="songList"
            v-show="currentIndex===0"
            class="list-scroll"
            :data="playHistory"
          >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll
            :refreshDelay="refreshDelay"
            ref="searchList"
            v-show="currentIndex===1"
            class="list-scroll"
            :data="searchHistory"
          >
            <div class="list-inner">
              <search-list
                @delete="deleteSearchHistory"
                @select="addQuery"
                :searches="searchHistory"
              ></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @select="selectSuggest"
          @listScroll="blurInput"
        ></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">添加成功</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import SongList from "base/song-list/song-list";
import SearchList from "base/search-list/search-list";
import Scroll from "base/scroll/scroll";
import Switches from "base/switches/switches";
import TopTip from "base/top-tip/top-tip";
import Suggest from "components/suggest/suggest";
import { searchMixin } from "common/js/mixin";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Song from "common/js/song";
export default {
  mixins: [searchMixin],
  data() {
    return {
      showSinger: false,
      currentIndex: 0,
      songs: [],
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["playHistory", "addSongVisible"])
  },
  methods: {
    show() {
      this.setAddSongVisible(true);
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.setAddSongVisible(false);
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong([new Song(song), true]);
        this.$refs.topTip.show();
      }
    },
    selectSuggest() {
      this.$refs.topTip.show();
      this.saveSearch();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    ...mapActions(["insertSong"]),
    ...mapMutations({
      setAddSongVisible: "SET_ADD_SONG_VISIBLE"
    })
  },
  components: {
    SearchBox,
    SongList,
    SearchList,
    Scroll,
    Switches,
    TopTip,
    Suggest
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slideDown-enter-active, .slideDown-leave-active {
  transition: all 0.3s;
}

.slideDown-enter, .slideDown-leave-to {
  transform: translate3d(0, 100%, 0);
}
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;


  .header {
    position: relative;
    height: 44px;
    text-align: center;
    color: $color-theme;


    .material-icons {
      color:$color-theme;
    }

    .title {
      line-height: 50px;
      font-size: $font-size-large;
    }

    .close {
      position: absolute;
      top: 0;
      right: 6px;
    }
  }

  .search-box-wrapper {
    margin: 10px 20px;
  }
  .search-list{
    padding 0 15px;
    margin-top 10px;
    }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 135px;
      bottom: 0;
      width: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;

        .list-inner {
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .text {
      font-size: $font-size-medium-x;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>