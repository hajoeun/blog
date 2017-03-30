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
  var nest = function(key, value) {
    return key.split('.').reduceRight(valkey, value);
  };

  function valkey(value, key) { 
    return { [key] : value }; // ES6부터 지원하는 문법입니다. (Computed property names) 
  }
```