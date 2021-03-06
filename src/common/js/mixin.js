import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const popupMixin = {
  data() {
    return {
      topPopup: false,
    }
  },
  methods: {
    open(position) {
      this[position + "Popup"] = true;
    },
    close(position) {
      this[position + "Popup"] = false;
    },
  },
  watch: {
    topPopup(val) {
      if (val) {
        setTimeout(() => {
          this.topPopup = false;
        }, 1000);
      }
    }
  },

}

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    playModeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 播放模式变化时, 当前歌曲下标重新设置
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
      this.title=this.playModeText();
      this.$refs.toast2.show();
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },

    // getFavoriteIcon(song) {
    //   if (this.isFavorite(song)) {
    //     return 'icon-favorite'
    //   }
    //   return 'icon-not-favorite'
    // },
    getFavorite(song) {
      if (this.isFavorite(song)) {
        return true
      }
      return false
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.title="已取消喜欢"
        this.deleteFavoriteList(song);
      } else {
        this.title="已添加到我喜欢"
        this.saveFavoriteList(song);
      }
      this.$refs.toast1.show();

    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    deleteOne(item) {
      this.deleteSong(item);
      this.title="删除成功"
      this.$refs.toast2.show();
      if (!this.playlist.length) {
        this.hide();
      }
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }
}

export const sheetMixin = {
  computed: {
      isFavorite() {
          const list = this.disc;
          if (!list) {
              return false;
          }
          const index = this.favoriteListList.findIndex(
              item => item.dissid === list.dissid
          );
          return index > -1;
      },
      ...mapGetters(['disc', 'favoriteListList'])
  },
  methods: {
      toggleFavorite() {
          const list = this.disc;
          if (this.isFavorite) {
              this.deleteFavoriteListList(list);
          } else {
              this.saveFavoriteListList(list);
          }
      },
      ...mapActions(['saveFavoriteListList', 'deleteFavoriteListList'])
  }
};
