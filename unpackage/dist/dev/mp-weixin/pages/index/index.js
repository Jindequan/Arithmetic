"use strict";
const common_vendor = require("../../common/vendor.js");
const Head = () => "../../components/Head.js";
const _sfc_main = {
  data() {
    return {
      "title": "算术练习",
      "page": "home",
      "categories": []
    };
  },
  onLoad() {
    this.loadCategories();
  },
  components: {
    Head
  },
  methods: {
    loadCategories: function() {
      let methods = ["", "+", "-", "*️"];
      let methodsDisplay = ["", "➕", "➖", "✖️"];
      let cates = ["", "10", "20", "50", "100"];
      var res = [];
      for (var i = 0; i < methods.length; i++) {
        res[i] = new Array();
        for (var j = 0; j < cates.length; j++) {
          res[i][j] = null;
        }
      }
      for (let i2 = 0; i2 < methods.length; i2++) {
        let iValue = methods[i2];
        let iDisplay = methodsDisplay[i2];
        for (let j2 = 0; j2 < cates.length; j2++) {
          let jValue = cates[j2];
          if (i2 == 0 && j2 == 0) {
            res[0][0] = { "method": "", "num_type": "", "bold": false, "display": "", "color": "", "type": null };
            continue;
          }
          let item = { "method": "", "num_type": "", "bold": false, "display": "", "color": "#ffff7f", "type": null };
          if (j2 == 0) {
            item.bold = true;
            item.display = iDisplay;
          } else if (i2 == 0) {
            item.bold = true;
            item.display = jValue;
          } else {
            item.color = this.getRandomColor();
            item.type = { "method": iValue, "num_type": jValue };
          }
          res[i2][j2] = item;
        }
      }
      this.categories = res;
    },
    choose: function(option) {
      if (!option || !option.method || !option.num_type) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "../question/index?method=" + option.method + "&num_type=" + option.num_type
      });
    },
    getRandomColor: function() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
};
if (!Array) {
  const _component_BottomNav = common_vendor.resolveComponent("BottomNav");
  _component_BottomNav();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.title),
    b: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.f(item, (i, idx, i1) => {
          return {
            a: common_vendor.t(i.display, i.color),
            b: i.color,
            c: common_vendor.o(($event) => $options.choose(i.type))
          };
        })
      };
    }),
    c: common_vendor.sr("ButtomNav", "49846db8-0")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Files/code/Arithmetic/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
