!function(window) {
  window._ = _partial;
  window.__ = _pipe;
  window.___ = {};

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _.is_array_like = _is_arr_like;
  function _is_arr_like(data) {
    var length = get_length(data);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }
  function get_length(list) { return list == null ? void 0 : list.length; }

  _.identity = _.idtt = value => value
  
  _.always = value => () => value

  _.partial = _partial;
  function _partial(func, ...parts) {
    var parts1 = [], parts2 = [], ___idx = parts.length;

    for (var i in parts)
      if (parts[i] == ___) ___idx = i; 
      else if (i < ___idx) parts1.push(parts[i]);
      else parts2.push(parts[i]);  

    return function(...args) {
      var args1 = parts1.slice(), 
          args2 = parts2.slice(),
          rest = args.slice();

      for (var i in args1)
        if (args1[i] == _) 
          args1[i] = rest.shift(); 
        
      for (var i in args2) 
        if (args2[i] == _) 
          args2[i] = rest.pop();

      return func(...[...args1, ...rest, ...args2]);
    }
  }

  _.each = _each;
  function _each(data, iter) {
    if (arguments.length == 1) return _each(f, _, data);
    if (_is_arr_like(data)) {  
      for (var i in data) iter(data[i], i, data); 
    } else {
      var keys = Object.keys(data);
      for (var i in keys) iter(data[keys[i]], keys[i], data);
    }
    return data;
  }

  _.map = function f(data, iter) {
    if (arguments.length == 1) return _(f, _, data);
    var res = [];
    _each(data, (v, i, l) => (res[i] = iter(v, i, l)));
    return res;
  }

  _.filter = function f(data, predi) {
    if (arguments.length == 1) return _(f, _, data);
    var res = [];
    _each(data, (v, i, l) => {if (predi(v, i, l)) res.push(v)});
    return res;
  }

  _.reject = function f(data, predi) {
    if (arguments.length == 1) return _(f, _, data);
    return _.filter(data, _.negate(predi));
  }

  _.reduce = function f(data, iter, memo) {
    if (arguments.length == 1) return _(f, _, data);
    if (_is_arr_like(data)) { 
      var i = -1, len = data.length, res = memo || data[++i];
      while (++i < len) res = iter(res, data[i], i, data);
    } else {
      var i = -1, keys = Object.keys(data), len = keys.length, res = memo || data[keys[++i]];
      while (++i < len) res = iter(res, data[keys[i]], keys[i], data);
    }
    return res;
  }

  _.toArray = _.to_array = _.map(_.idtt);

  _.negate = function(fn) {
    return (...args) => !fn(...args)
  }

  _.pipe = _pipe;
  function _pipe(...fns) {
    return function(...seed) {
      seed = seed.length === 1 ? seed[0] : _mr(...seed)
      return _go(seed, ...fns);
    }
  }

  _.go = _go; 
  function _go(seed, ...fns) {
    seed = _isFunction(seed) ? seed() : seed;
    
    return fns.reduce((se, fn) => {
      return _is_mr(se) ? fn(...se) : fn(se);
    }, seed);
  }

  _.tap = _tap;
  function _tap(...fns) {
    return function(...args) {
      _go(_mr(...args), ...fns);
      return _mr(...args);
    }
  }
  
  _.mr = _mr;
  function _mr(...args) {
    return args._mr = true, args;
  } 
  function _is_mr(arr) { 
    return arr && arr._mr; 
  }

  _.isFunction = _isFunction;
  function _isFunction(arg) {
    return typeof arg == "function";
  }

  _.object = _.keyval = _keyval;
  function _keyval(key, value) {
    return { [key] : value };
  }
  
  _.valkey = _valkey;
  function _valkey(value, key) {
    return { [key] : value };
  }

  _.nest = function f(key, value) {
    if (arguments.length == 1) return _(f, key);
    return key.split('.').reduceRight(_valkey, value);
  }

  _.log = (...args) => { console.log(...args) }

  _.pick = (target, ...keys) => {
    if (typeof keys[0] == 'function') {
      var predi = keys[0];
      keys = Object.keys(target);
      
      return keys.reduce((obj, key) => {
        return predi(target[key], key, target) ? (obj[key] = target[key], obj) : obj;
      }, {});
    }

    return keys.reduce((obj, key) => {
      return obj[key] = target[key], obj;
    }, {});
  }

  _.omit = (target, ...keys) => {
    if (typeof keys[0] == 'function') {
      var predicate = keys[0];
      return _.pick(target, _.negate(predicate));
    }
    
    return Object.keys(target).reduce((obj, key) => {
      return keys.includes(key) ? obj : (obj[key] = target[key], obj);
    }, {});
  }

  const call = (x, f) => f(x);

  const match = (function self(input) {
    const init = () => {
      self.actions = {};
      self.case = condition => (...fns) => {
          self.actions[condition] = fns;
          return self;
      };
      self.default = (...fns) => {
          self.actions.__default__ = fns;
          return self;
      };
    };

    if (input === undefined) {
      init();
      return self;
    }

    if (self.actions[input]) {
      const matarials = [input, ...self.actions[input]];
      const result = matarials.reduce(call);
      init();
      return result;
    } else {
      const matarials = [input, ...self.actions.__default__];
      const result = matarials.reduce(call);
      init();
      return result;
    } 
  })();

  _.match = match;

}(window)