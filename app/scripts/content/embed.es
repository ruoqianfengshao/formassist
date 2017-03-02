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
  this.patterns = {
    email: () => "^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$",
    mobile: () => "^1[3-9]\d{9}$",
    tel: () => "^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$",
    url: () => {
      const protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?'
      const userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?'
      const domain = '(?:[a-z0-9]+(?:\-[\w]+)*\.)*[a-z]{2,}'
      const port = '(:\\d{1,5})?'
      const ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'
      const address = '(\\/\\S*)?'
      const domainType = ["(^", protocols, userInfo, domain, port, address, "$)"]
      const ipType = ["(^", protocols, userInfo, ip, port, address]

      return [domainType, "|", ipType].join(",")
    },
    number: () => "^\-?(?:[1-9]\d*|0)(?:[.]\d+)?$"

  }
  this.defaultRegExp = "^[a-zA-Z0-9]{1,20}$"
  this.init = (type) => {
    const $input = $("input:text,textarea")
    const $rOrC = $("input:radio,input:checkbox")
    const $select = $("select")
    const $requiredInput = $("input:text[required=required],textarea[required=required]")
    const $requiredROrC = $("input:radio[required=required],input:checkbox[required=required]")
    const $requiredSelect = $("select:required")

    switch(type) {
      case "clear":
        this.clearInput($input)
        this.clearROrC($rOrC)
        this.clearSelect($select)
        break;
      case "all":
        this.fillInput($input)
        this.checkROrC($rOrC)
        this.defaultSelect($select)
        break;
      case "required":
        this.fillInput($requiredInput)
        this.checkROrC($requiredROrC)
        this.defaultSelect($requiredSelect)
        break;
    }
  }

  // 清空input值
  this.clearInput = ($input) => {
    $input.val("")
    return this
  }

  // 清空单复选框的勾选
  this.clearROrC = ($input) => {
    $input.prop("checked", false)
    return this
  }

  this.clearSelect = ($select) => {
    const $option = $("option:first", $select)
    $option.length ? $option.prop("selected", true) : $select.val("")
    return this
  }

  // 文本输入框
  this.fillInput = ($input) => {
    $input.each((index, item) => {
      const $item = $(item)
      const type = this.patterns($item.attr("type"))
      const pattern = (type ? type() : undefined) || $item.attr("pattern") || this.defaultRegExp
      $item.val(new RandExp(new RegExp(pattern, 'i')).gen())
    })

    return this
  }

  // 勾选单选框或多选框
  this.checkROrC = ($input) => {
    $input.prop("checked", true)
    return this
  }

  // 设置下拉框默认值
  this.defaultSelect = ($select) => {
    $($select).each((index, item) => {
      const $item = $(item)
      const $option = $("option:not([value=''])", $item)
      $option.length ? $item.val($option.val()) : $item.val("default value")
    })
    return this
  }

  return this;
}));
