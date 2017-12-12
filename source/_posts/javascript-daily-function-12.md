---
title: '오늘의 함수 - if2'
date: 2017-12-06 14:12:21
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## if2

오늘은 [지난 시간](/programming/javascript-daily-function-11/)에 예고한대로 `_.if2` 함수를 살펴보겠습니다. 기존의 `_.if`와 `_.if2`의 문법적 차이를 먼저 살펴보고 구현 방식의 차이에 대해서도 이야기해보겠습니다.

//// 이후부터 작성 
#### (1) 어제의 함수
기존의 `_.if`는 `_.if(predicate, functions)`의 형태로 사용합니다. 조건이 되는 

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


#### (3) 내일의 함수
`_.if` 함수의 불편한 점을 발견하지 못하셨나요? 인자를 두개 넘겨서 조건부와 실행부를 결정하기 때문에 각 함수를 `_.pipe` 함수와 같은 합성 함수로 묶어줘야 합니다. 아무래도 불편하죠. 실제로 하나의 함수로 모든 일을 하는 경우는 드문 일이니까요. 그냥 알아서 함수를 합성해주면 더 편할텐데요. 그래서 만들어진 `_.if2`를 다음 시간에 소개할까 합니다. 이 함수를 사용하면 코드는 아래처럼 달라집니다.

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