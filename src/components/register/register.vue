<template>
  <transition name="slide">
    <div class="container">
      <title-Bar :titleBarName="titleBarName"></title-Bar>
      <div class="main">
        <ul class="form-list">
          <li>
            <mu-text-field label="用户名" labelFloat v-model="form.username"/>
          </li>
          <li>
            <mu-text-field label="密码" type="password" labelFloat v-model="form.password"/>
          </li>
          <li>
            <mu-text-field label="确认密码" type="password" labelFloat v-model="form.rePassword"/>
          </li>
          <li>
            <mu-raised-button label="注册" class="demo-raised-button" primary @click="registerForm"/>
          </li>
        </ul>
      </div>
      <mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="topPopup">注册成功</mu-popup>
    </div>
  </transition>
</template>

<script>
import { ERR_OK } from "@/api/config";
import TitleBar from "base/title-bar/title-bar";
import { popupMixin } from "common/js/mixin";

export default {
  mixins: [popupMixin],

  data() {
    return {
      titleBarName: "注册",

      // 注册表单
      form: {
        username: "",
        password: "",
        rePassword: ""
      }
    };
  },
  methods: {
    registerForm() {
      this.open("top");
    }
  },

  components: {
    TitleBar
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  top: 0;
  z-index: 100;
}

.main {
  width: 100%;
  height: 100%;
  background: #fff;

  .form-list {
    width: 85%;
    padding-top: 30px;
    margin: 0px auto;
    text-align: center;

    li {
      display: block;
    }
  }
}
</style>