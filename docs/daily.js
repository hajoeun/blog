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


// test

function test(...rest) {
  console.log(...rest);
}

var test1 = _.partial(test, 1, 2);
var test2 = _.partial(test, 1, _, _, 4, _, 6, 7);
var n = _.nest('n.n.n')(10);
// console.log(n.n.n.n);


var str = "Hello, world!";

function str_reverse(str) {
  return str.split('').reverse().join('');
}

function isNegZero(n) { 
  n = Number(n); 
  return (n === 0) && (1/n === -Infinity);
}

var to_array = function(a,b,c,d) { 
  return [a, b, c, d];
}

// var temp_to_array = _.partial(to_array, 1, _, 3);
// temp_to_array(2, 4); // [1, 2, 3, 4]

// var test = function(...args) {
//   console.log(...args);
// }

// var skip = _.partial(test, 1, _, 3);
// skip(20, 40); // 1, 20, 3, 40

// var add = function(a, b, cb) {
//   setTimeout(function() {
//     cb(a + b);
//   }, 1000);
// }

// var sub = function(a, b, cb) {
//   setTimeout(function() {
//     cb(a - b);
//   }, 1000);
// }

// var div = function(a, b, cb) {
//   setTimeout(function() {
//     cb(a / b);
//   }, 1000);
// }

// var test1 = function() {
//   add(10, 15, (a) => sub(a, 5, (b) => div(b, 10, (c) => console.log(c))));
//   return "test1 실행!!";
// }

// var wrap = function(func) {
//   return function() {

//     return func(...arguments)
//   }
// }

// var add2 = wrap(add);

// var sub2 = wrap(sub);

// var div2 = wrap(div);

// var test2 = function() {
//   add2(10, 15, (a) => sub2(a, 5, (b) => div2(b, 10, (c) => console.log(c))));
//   return "test2 실행!!";
// }

// var async = function(func) {
//   return function() {
//     arguments[arguments.length++] = function(result) {
//       _cb(result);
//     };
//     (function wait(args) {
//       // args가 클로저로 생성된 상태
//       for (var i in args)
//         if (args[i] && args[i].name == '_async_cb_receiver')
//           return args[i](function(arg) {
//             args[i] = arg; 
//             wait(args); 
//           })
//       func(...args);
//     })(arguments)

//     var _cb;
//     function _async_cb_receiver(cb) {
//       _cb = cb
//     }
//     return _async_cb_receiver;
//   }
// }

// var add4 = async(add);

// var sub4 = async(sub);

// var div4 = async(div);

// var async_log = async(function(val) {
//   setTimeout(function() {
//     console.log(val);
//   }, 0);
// });

// var test4 = function() {
//   debugger;
//   async_log(div4(add4(add4(10, 15), 5), 10));
//   return "test4 실행!!";
// }

// function log(...args) { console.log(...args) }
// var range_log = (a, b) => (f => f(f))(f => _.log(a) || a++ == b || f(f))