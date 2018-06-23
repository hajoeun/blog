---
title: '오늘의 함수 - if2'
date: 2017-12-06 14:12:21
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 기존의 _.if와 _.if2의 문법적 차이를 먼저 살펴보고 구현 방식의 차이에 대해서도 이야기해보겠습니다.
---
_오늘 발견한 재미있는 함수를 소개합니다_

## if2

오늘은 [지난 시간](/programming/javascript-daily-function-11/)에 예고한대로 `_.if2` 함수를 살펴보겠습니다. 기존의 `_.if`와 `_.if2`의 문법적 차이를 먼저 살펴보고 구현 방식의 차이에 대해서도 이야기해보겠습니다. (오늘의 함수를 이해하기 위해 반드시 [오늘의 함수 - if](/programming/javascript-daily-function-11/)를 확인하고 오셔야합니다.)


#### (1) 어제의 함수
기존의 `_.if`는 `_.if(predi, fn)`의 형태로 사용합니다. 조건이 되는 `predi`와 조건에 따라 실행할 `fn`을 인자로 전달하는데 이때 `fn`을 정의하기 위해서 `_pipe`와 같은 합성 함수를 사용해야 합니다. [window.functions.js](https://github.com/marpple/window.functions.js)와 함께 사용하면 아래와 같은 예제를 만들어 볼 수 있습니다.

```javascript
_go(11,
  _.if(_lt(10), // [1] 10보다 작으면
    _pipe(
      _add(100), 
      console.log)
  ).else_if(_gte(20), // [2] 20과 같거나 크면
    _pipe(
      _add(200), 
      console.log)
  ).else(
    _pipe(
      _add(300), 
      console.log)
  )); 
  // [3] 결과는 311 입니다.
```

지난 시간에 이미 보여드린 것처럼 위의 코드는 `_.if2` 함수를 만나 아래와 같은 형태로 다르게 적을 수 있습니다.

```javascript
_go(11,
  _.if2(_lt(10))(
    _add(100), 
    console.log
  ).else_if(_gte(20))(
    _add(200), 
    console.log
  ).else(
    _add(300), 
    console.log
  ));
```

`_.if2`에서는 괄호를 연달아 두번 열어줍니다. 첫번째 괄호는 조건부를 담고 두번째 괄호는 실행부를 담습니다. 각 괄호 안에 몇개의 함수를 담건 합성해서 실행합니다. 코드가 간결해졌을뿐 아니라 본래의 if와 유사한 형태를 띄고 있습니다. 훨씬 직관적인 함수가 되었습니다.


#### (2) 오늘의 함수
이제 `_.if2`가 어떻게 구현되었는지 살펴보겠습니다.

```javascript
_.if2 = function() {
  var predi = _.pipe.apply(this, arguments); // [1]
  return function() {
    var store = [[predi, _.pipe.apply(this, arguments)]]; // [2]
    
    function If() { // [3]
      var context = this, args = arguments; 
      return _.go(store,
        _.find(function(fnset) { return fnset[0].apply(context, args); }),
        function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; });
    }
    
    return _.extend(If, {
      else_if: function() {
        var predi = _.pipe.apply(this, arguments); // [4]
        return function() { return store.push([predi, _.pipe.apply(this, arguments)]) && If; }; // [5]
      },
      else: function() { return store.push([_.constant(true), _.pipe.apply(this, arguments)]) && If; }
    });
  };
};
```

지난 시간에 살펴본 `_.if` 함수의 내부와 상당히 유사한 코드입니다. 함수의 실행 시기의 차이로 인해 몇가지 다른 점이 보입니다. 이번에도 주석을 따라 순서대로 설명하겠습니다. 

[1] Line 2 - 가장 밖에 있는 함수는 인자로 조건부에 해당하는 함수들을 받습니다. 그 함수들을 `_.pipe` 함수로 합성해둡니다. 나중에 `store`에 저장하기 위함입니다.

[2] Line 4 - `_.if` 함수와 마찬가지로 `store`라는 배열을 만듭니다. 이 배열은 위에서 만들어둔 조건 판별 함수인 `predi`와 현재 함수에서 받은 인자로 받은 함수들 즉, 실행될 함수 `fn`을 묶음으로 가진 2차원 배열입니다. 여기서도 `_.pipe`로 인자들을 합성합니다. 

[3] Line 6 - `_.if` 함수의 `If` 함수와 동일합니다. [오늘의 함수 - if](/programming/javascript-daily-function-11/)를 참고하세요.

[4] Line 15 - [1]번에서와 같이 `store`에 저장하기 위해 인자로 받은 함수를 합성합니다.

[5] Line 16 - [2]번처럼 실행될 함수를 만들어 조건부 함수와 함께 `store`에 넣어둡니다.