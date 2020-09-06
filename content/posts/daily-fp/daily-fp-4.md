---
title: '오늘의 함수 - identity, always'
date: 2017-03-20 23:41:48
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 이름부터 심상치 않은 identity와 always 함수 입니다.
slug: 'daily-fp-identity-always'
---
_오늘 발견한 재미있는 함수를 소개합니다_

## identity, always 함수

오늘은 정말 황당한(?) 함수 두개를 소개하겠습니다. 이름부터 심상치 않은 `identity`와 `always` 함수 입니다. 오늘은 어제의 함수를 생략하고 곧장 함수 소개를 하겠습니다.

#### (1) 오늘의 함수 - identity와 always
```javascript
function identity(value) {
  return value;
}

function always(value) {
  return function() {
    return value;
  }
}

console.log(identity(10)); // 10
console.log(always(10)()); // 10
```

정말 황당한 함수입니다. 뭐하자는건가 싶습니다. 넣은 값을 그대로 반환할거면 왜 굳이 함수를 썼어야했나 싶습니다. 하지만 이 함수들은 아주 유용한 함수들입니다. 함수를 값으로 다루는 프로그래밍에서는 이 함수들은 아주 빈번하게 등장합니다. 지난번에 소개해드렸던 `confirm` 함수를 사용해서 예시를 만들어보겠습니다.

#### (2) 오늘의 함수 - confirm 함수와의 콜라보 1
```javascript
function _confirm(message, yes_fn, no_fn) { // [1] 출력할 메시지와 성공, 실패에 따라 실행할 함수를 받는 confirm 함수입니다.
  return confirm(message) ? yes_fn() : no_fn();
}

$('li').on('click', 'button.delete', function(e) {
  _confirm('Are you sure?', function() { // [2] '확인'을 눌렀을 때 동작하게될 함수입니다.
    $(e.delegateTarget).remove();
  }, always(false)) // [3] '취소'를 눌렀을 때 동작하게될 함수입니다. 이 경우에 항상 'false'를 반환하는 함수입니다.
})
```

주목하셔야할 부분은 역시 `always` 함수가 등장한 [3] 지점입니다. 이전에는 해당 코드가 `function() { return false }`로 되어 있었습니다. 오늘 만든 새로운 함수를 써서 보다 간결하게 표현할 수 있게 되었습니다. 그냥 함수를 읽기만 하면 저 코드는 '_항상 false를 반환하는구나_'하고 이해가 됩니다.

사실 이 예제에서 `identity` 함수를 사용하기에는 어려움이 있습니다. `always`와 같이 사용하려면 `_confirm` 함수를 조금 바꿔줘야 합니다.

#### (3) 오늘의 함수 - confirm 함수와의 콜라보 2
```javascript
function _confirm(message, yes_fn, no_fn) {
  var res = confirm(message); // [1] confirm 함수의 실행 결과를 아래의 함수에 전달하기 위해 별도로 할당했습니다.
  return res ? yes_fn(res) : no_fn(res);
}

$('li').on('click', 'button.delete', function(e) {
  _confirm('Are you sure?', function() {
    $(e.delegateTarget).remove();
  }, identity) // [2] 항상 'false'를 반환하게 됩니다.
})
```

`_confirm` 함수를 조금 바꿔서 `identity` 함수가 `always(false)`를 사용한 것과 같은 결과를 만들도록 했습니다. 보다 적절한 예제는 다음 시간에 소개해드릴 `pipe` 함수를 통해서 보여드릴 수 있을 것 같습니다.
