---
title: '오늘의 함수 - all'
date: 2018-01-29 21:43:13
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: all은 하나의 인자를 다수의 함수에게 전달합니다.
slug: daily-fp-all
---
_오늘 발견한 재미있는 함수를 소개합니다_

## all

오늘은 `all`이라는 함수를 소개합니다. [지난 시간](/programming/javascript-daily-function-14/)에 소개해드린 `mr`처럼 `go`나 `pipe`안에서 사용합니다. `all`은 하나의 인자를 다수의 함수에게 전달합니다. 달리 표현하자면 하나의 재료(값)로 여러가지 일(함수)을 처리해야할 때 `all`을 사용합니다.

(예제는 [함수형 JS 스터디 시즌2](https://github.com/hajoeun/functional-js-study2)의 [4주차 미션](https://github.com/hajoeun/functional-js-study2/issues/4)을 토대로 합니다.)

#### (1) 어제의 함수

```javascript
var users = [
  { id: 1, name: 'ID', age: 36 },
  { id: 2, name: 'BJ', age: 32 },
  { id: 3, name: 'JM', age: 34 },
  { id: 4, name: 'PJ', age: 27 },
  { id: 5, name: 'HA', age: 25 },
  { id: 6, name: 'JE', age: 26 },
  { id: 7, name: 'JI', age: 31 },
  { id: 8, name: 'MP', age: 23 }
];
```

위의 `users`로 세 종류의 데이터를 추출하려고 합니다.

1. 30세 미만의 유저들의 이름 목록
2. 30세 이상의 유저들의 나이의 총합
3. 이름이 'JE'인 유저의 나이

```javascript
// 1. 30세 미만의 유저들의 이름 목록
go(users,
  filter(user => user.age < 30),
  map(user => user.name),
  log) // ["PJ", "HA", "JE", "MP"]

// 2. 30세 이상의 유저들의 나이의 총합
go(users,
  filter(user => user.age > 30),
  reduce((age, user) => (age + user.age), 0),
  log) // 133

// 3. 이름이 'JE'인 유저의 나이 (첫번째로 발견한 'JE')
go(users,
  find(user => user.name === 'JE'),
  user => user.age,
  log) // 26
```


#### (2) 오늘의 함수
어제의 함수들은 `users`라는 공통의 재료를 사용합니다. 각기 다른 `go`에 존재하지만 같은 값을 사용하는 함수들을 하나의 `go` 안에 모아보겠습니다.

```javascript
go(users,
  all(
    pipe(filter(user => user.age < 30), map(user => user.name)), // 1. 30세 미만의 유저들의 이름 목록
    pipe(filter(user => user.age > 30), reduce((age, user) => (age + user.age), 0)), // 2. 30세 이상의 유저들의 나이의 총합
    pipe(find(user => user.name === 'JE'), user => user.age)), // 3. 이름이 'JE'인 유저의 나이
  log) // ["PJ", "HA", "JE", "MP"] 133 26
```

이렇게 달라집니다. 간단히 살펴보겠습니다. `all` 함수는 함수를 인자로 받습니다. 여러개의 함수를 받고 이후에 들어오는 값을 그 함수들에게 인자로 넘겨줍니다. 위의 코드에선 해야할 일을 묶어서 정리하기 위해 `pipe`로 함수를 합성했습니다. 합성된 함수는 총 세개임으로 `users`는 세 함수에게 값으로 전달됩니다. 그리고 각기 해야할 일을 마친 뒤 `log`에 전달됩니다. (`all`은 내부적으로 `mr`에 의해 여러개의 값을 리턴합니다.) 이제 `all`의 구현을 살펴보겠습니다.


```javascript
function all(...fns) { // [1]
  return function(arg) { // [2]
    return go(fns, map(fn => fn(arg)), to_mr); // [3]
  };
}
```

생각보다 간결합니다.

[1] `all` 함수는 함수들을 인자로 받습니다. 가변인자(배열)로 함수를 받았습니다.
[2] 우선 함수(클로저)를 리턴하는데 이 함수는 이후에 호출될 때 재료가 될 값을 받습니다.
[3] `go`를 실행합니다. 함수들이 담긴 배열을 첫번째 값으로 전달하고 `map`으로 함수가 실행된 결과를 모아둡니다. 그리고 [지난 시간](/programming/javascript-daily-function-14/)에 자매품으로 소개해드린 `to_mr`으로 배열을 멀티 리턴 값으로 바꿔줍니다.
