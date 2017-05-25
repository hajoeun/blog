!function(window) {
  window._ = _partial;
  window.__ = _pipe;
  window.___ = {};

  _.identity = value => value
  
  _.always = value => () => value
  
  _.reduce = function(arr, iter, memo) {
    return arr.reduce(iter, memo || 0);
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
          args2 = parts2.slice()
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
  function _pipe(...funcs) {
    return function(...seed) {
      seed = seed.length === 1 ? seed[0] : _mr(...seed)
      return _go(seed, ...funcs);
    }
  };

  _.go = _go; 
  function _go(seed, ...funcs) {
    seed = _isFunction(seed) ? seed() : seed;
    
    return funcs.reduce((value, func) => {
      return _is_mr(value) ? func(...value) : func(value);
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
  };

  _.log = (...args) => { console.log(...args) }

  _.pick = (target, keys) => {
    return keys.reduce((obj, key) => {
      return obj[key] = target[key], obj;
    }, {});
  };

}(window)