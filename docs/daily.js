!function(window) {
  window._ = _partial;
  window.__ = _pipe;
  window.___ = {};

  _.identity = _.idtt = value => value
  
  _.always = value => () => value
  
  _.reduce = function(arr, iter, memo) {
    return arr.reduce(iter, memo || 0);
  }

  _.map = function f(data, iter) {
    if (arguments.length == 1) return _(f, _, data);

    var res = [];
    for (var i = 0; i < data.length; i++) {
      res[i] = iter(data[i], i, data);
    }
    return res;
  }

  _.values = _.map(_.idtt);

  _.negate = function(fn) {
    return (...args) => !fn(...args)
  }

  _.filter = function f(data, predi) {
    if (arguments.length == 1) return _(f, _, data);

    var res = [];
    for (var i = 0; i < data.length; i++) {
      if (predi(data[i], i, data)) res.push(data[i])
    }
    return res;
  }

  _.reject = function f(data, predi) {
    if (arguments.length == 1) return _(f, _, data);

    return _.filter(data, _.negate(predi));
  }

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
    if (arguments.length == 1) return _partial(f, key);
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

}(window)