"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "Head",
  data() {
    return {
      navHeight: "",
      statusBarHeight: "",
      menuButtonPaddingRight: "",
      menuButtonWidth: "",
      publicWidthInfo: {}
    };
  },
  created() {
    common_vendor.index.getSystemInfo({
      success: (res) => {
        const menuButton = common_vendor.index.getMenuButtonBoundingClientRect();
        const {
          windowWidth,
          windowHeight
        } = common_vendor.index.getSystemInfoSync();
        const navBarPadding = (menuButton.top - res.statusBarHeight) * 2;
        let statusBarHeight = res.statusBarHeight;
        let navHeight = menuButton.height + navBarPadding;
        let headerHeight = navHeight + statusBarHeight;
        this.menuButtonPaddingRight = windowWidth - menuButton.right;
        this.menuButtonWidth = menuButton.width;
        this.navHeight = headerHeight;
        this.statusBarHeight = statusBarHeight;
        this.publicWidthInfo = {
          width: windowWidth - this.menuButtonPaddingRight - this.menuButtonWidth - this.menuButtonPaddingRight + "px",
          titleWidth: windowWidth - this.menuButtonPaddingRight - this.menuButtonWidth - this.menuButtonPaddingRight - this.menuButtonWidth + "px",
          iconWidth: this.menuButtonWidth - 30 + "px",
          height: this.navHeight + "px"
        };
      }
    });
  },
  methods: {
    goBack() {
      var pages = getCurrentPages();
      pages[pages.length - 1];
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    goIndex() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.fiexdHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.o((...args) => $options.goIndex && $options.goIndex(...args)),
    d: $data.publicWidthInfo.iconWidth,
    e: $data.publicWidthInfo.width,
    f: $data.navHeight + "px",
    g: $data.statusBarHeight + "px",
    h: $data.navHeight + $data.statusBarHeight + 30 + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-78844735"], ["__file", "D:/Files/code/Arithmetic/components/Head.vue"]]);
wx.createComponent(Component);
