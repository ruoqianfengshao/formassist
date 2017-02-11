(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.AutoInput = factory();
    }
}(window, function () {
  this.$input = $("input:text,textarea")
  this.$rOrC = $("input:radio,input:checkbox")
  this.$select = $("select")
  this.$requiredInput = $("input:text[required=required],textarea[required=required]")
  this.$requiredROrC = $("input:radio[required=required],input:checkbox[required=required]")
  this.$requiredSelect = $("select:required")

  this.init = (type) => {
    switch(type) {
      case "clear":
        this.clearInput(this.$input)
        this.clearROrC(this.$rOrC)
        this.clearSelect(this.$select)
        break;
      case "all":
        this.fillInput(this.$input)
        this.checkROrC(this.$rOrC)
        this.defaultSelect(this.$select)
        break;
      case "required":
        this.fillInput(this.$requiredInput)
        this.checkROrC(this.$requiredROrC)
        this.defaultSelect(this.$requiredSelect)
        break;
    }
  }

  // 清空input值
  this.clearInput = ($input) => {
    $input.val("")
  }

  // 清空单复选框的勾选
  this.clearROrC = ($input) => {
    $input.prop("checked", false)
  }

  this.clearSelect = ($select) => {
    const $option = $("option:first", $select)
    $option.length ? $option.prop("selected", true) : $select.val("")
  }

  // 文本输入框
  this.fillInput = ($input) => {
    $input.each((index, item) => {
      const $item = $(item)
      const pattern = $item.attr("pattern") || "^.{1,10}$"
      $item.val(new RandExp(new RegExp(pattern)).gen())
    })
  }

  // 勾选单选框或多选框
  this.checkROrC = ($input) => {
    $input.prop("checked", true)
  }

  // 设置下拉框默认值
  this.defaultSelect = ($select) => {
    $($select).each((index, item) => {
      const $item = $(item)
      const $option = $("option:not([value=''])", $item)
      $option.length ? $item.val($option.val()) : $item.val("default value")
    })
  }

  return this;
}));
