---
title: '오늘의 함수 - pipe2'
date: 2018-03-29 20:21:56
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: pipe는 함수를 합성하는 함수입니다.
slug: daily-fp-pipe2
---
_오늘 발견한 재미있는 함수를 소개합니다_

## [pipe](https://marpple.github.io/partial.js/docs/#pipe)

오늘은 `pipe` 함수를 소개하는 두번째 시간입니다. [처음 소개해드린게](/programming/javascript-daily-function-5/) 벌써 1년도 전의 일이네요. 처음 소개해드렸던 것처럼 `pipe`는 함수를 합성하는 함수입니다. 이번 시간에는 멀티 리턴([mr](/programming/javascript-daily-function-14/))을 지원하는 `pipe`의 구현과 사용을 보여드릴까 합니다. 우선 지난 구현을 살펴보시죠.

#### (1) 어제의 함수

```javascript
function pipe() {
  var funcs = Array.prototype.slice.apply(arguments);
  // [1] 함수에 들어온 인자(함수)들의 모임인 arguments를 배열로 만들어줍니다. (원래 arguments는 유사 배열입니다.)
  return function(seed) {
    return funcs.reduce(function(value, func) {
      // [2] reduce 함수를 사용해서 함수의 실행 결과를 하나로 합칩니다.
      return func(value);
    }, seed);
  };
}
```

처음 소개해드린 `pipe`의 구현을 그대로 가져왔습니다. 이렇게 구현된 함수는 아래와 같이 사용할 수 있습니다.

```javascript
const add = a => b => a + b;
const adds = pipe(add(5), add(10), add(20));

console.log(adds(10)); // 45 (10 + 5 + 10 + 20)
```

값을 하나씩만 넘겨서 하나의 인자로만 연산하는 함수를 합성하는데는 전혀 문제가 없습니다. 문제가 생기는 상황은 두개의 인자를 전달하는 상황입니다.

```javascript
const adds2 = pipe((a, b) => a + b, add(10), add(20));

console.log(adds2(10, 20)); // NaN
```

이때 `NaN`이 나온 이유는 `pipe` 안의 첫번째 함수에서 받은 `a`,`b` 중에서 `b`가 전달되지 않았기 때문입니다. 그래서 `10 + undefined`가 되는거죠. 결과적으로 첫번째 함수의 결과가 `NaN`이 되어 결과값도 `NaN`이 됩니다. 이제 두개의 인자를 전달할 수 있는 `pipe2`를 사용해보겠습니다.


#### (2) 오늘의 함수

```javascript
const adds3 = pipe2((a, b) => a + b, add(10), add(20));

console.log(adds3(10, 20)); // 60 (10 + 20 + 10 + 20)
```

이번엔 의도한대로 60이 나옵니다. `a`와 `b`에 온전한 값이 들어갔기 때문입니다. 여러개의 인자를 받을 수 있는 상황이 되었다는 뜻인데, 어떻게 구현했는지 살펴보겠습니다.

```javascript
function pipe2() {
  let funcs = Array.prototype.slice.apply(arguments);
  return function(seed) {
    let init = seed;
    if (arguments.length > 1) { // [1]
      init = arguments;
      init.__mr = true; // [2]
    }
    return funcs.reduce(function(value, func) {
      return value.__mr ? func(...value) : func(value); // [3]
    }, init);
  };
}
```

[1] 함수를 실행하기 전에 초기값으로 들어온 인자들의 수를 파악합니다. 1개 이상이라면 멀티 리턴을 위한 단서를 만들어줘야 합니다.
[2] 그 단서는 `__mr` 이라는 값(프로퍼티)입니다. 이 값이 참이면 이후에 해당 값을 `apply`나 `...`(전개 연산자)를 이용해서 실행합니다.
[3] `value`가 멀티 리턴을 해야하는 값이라면, 전개 연산자를 사용해서 함수를 실행합니다.

`pipe2`의 핵심 아이디어는 **`__mr`이라는 단서를 프로퍼티로 붙여준다**는 것. 그리고 **단서가 있으면 값을 전개해서 함수를 실행하도록 한다**는 것입니다. 해당 방식을 보다 적극적으로 활용하기 위해서는 `mr`이나 `to_mr` 같은 함수를 사용해야합니다. 다음 시간에는 그 활용에 대해 이야기 해보겠습니다.


#### (3) 미리 보기

```javascript
const adds4 = pipe2(
  (a, b) => mr(a + b, 4),
  (a, b) => a * b,
  add(20)
);

console.log(adds4(10, 20)); // 140 ((10 + 20) * 4 + 20)
```

```javascript
const adds5 = pipe2(
  all(
    add(5),
    add(10)
  ),
  (a, b) => a * b
);

console.log(adds5(10)); // 300 ((10 + 5) * (10 + 10))
```
