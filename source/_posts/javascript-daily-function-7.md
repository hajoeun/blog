---
title: '[오늘의 함수] nest'
date: 2017-03-28 23:07:24
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 오늘의함수
---

```javascript
  var nest = function (key, value) {
    return _.reduceRight(key.split('.'), valkey, value);
  };

  function valkey(value, key) { 
    var obj = {};
    obj[key] = value;
    return obj; 
  }
```