---
title: '오늘의 함수 - partial2'
date: 2017-04-26 22:54:34
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 지난 시간에 만든 partial 함수보다 향상된 버전의 함수를 준비해보았습니다.
slug: daily-fp-partial2
---
_오늘 발견한 재미있는 함수를 소개합니다_

## partial2 함수

오늘은 지난 시간에 만든 `partial` 함수보다 향상된 버전의 함수를 준비해보았습니다. 지난 함수와 구분 짓기 위해 `partial2`라고 이름 붙였지만 하는 일은 같습니다. 인자가 미리 적용된 함수를 반환하는 함수입니다. 간단히 이전의 함수를 살펴보겠습니다.

#### (1) 어제의 함수 - partial

```javascript
var _ = {}; // [1] 건너뛰기의 단서가 될 키워드를 하나 만들어둡니다.
var partial = function(func, ...args) {
  return function(...args2) {
    var args1 = args.slice(); // [2] 생성된 클로저의 값이 변경되는 것을 막기 위해 배열을 복제합니다.

    for (var i in args1) {
      if (args1[i] === _) { // [3] 단서인 키워드와 일치하는 값이면
        args1[i] = args2.shift(); // [4] 그 자리에 추가될 인자 값을 넣어줍니다.
      }
    }

    return func(...[...args1, ...args2]);
  }
}

var sum = function(a, b, c) {
  return a + b + c;
};

var sum10 = partial(sum, 10);
var sum20 = partial(sum, _, 20);
sum10(1, 2); // 13
sum20(50, 50); // 120

var log = partial(console.log, 0, _, 0, 0, _, 0);
log(1,2,3); // 0 1 0 0 2 0 3
```

이번에 기존 `partial` 함수에 아쉬운 점은 '유연함'입니다. 인자를 조금 더 유연하게 받을 수 있다면 좋지 않을까요? 건너뛰기를 위한 단서인 `_`는 한번에 한 칸만 건너뜁니다. 몇번을 건너뛸지 알 수 없을 때 두번째로 들어오는 인자에 따라 유연하게 건너뛸 수 있다면 조금 더 편할 것 같습니다. 바로 오늘의 주인공인 `partial2`입니다.


#### (2) 오늘의 함수 - partial2

```javascript
var partial2 = function(func, ...parts) {
  var parts1 = [], parts2 = [], ___idx = parts.length;

  for (var i in parts) {
    if (parts[i] == ___) {
      ___idx = i;
    }
    else if (i < ___idx) {
      parts1.push(parts[i]);
    }
    else {
      parts2.push(parts[i]);
    }
  }


  return function(...args) {
    var args1 = parts1.slice(),
        args2 = parts2.slice(),
        rest = args.slice();

    for (var i in args1) {
      if (args1[i] == _) {
        args1[i] = rest.shift();
      }
    }

    for (var i in args2) {
      if (args2[i] == _) {
        args2[i] = rest.pop();
      }
    }

    return func(...[...args1, ...rest, ...args2]);
  }
}

var log = partial2(console.log, 0, _, 0, ___, 0, _, 0);
log(1,2,3,4,5,6,7,8,9,10); // 0 1 0 2 3 4 5 6 7 8 9 0 10 0

var greeting = partial2(console.log, 'Hello,', _, ___, 'Nice to meet you.');
greeting('Joeun.', 'My name is', 'Momo.', '\n', 'I\'m', 27, 'years old.\n');
/*
Hello, Joeun.
 My name is Momo.
 I'm 27 years old.
 Nice to meet you.
*/
```
