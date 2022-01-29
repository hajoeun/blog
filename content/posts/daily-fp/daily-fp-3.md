---
title: '오늘의 함수 - confirm'
date: 2017-03-15 23:37:46
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 새로운 함수를 만드는 것이 그렇게 화려한 일이 아님을 보여드리고 싶어 간단한 함수를 준비해봤습니다. 바로 confirm 함수 입니다.
slug: daily-fp-confirm
---
_오늘 발견한 재미있는 함수를 소개합니다_

## confirm 함수

오늘은 정말 단순한 함수입니다. 아이디어가 없어서라기보다 새로운 함수를 만드는 것이 그렇게 화려한 일이 아님을 보여드리고 싶어 간단한 함수를 준비해봤습니다. 바로 `confirm` 함수 입니다. 브라우저 환경에서 기본으로 제공하는 함수이기도 합니다. 기존의 사용법은 아래와 같습니다.

이와 같은 형태의 html 소스 코드가 있다고 가정합니다. 사용자가 삭제 버튼을 누르면 지울 것인지 확인하는 메시지를 보여주고 확인 버튼을 누르면 해당 요소가 삭제되는 예제입니다.
#### index.html
```html
<ul>
  <li>
    <span>요소 1번</span>
    <button class="delete">삭제</button>
  </li>
</ul>
```

#### 1번 - 어제의 함수
```javascript
$('li').on('click', 'button.delete', function(e) {
  if (confirm('Are you sure?')) { // [1] 확인 창을 띄워 유저의 선택을 기다립니다. 그 결과에 따라 다음 코드를 실행합니다.
    $(e.delegateTarget).remove(); // [2] 클릭했던 버튼의 부모 엘리먼트를 제거합니다.
  }
})
```

`confirm` 함수는 사용자가 어떤 버튼을 누르는가에 따라 `true`, `false` 값을 반환합니다. 보통은 이에 따라 실행되어야할 함수를 조건문으로 분기를 쳐둡니다. 이러한 조건문을 포함한 하나의 `confirm` 함수를 만들어 보았습니다. (구분을 위해 오늘의 함수 앞에 `_`를 붙였습니다.)

#### 2번 - 오늘의 함수
```javascript
function _confirm(message, yes_fn, no_fn) {
  return confirm(message) ? yes_fn() : no_fn(); // [1] 분기를 함수 안으로 가져왔습니다.
}

$('li').on('click', 'button.delete', function(e) {
  _confirm('Are you sure?', function() { // [2] '확인'을 눌렀을 때 동작하게될 함수입니다.
    $(e.delegateTarget).remove();
  }, function() { return false; }) // [3] '취소'를 눌렀을 때 동작하게될 함수입니다.
})
```
