---
title: javascript-daily-function
categories:
  - joeun.me
date: 2018-01-29 22:56:22
tags:
---
```javascript
function all() {
  var count = -1, fns = []; // [4]
  return function _all(x) { // [5]
    return ++count < arg ? (fns.push(x), _all) : go(fns, map(fn => fn(x))); // [6] 
  }; 
}
```