---
title: '오늘의 함수 - redirect3'
date: 2017-11-28 17:59:00
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 검색, 필터링, 정렬한 페이지를 다시 로드하는 `redirect3` 함수의 사용 패턴을 살펴보겠습니다.
slug: 'daily-fp-redirect3'
---
_오늘 발견한 재미있는 함수를 소개합니다_

## redirect3

같은 함수를 세번째 다룹니다. 오늘은 함수 구현 방법에 대한 이야기 뿐만 아니라 검색, 필터링, 정렬한 페이지를 다시 로드하는 `redirect3` 함수의 사용 패턴을 살펴보겠습니다. (본문에서 [Partial.js](https://github.com/marpple/partial.js)가 제공하는 함수를 사용했습니다.)

#### (1) 어제의 함수
[이전에 만들었던 `redirect2` 함수](/programming/javascript-daily-function-2/)는 쿼리문을 포함하는 URL인 경우를 구분하기 위해 새로운 인자를 부여했습니다.

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
$.post('/api/post/create', data).done(redirect2('/main/newsfeed?id=', 'id')); // [3] id라는 문자열을 키로 갖는 값을 찾아서 리다이렉트 합니다.
```

위와 같은 방법은 하나의 쿼리만을 날릴 수 있습니다. 물론 배열을 받도록 코드를 변경해서 보다 나은 형태로 개선할 여지는 있습니다. 하지만 더 좋은 방법도 있습니다. URL만으로 쿼리가 포함될 것인지 구분하면 됩니다.

#### (2) 오늘의 함수
URL에 문자열 '?'가 포함된 경우에 이후에 들어오는 객체가 쿼리 데이터라고 가정하는 것입니다. 물음표가 있다면 URL에 퀴리를 붙여서 리다이렉트하고 그렇지 않으면 그냥 리다이렉트하면 됩니다.

```javascript
var redirect3 = function(path) { // [1] query를 받지 않아도 됩니다.
  return function(res) {
    if (res) {
      return window.location.href = /\?$/.test(path) ? // [2-1] 물음표가 존재하면
      _.reduce(res, function(m, v, k) { return v ? m += '&'+k+'='+v : m }, path) // [2-2] 쿼리문을 생성합니다.
      : path;
    } else {
      console.error('return data:', res);
    }
  }
};
```

이 함수는 검색, 정렬, 필터링이 필요한 경우에 그 힘을 발휘합니다. 유저가 검색어를 넣고 이후에 추가로 필터링과 정렬 작업을 한다고 가정해보겠습니다. URL에 검색어를 포함해서 쿼리를 날리고 다시 필터링의 기준을 포함해서 쿼리를 날리고 또 다시 정렬의 기준을 포함해서 쿼리를 날려야하는 상황입니다. 쿼리가 누적되는 상황입니다. 쉽게 접근할 수 있는 방법은 `window.location.search`에 있는 문자열을 저장해두고 거기에 추가로 쿼리를 붙여서 날리는 방법입니다. 허나 몇가지 동작에서 정상 작동하겠지만 기존에 있던 필터를 제거하고 다시 쿼리를 날려야하는 경우에 복잡한 문제가 생길 수 있습니다. 이전 쿼리에 포함된 문자열을 조사해서 필요 없는 문자열을 제거하는 작업이 필요할겁니다. 이러한 상황을 타개할 함수가 `redirect3` 함수입니다. 물론 함수 하나로 모든걸 할 수는 없습니다.

```javascript
var parse_query_obj = _.if(__( // [1] 만약에 데이터가 있다면 아래의 코드를 실행합니다.
  str => str.slice(1).split('&'),
  _.compact, // [2] 빈 문자열은 제외합니다.
  _.reduce(function(obj, str) {
    var arr = str.split('='); // [3] 등호를 기준으로 앞에는 키 뒤에는 값입니다.
    obj[arr[0]] = arr[1];
    return obj;
  }, {})))
  .else(_.always({})); // [4] 만약에 데이터가 없다면 빈 객체를 반환합니다.
```

위의 함수는 `window.location.search` 문자열을 받아서 쿼리가 있으면 쿼리 객체를 만들어 반환하는 함수입니다. 이 함수 덕분에 `redirect3` 함수를 유용하게 사용할 수 있습니다. 이제 유저가 정렬이나 필터등을 요구하면 `parse_query_obj`가 만들어낸 객체를 수정해서 `redirect3` 함수에게 전달하면 됩니다. 객체를 수정하는 함수가 하나 더 있으면 좋겠습니다.

```javascript
var make_query_obj = _.go(
  window.location.search, // [1-1] 쿼리문을 사용해서
  parse_query_obj, // [1-2] 쿼리 객체를 만듭니다.
  function(query_obj) {
    return function(key, value) { // [2] query_obj를 기억하는 함수(클로저)를 반환합니다.
      query_obj[key] = value;
      return query_obj;
    }
  });
```

이제 준비가 되었습니다. 유저가 검색을 요구하면 검색어와 키를 `make_query_obj`에 넣어주면 됩니다. 그 후에 `redirect3` 함수를 호출하면 끝입니다.

```javascript
// click, change 이벤트의 함수
function(e) {
  var current_target = e.currentTarget; // [1] 엘리먼트(current_target)의 id가 키, value가 값이라고 가정하겠습니다.
  var query_obj = make_query_obj(current_target.id, current_target.value);
  redirect3('/search/?')(query_obj); // [2] 즉시 리다이렉트 됩니다.
}
```
