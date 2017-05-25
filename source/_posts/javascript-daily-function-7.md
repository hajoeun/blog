---
title: '[오늘의 함수] partial'
date: 2017-04-19 23:41:48
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 오늘의함수
---
_오늘 발견한 재미있는 함수를 소개합니다_

## partial 함수

함수를 만들면서 프로그래밍을 하다보면 `pipe`와 같이 새로운 함수를 만들어주는 함수가 필요한 경우가 있습니다. 오늘 소개해드릴 `partial`도 그런 유형의 함수입니다. 사실 '새로운 함수'를 만들어준다고 보기에는 어려움이 있을 것 같습니다. 이 함수는 __기존의 함수에 인자를 미리 적용해두는 일을 하는 함수__입니다. 내장함수 중에서 `bind`와 같은 일을 합니다. 

#### (1) 어제의 함수 - 인자를 미리 적용해두기

```javascript
var sum = function(a, b, c) {
  return a + b + c;
};

var sum10 = sum.bind(null, 10); // [1] 첫번째 인자로 넘긴 null은 this 값 입니다.
var sum20 = sum.bind(null, 10, 10);
sum10(1, 2); // 13
sum20(50); // 70
```

내장 함수를 사용하는 것도 나쁘지 않아보입니다. 하지만 이 함수에는 아쉬운 점이 있습니다. 반드시 순서대로 인자를 적용해야한다는 점입니다. 중간 인자를 건너뛰고 마지막 인자만 미리 적용해두고 싶을 땐 사용할 수 없다는 점이 아쉽습니다. 그래서 필요한 함수가 `partial`입니다. 우리가 원하는 '건너뛰고 적용하기'까지를 구현하기 위해선 평소보다 긴 함수를 정의해야 합니다. 고로 단계별로 함수를 발전시켜 보겠습니다.


#### (2) 오늘의 함수 - 1단계: bind와 같은 수준의 partial

```javascript
var partial = function(func, ...args1) { // [1] 인자를 적용해둘 대상이 되는 함수 func를 받고 적용될 인자 rest 파라미터를 이용해 배열로 받습니다. (args1 = 미리 적용된 인자)
  return function(...args2) { // [2] 인자가 적용된 상태로 추가적인 인자를 받을 준비가 된 함수를 반환합니다. (args2 = 추가될 인자)
    return func(...[...args1, ...args2]); // [3] 배열로 받은 인자들을 전개해서 함수에 값으로 전달하여 실행합니다. or 'return func.apply([...args1, ...args2])'
  }
}

var sum10 = partial(sum, 10);
var sum20 = partial(sum, 10, 10);
sum10(1, 2); // 13
sum20(50); // 70
```

ES6에 새롭게 추가된 기능인 [Spread 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_operator)를 사용했습니다. 덕분에 코드가 간결해졌습니다. 결과적으로 `bind`와 같은 역할을 하는 함수가 만들어졌습니다. 현재 상황에서는 여전히 인자를 순서대로 적용해야만합니다. 다음 단계에서 건너뛰기가 가능하도록 만들어보겠습니다.


#### (3) 오늘의 함수 - 2단계: 건너뛰기가 가능한 partial

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

var sum10 = partial(sum, 10);
var sum20 = partial(sum, _, 20);
sum10(1, 2); // 13
sum20(50, 50); // 120

var test = function(a, b, c, d) { // [5] 네개의 인자를 받아 출력하는 테스트 함수입니다.
  console.log(a, b, c, d);
}

var skip = partial(test, 1, _, 3); // [6] 건너뛰기 키워드를 사용해서 인자 b와 d의 값을 지정하지 않은 채로 skip 함수를 생성합니다.
skip(20, 40); // [7] 인자 b와 d에 값이 적용됩니다. 결과 값은 1, 20, 3, 40
```

(건너뛰기라는 표현이 와닿지 않을 수도 있을 것 같아 부연설명합니다. 미리 적용될 인자를 나중에 적용하도록 유보시킨다는 관점에서는 '건너뛰기'라고 말할 수 있지만 다음에 들어올 인자의 자리를 비워둔다는 관점으로는 '비워두기'가 더 적절한 표현일 것 같습니다. 비워둔 자리에 두번째로 들어오는 인자 값이 적용된다고 이해하시면 좋을 것 같습니다.)