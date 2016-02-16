
/**
 * 表单验证
 * @date 2016-02-14 16:01:56
 * @author vfasky <vfasky@gmail.com>
 * @link http://vfasky.com
 */
'use strict';
var $, Template, _errMsg, _isAlphabetReg, _isDateReg, _isEmailReg, _isMobileReg, _isTelReg, _rule, _urlCheck, getNameValue, getRules, parseValidator, ref, util,
  slice = [].slice;

$ = require('jquery');

ref = require('mcore'), Template = ref.Template, util = ref.util;

require('../vendor/jquery.serialize-object');

_isAlphabetReg = /^[A-Za-z]+$/;

_isEmailReg = /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i;

_isDateReg = /^([1-2]\d{3})([-\/.])?(1[0-2]|0?[1-9])([-\/.])?([1-2]\d|3[01]|0?[1-9])$/;

_isMobileReg = /^1[3-9]\d{9}$/;


/**
 * 检查座机
 * 座机：仅中国座机支持；区号可有 3、4位数并且以 0 开头；电话号不以 0 开头，最 8 位数，最少 7 位数
 * 但 400/800 除头开外，适应电话，电话本身是 7 位数
 * 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
 *
 */

_isTelReg = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/;

_urlCheck = (function() {
  var address, domain, domainType, ip, ipType, port, protocols, rDomain, rIP, userInfo;
  protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?';
  userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?';
  domain = '(?:localhost|(?:[a-z0-9]+(?:[-\\w]*[a-z0-9])?(?:\\.[a-z0-9][-\\w]*[a-z0-9])*)*\\.[a-z]{2,})';
  port = '(:\\d{1,5})?';
  ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}';
  address = '(\\/\\S*)?';
  domainType = [protocols, userInfo, domain, port, address];
  ipType = [protocols, userInfo, ip, port, address];
  rDomain = new RegExp('^' + domainType.join('') + '$', 'i');
  rIP = new RegExp('^' + ipType.join('') + '$', 'i');
  return function(x) {
    return rDomain.test(x || rIP.test(x));
  };
})();

_rule = {
  required: function(x, rule) {
    if (x == null) {
      x = '';
    }
    if (rule == null) {
      rule = null;
    }
    if (rule === null) {
      return String(x).trim().length > 0;
    }
    if (x.$form.find(rule).val()) {
      return String(x).trim().length > 0;
    }
    return true;
  },
  isAlphabet: function(x) {
    return _isAlphabetReg.test(String(x));
  },
  minlength: function(x, len) {
    len = Number(len);
    x = String(x).trim();
    return x.length >= len;
  },
  maxlength: function(x, len) {
    len = Number(len);
    x = String(x).trim();
    return x.length <= len;
  },
  isNumber: function(x) {
    return $.isNumeric(String(x));
  },
  isInteger: function(x) {
    return Number(x) % 1 === 0;
  },
  min: function(x, min) {
    return Number(x) >= Number(min);
  },
  max: function(x, max) {
    return Number(x) <= Number(max);
  },
  equals: function(x, value) {
    if (value instanceof $) {
      value = value.val();
    }
    if (x instanceof $) {
      x = x.val();
    }
    return String(x) === String(value);
  },
  isEmail: function(x) {
    return _isEmailReg.test(String(x));
  },
  isDate: function(x) {
    var d, day, month, taste, year;
    if (_isDateReg.test(String(x))) {
      return false;
    }
    taste = _isDateReg.exec(String(x));
    year = Number(taste[1]);
    month = Number(taste[3] - 1);
    day = Number(taste[5]);
    d = new Date(year, month, day);
    return year === d.getFullYear() && month === d.getMonth() && day === d.getDate();
  },
  isMobile: function(x) {
    return _isMobileReg.test(String(x));
  },
  isTel: function(x) {
    return _isTelReg.test(String(x));
  },
  isUrl: function(x) {
    return _urlCheck(String(x));
  }
};

_errMsg = {
  required: '不能为空',
  isNumber: '只能是数字',
  isAlphabet: '只能是字母',
  minlength: function(len) {
    return "最小 " + len + " 位字符";
  },
  maxlength: function(len) {
    return "最多 " + len + " 位字符";
  },
  min: function(min) {
    return "数值要大于 " + min;
  },
  max: function(max) {
    return "数值要小于 " + max;
  },
  equals: '两次输入的值不相符',
  isEmail: '邮箱格式不正确',
  isInteger: '数值必须是整数',
  isDate: '日期格式不正确',
  isMobile: '手机格式不正确',
  isTel: '座机格式不正确'
};

parseValidator = function($el, rules) {
  var name;
  if (rules == null) {
    rules = [];
  }
  name = $el.attr('name');
  if (!name) {
    return false;
  }
  return util.each($el.attr('validator').split('|'), function(v) {
    var args, checkRule, diyErr, eT, err, ix, msgArgs, ruleType;
    ix = String(v).indexOf(' err:');
    if (ix !== -1) {
      eT = v.split(' err:');
      v = eT[0];
      diyErr = eT[1];
    }
    args = $.grep(v.split(' '), (function(_this) {
      return function(s) {
        return $.trim(s).length > 0;
      };
    })(this));
    ruleType = args[0];
    checkRule = _rule[ruleType];
    if (!checkRule) {
      console.log("validator rule: " + ruleType + " undefined");
      return;
    }
    if (diyErr) {
      err = diyErr;
    } else {
      if ($.isFunction(_errMsg[ruleType])) {
        msgArgs = args.slice(0);
        msgArgs.splice(0, 1);
        err = _errMsg[ruleType].apply($el[0], msgArgs);
      } else {
        err = _errMsg[ruleType] || 'error';
      }
    }
    args[0] = $el;
    if (ruleType === 'equals') {
      args[1] = this.$el.find(args[1]).eq(0);
    }
    return rules.push({
      name: name,
      type: ruleType,
      rule: checkRule,
      args: args,
      err: err
    });
  });
};

getRules = function($form) {
  var rules;
  rules = [];
  $form.find('[validator]').each(function() {
    return parseValidator($(this), rules);
  });
  return rules;
};

getNameValue = function(data, name, $el) {
  name = String(name);
  if (-1 === name.indexOf('[')) {
    return data[name] || '';
  }
  return $el.val().trim();
};

Template.binders['validator'] = {
  rendered: function(el, value) {
    var $form, callback;
    if (el.tagName.toLowerCase() !== 'form' || !el._element) {
      return el.setAttribute('validator', value);
    }
    callback = Template.strToFun(el, value) || function() {};
    $form = $(el);
    return $form.off('submit.validator').on('submit.validator', function() {
      var data, err, rules;
      rules = getRules($form);
      data = $form.serializeObject();
      err = null;
      $.each(rules, function(k, v) {
        var $el, _value;
        $el = v.args[0];
        _value = getNameValue(data, v.name, $el);
        if (v.type !== 'required' && (_value === '' || _value === void 0)) {
          return;
        }
        value = {
          toString: function() {
            return String(_value);
          },
          toNumber: function() {
            return Number(_value);
          },
          $el: $el,
          $form: $form
        };
        v.args[0] = value;
        if (false === v.rule.apply(null, v.args)) {
          err = {
            $el: $el,
            err: v.err,
            $form: $form
          };
          return false;
        }
      });
      callback(err, data);
      return false;
    });
  }
};

module.exports = {
  add: function(x, fun, errMsg) {
    _rule[x] = fun;
    if (errMsg) {
      return _errMsg[x] = errMsg;
    }
  },
  addErrMsg: function(type, msg) {
    return _errMsg[type] = msg;
  },
  check: function() {
    var args, type;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (args.length < 2) {
      return false;
    }
    type = args[0];
    args.splice(0, 1);
    if (!rule[type]) {
      return false;
    }
    return _rule[type].apply(null, args);
  }
};