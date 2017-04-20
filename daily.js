!function(window) {
  window._ = _partial;

  _.identity = value => value
  
  _.always = value => () => value
  
  _.partial = _partial;
  function _partial(func, ...args) {
    
    return function(...args2) {
      let args1 = Array.from(args);
      // let args1 = Object.assign([], args);
      // let args1 = Array.prototype.slice.call(args);

      for (let i in args1) {
        if (args1[i] === _) { 
          args1[i] = args2.shift(); 
        }
      }

      return func(...[...args1, ...args2]);
    }
  }
  
  _.pipe = (...funcs) => (...seed) => {
    seed = seed.length === 1 ? seed[0] : _mr(...seed)
    return _go(seed, ...funcs);
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

  function _valkey(value, key) {
    return { [key] : value };
  }

  _.nest = function f(key, value) {
    if (arguments.length == 1) return _partial(f, key);
    return key.split('.').reduceRight(_valkey, value);
  };

  _.pick = (target, keys) => {
    return keys.reduce((obj, key) => {
      return obj[key] = target[key], obj;
    }, {});
  };

}(window)


// test

function test(...rest) {
  return rest;
}

var test1 = _.partial(test, 1, 2);
var test2 = _.partial(test, 1, _, _, 4, _, 6, 7);
var n = _.nest('n.n.n')(10);
console.log(n.n.n.n);


var str = "Hello, world!";

function str_reverse(str) {
  return str.split('').reverse().join('');
}

console.log(str_reverse(str));