---
title: '[오늘의 함수] redirect2'
date: 2017-03-09 20:36:40
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## redirect2 함수 

첫번째로 소개해드렸던 `redirect` 함수의 개량된 버전을 소개합니다. 기존의 함수는 단지 새로운 경로로 이동해주는 역할만을 했습니다. 하지만 __때론 URL이 유연하게 결정되어야할 필요가 있습니다.__ `post`방식이 아닌 `get`방식으로 서버와 통신해야할 경우가 있기 때문입니다.

오늘의 예제는 `post`로 가져온 데이터의 아이디 값에 따라 `get`방식으로 다른 페이지를 로드(load) 해야하는 경우를 가정했습니다.

#### 1번 - 어제의 함수
```javascript
var redirect1 = function(path) {
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
  .done(function(res) { // [1] URL에 query string을 붙여주기 위해 함수를 새로 열었습니다.
    redirect1('/main/newsfeed?id=' + res.id); 
  }); 
```

사실 위의 함수도 그리 나쁘지 않습니다. 단지 한줄이 늘었을 뿐이니까요. 그래도 저는 조금 더 단순하게 함수 하나만 넣고 끝내고 싶습니다.

#### 2번 - 오늘의 함수
```javascript
var redirect2 = function(path, query) { // [1] query라는 새로운 argument를 만들어 둡니다.
  return function(res) {
    if (res) {
      return window.location.href = query ? path + res[query] : path; // [2] query가 존재하면 get 방식으로 URL 지정합니다.
    } else {
      console.error('return data:', res);
    } 
  }
};


var data = {title: 'hello', content: 'world!'};

$.post('/api/post/create', data)
  .done(redirect2('/main/newsfeed?id=', 'id')); // [3] 두번째 매개변수에 데이터에서 어떤 값을 사용하고 싶은지 키 값을 적어줍니다. 

$.post('/api/post/update', data)
  .done(redirect2('/main/editor?no=', 'no'));

$.post('/api/post/delete', data)
  .done(redirect2('/main/home')); // [4] 하나의 매개변수를 보내면 redirect1과 동일하게 동작합니다.
```