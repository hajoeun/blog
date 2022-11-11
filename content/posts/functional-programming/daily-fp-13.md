---
title: '오늘의 함수 - is_enter'
date: 2018-01-21 11:02:13
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: _.if2 함수를 응용한 함수를 소개할까 합니다. 일명 is_enter 함수입니다.
slug: daily-fp-is_enter
---
_오늘 발견한 재미있는 함수를 소개합니다_

## is_enter

오늘은 [지난 시간](/programming/javascript-daily-function-12/)에 다룬 `_.if2` 함수를 응용한 함수를 소개할까 합니다. 일명 `is_enter` 함수입니다. 우리는 종종 이벤트 리스너에서 `keyCode` 값을 검사해서 특정 동작을 수행하곤 합니다. 특히 Enter 키에 해당하는 13이 입력되면 검색을 수행한다던지 하는 일을 자주 하죠. `is_enter`는 이 경우에 유용한 함수입니다.


#### (1) 어제의 함수
오늘의 예제는 너무 간단합니다. 키다운 이벤트에 해당하는 이벤트 리스너를 정의합니다. 이때 엔터키가 입력되면 특정한 동작을 수행하도록 분기를 만들어야합니다.

```javascript
$input_element.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    action(); // 검색을 하거나 DOM을 제어하는 등 원하는 동작을 정의합니다.
  }
})
```

별거 아닌 이 상황, `if`가 눈에 띕니다. [지난 시간](/programming/javascript-daily-function-12/)에 만들어둔 `_.if2` 함수를 사용할 수 있을 것 같습니다.


#### (2) 오늘의 함수

```javascript
$input_element.addEventListener('keydown', is_enter(function(e) {
  action(); // 검색을 하거나 DOM을 제어하는 등 원하는 동작을 정의합니다.
}))
```

`is_enter` 함수는 함수를 반환하는 함수입니다. 만약에 `keyCode`가 13과 같다면 인자로 받은 함수를 실행시킬 준비가 된 함수를 만듭니다. 어떻게 구현되었는지를 보면 이해가 쉽습니다.

```javascript
var is_enter = function(...fns) { // [1]
  return _.if2(function(e) { return e.keyCode === 13 })(...fns); // [2]
};
```

`_.if2` 함수는 총 세차례 실행됩니다. __첫번째 실행에서는 조건을 받고, 두번째 실행에서는 해야할 일을 받습니다. 마지막 실행에서 판단할 데이터를 받습니다.__ 이와 같은 맥락으로 이해하자면 [2]의 `_.if2`는 두번까지만 실행된 상황입니다. 조건을 정의하고 있고 어떤 일을 할지를 받았습니다. 여기서 어떤 일을 정의하는 함수가 여러개임을 알 수 있습니다. [1]에서 스프레드 연산자 (혹은 전개 연산자)를 사용해서 배열로 이루어진 함수 목록 `fns`를 받았습니다. 이를 `_.if2` 함수의 두번째 실행에서 스프레드 연산자로 실행시켰습니다. (기억하시는 것처럼 `_.if2`는 조건과 실행부에서 `_.pipe` 함수를 사용합니다.) 마지막 실행을 남겨둔 채로 `_.if2`는 반환됩니다. 이 상황을 기억하고 다시 위의 예제를 살펴보겠습니다.


```javascript
$input_element.addEventListener('keydown', is_enter(function(e) { // [1]
  action();
}))
```

[1]에서 `is_enter`가 실행되면서 `fns`가 정의됐습니다. 그리고 이제 세번째 실행을 남겨둔 `_.if2` 함수가 그 자리를 대신하고 있는 셈입니다. 세번째로 실행될 때 비로소 판단할 데이터를 받고 미리 가지고 있던 조건부 함수와 해야할 함수 목록인 `fns`를 이용해서 조건이 맞으면(`keyCode`가 13이라면) 계획된 동작을 수행합니다. (여기서 '미리 가지고 있던'이 가능한 이유는 이 함수가 클로저이기 때문입니다.) 근사하죠?

---

#### (3) 이런 함수는 어때요? `key_code`

`is_enter`만 있으니 다른 키보드들이 서운하지 않을까요? 러시아 같은 영토를 자랑하는 스페이스바와 esc 같은 키보드를 위한 함수도 만들어줄 수 있을 것 같습니다. `key_code`라는 함수가 있다면 이 모든 키보드를 위한 함수를 만들어줄 수 있겠네요.

```javascript
function key_code(num) {
  return function(...fns) {
    return _.if2(function(e) { return e.keyCode === num })(...fns);
  }
}

var is_enter = key_code(13);
var is_space_bar = key_code(32);
var is_tab = key_code(9);
var is_esc = key_code(27);
```
