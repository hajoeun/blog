---
title: 오늘의 함수 (1)
date: 2017-03-02 23:21:36
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 오늘의함수
---
_오늘 발견한 재미있는 함수를 소개합니다_


### 리다이렉트 함수
서버로 데이터를 보내거나 요청할 때 별다른 문제 없이 통신에 성공한 이후에 특정 페이지로 이동하도록 조치하는 경우가 자주 있습니다. 아래의 1번 방법과 같이 `$.post`를 이용한다고 할때 일반적으로 콜백 함수를 작성해서 응답을 처리합니다. 

#### 1번 - 어제의 함수
```javascript
var data = {title: 'hello', content: 'world!'};

$.post('/api/post/create', data, function(res) {
  if (res) {
    return window.location.href = '/main/newsfeed';
  } else {
    console.error('return data:', res);
  } 
});
```

때론 위와 같은 동작이 '자주' 일어납니다. 특정 페이지로 이동하기 전에 통신의 성공 여부를 확인하기만 하는 것인데 코드가 계속 반복될 생각을 하니 뭔가 괴롭습니다. 그래서 저는 아래와 같이 `redirect` 함수를 만들었습니다. 함수를 반환하는 고차함수입니다. 

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

$.post('/api/post/create', data, redirect('/main/newsfeed')); 
$.post('/api/post/update', data, redirect('/main/editor')); // 다른 통신에서도 재활용할 수 있는 함수가 되었습니다.
$.post('/api/post/delete', data, redirect('/main/home'));
```