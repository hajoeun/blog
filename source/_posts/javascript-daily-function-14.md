---
title: '오늘의 함수 - mr'
date: 2018-01-27 22:51:05
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## mr

오늘은 `mr`이라는 함수를 소개합니다. `mr`은 Multiple Return의 약자입니다. 여러개의 값을 리턴하기 위해 사용하는 함수죠. `go`나 [`pipe`같은 함수](/programming/javascript-daily-function-5/) 안에서 사용합니다. 한번 살펴보겠습니다.


#### (1) 어제의 함수
자바스크립트는 하나의 값만 리턴할 수 있습니다. (Go와 같은 언어에서는 자체적으로 이와 같은 [기능을 지원](https://gobyexample.com/multiple-return-values)합니다.)

```javascript
function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(1, 2, 3)); // 6
// go(1,2,3, sum, console.log); // 불가능

function sum_arr(arr) {
  return arr.reduce((a, b) => a + b);
}
console.log(sum_arr([1, 2, 3])); // 6
go([1,2,3], sum_arr, console.log); // 6
```

여러개의 값을 인자로 전달해서 함수를 실행하기 위해선 반드시 직접 실행하거나 배열로 값을 전달해서 처리하도록 해야만합니다.


#### (2) 오늘의 함수
이때 `mr`함수가 있으면 문제를 해결할 수 있습니다.

```javascript
go(mr(1,2,3), 
  sum, 
  console.log); // 6
```

`mr`이라고 값들을 감싸서 전달하면 `go`함수가 이 값을 다음 함수에 풀어서 전달합니다. 이와 같은 구조로 인해 기존의 `go`함수를 고쳐줘야합니다.

```javascript
function go() { // 기존의 go
  return reduce(arguments, function(arg, fn) {
    return fn(args);
  })
}

function go() { // Multiple Return을 지원하는 go
  return reduce(arguments, function(arg, fn) {
    return arg.__mr ? fn(...arg) : fn(arg);
  })
}
```

달라진 것은 `reduce`에게 전달되는 함수 내부에 삼항연산자로 인자에 `__mr` 프로퍼티가 참이면 인자를 풀어서 전달하고 그렇지 않으면 그대로 전달하도록 해준 것이 전부입니다. 이제 `mr`이 어떤 모습일지 상상이 가지 않나요?

```javascript
function mr() {
  arguments.__mr = true;
  return arguments;
}
```

단지 `arguments`객체에 `__mr`이라는 프로퍼티를 붙이고 거기에 참 값을 넣어 그대로 리턴한 것뿐입니다. 이와 같은 방법으로 `go`와 `pipe`같은 함수 내에서 여러개의 값을 리턴할 수 있습니다. 

```javascript
go(10,
  function(a) {
    return mr(a, 20, 30);
  },
  sum,
  console.log) // 60
```

자매품으로 일반 배열을 위한 `to_mr`함수도 있습니다.

```javascript
function to_mr(arr) {
  return arr.__mr = true, arr;
}

go([10, 20, 30],
  to_mr,
  sum,
  console.log) // 60
```