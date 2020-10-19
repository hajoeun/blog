---
title: '오늘의 함수 - redirect'
date: 2017-03-02 15:11:12
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 서버로 데이터를 보내거나 요청할 때 별다른 문제 없이 통신에 성공한 이후에 특정 페이지로 이동하도록 조치하는 경우가 종종 있습니다.
slug: daily-fp-redirect
---
_오늘 발견한 재미있는 함수를 소개합니다_

## redirect 함수

서버로 데이터를 보내거나 요청할 때 __별다른 문제 없이 통신에 성공한 이후에 특정 페이지로 이동하도록 조치하는 경우__가 종종 있습니다. 아래의 1번 방법과 같이 `$.post`를 이용한다고 할때 일반적으로 콜백 함수를 작성해서 응답을 처리합니다.

#### 1번 - 어제의 함수
```javascript
var data = {title: 'hello', content: 'world!'};

$.post('/api/post/create', data)
  .done(function(res) { // [1] 통신에 의해 데이터가 성공적으로 전달되면 새로운 페이지로 이동하도록 콜백 함수를 정의했습니다.
    if (res) {
      return window.location.href = '/main/newsfeed';
    } else {
      console.error('return data:', res);
    }
  });
```

때론 위와 같은 동작이 ‘자주’ 일어납니다. 특정 페이지로 이동하기 전에 통신의 성공 여부를 확인하기만 하는 것인데 코드가 계속 반복될 생각을 하니 뭔가 괴롭습니다. 그래서 저는 아래와 같이 `redirect` 함수를 만들었습니다. 함수를 반환하는 고차함수입니다.

#### 2번 - 오늘의 함수
```javascript
var redirect = function(path) {
  return function(res) {
    if (res) {
      return window.location.href = path;
    } else {
      console.error('return data:', res);
    }
  }
};


var data = {title: 'hello', content: 'world!'};

$.post('/api/post/create', data)
  .done(redirect('/main/newsfeed')); // [1] URL을 인자로 전달해두면 어디로 이동할지 미리 정해둔 함수가 콜백 함수로 남게 됩니다.

$.post('/api/post/update', data)
  .done(redirect('/main/editor')); // [2] 이렇게 URL만 바꿔서 다른 통신에서도 재활용할 수 있는 함수가 되었습니다.

$.post('/api/post/delete', data)
  .done(redirect('/main/home'));
```
