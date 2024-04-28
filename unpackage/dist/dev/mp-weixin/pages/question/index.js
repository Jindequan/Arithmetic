"use strict";
const common_vendor = require("../../common/vendor.js");
const Head = () => "../../components/Head.js";
common_vendor.ref(false);
const _sfc_main = {
  data() {
    return {
      openResult: common_vendor.ref(false),
      quantity: 10,
      method: "",
      num_type: "",
      dataset: [],
      result: [],
      score: -1
    };
  },
  onLoad(options) {
    this.num_type = options.num_type;
    this.method = options.method;
    if (options.quantity) {
      this.quantity = options.quantity;
    }
    this.loadQues();
  },
  components: {
    Head
  },
  methods: {
    loadQues: function() {
      if (this.num_type == "") {
        return false;
      }
      var min = 0;
      var max = 0;
      switch (this.num_type) {
        case "10":
          min = 0;
          max = 9;
          break;
        case "20":
          min = 0;
          max = 20;
          break;
        case "50":
          min = 0;
          max = 50;
          break;
        case "100":
          min = 0;
          max = 100;
          break;
      }
      var dataset = [];
      var left, right = 0;
      for (let i = 0; i < this.quantity; i++) {
        left = this.getRandom(min, max);
        right = this.getRandom(min, max);
        if (this.method == "-") {
          var bigger = left > right ? left : right;
          var smaller = left < right ? left : right;
          left = bigger;
          right = smaller;
        }
        dataset.push({ "answer": null, "left": left, "right": right, "op": this.method });
      }
      this.dataset = dataset;
    },
    getRandom: function(min, max) {
      const floatRandom = Math.random();
      const difference = max - min;
      const random = Math.round(difference * floatRandom);
      const randomWithinRange = random + min;
      return randomWithinRange;
    },
    reset: function() {
      this.dataset = [];
      this.score = -1;
      this.result = [];
      this.loadQues();
    },
    submit: function() {
      this.score = 0;
      this.result = [];
      this.openResult = common_vendor.ref(true);
      for (var i = 0; i < this.dataset.length; i++) {
        this.dealOneByOne(this.dataset.at(i), i);
      }
      console.log(this.result);
    },
    dealOneByOne: function(item, index) {
      var res = this.calculate(item.left, item.op, item.right);
      var isCorrect = "错误";
      if (res == item.answer) {
        isCorrect = "正确";
      }
      if (item.answer !== null) {
        item.answer;
      }
      this.result.push({
        "correctAnswer": res,
        "answer": item.answer,
        "left": item.left,
        "right": item.right,
        "op": item.op,
        "correct": isCorrect
      });
      if (res == item.answer) {
        this.score += 10;
      }
    },
    calculate: function(left, op, right) {
      console.dir(op.localeCompare("*"));
      console.dir(op);
      console.dir("*");
      console.dir(typeof op);
      console.dir("string");
      var res = 0;
      switch (op) {
        case "+":
          res = left + right;
          break;
        case "-":
          res = left - right;
          break;
        case "*":
          res = left * right;
          break;
      }
      return res;
    }
  }
};
if (!Array) {
  const _component_Head = common_vendor.resolveComponent("Head");
  _component_Head();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("Head", "a70bcdb3-0"),
    b: common_vendor.p({
      title: "首页",
      type: "index",
      isBack: true
    }),
    c: common_vendor.f($data.dataset, (item, index, i0) => {
      return {
        a: common_vendor.t(item.left),
        b: common_vendor.t(item.op),
        c: common_vendor.t(item.right),
        d: item.answer,
        e: common_vendor.o(common_vendor.m(($event) => item.answer = $event.detail.value, {
          number: true
        }))
      };
    }),
    d: common_vendor.o((...args) => $options.reset && $options.reset(...args)),
    e: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    f: common_vendor.o((...args) => _ctx.choose && _ctx.choose(...args)),
    g: $data.openResult
  }, $data.openResult ? common_vendor.e({
    h: $data.score > -1
  }, $data.score > -1 ? {
    i: common_vendor.t($data.score),
    j: $data.score > 80 ? "red" : $data.score > 60 ? "orange" : "green"
  } : {}, {
    k: common_vendor.f($data.result, (item, index, i0) => {
      return {
        a: common_vendor.t(item.left),
        b: common_vendor.t(item.op),
        c: common_vendor.t(item.right),
        d: common_vendor.t(item.correctAnswer),
        e: common_vendor.t(item.answer),
        f: common_vendor.t(item.correct),
        g: item.correct == "正确" ? "green" : "orange"
      };
    }),
    l: common_vendor.o(($event) => $data.openResult = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a70bcdb3"], ["__file", "D:/Files/code/Arithmetic/pages/question/index.vue"]]);
wx.createPage(MiniProgramPage);
