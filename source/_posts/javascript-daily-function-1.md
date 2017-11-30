---
title: '오늘의 함수 - pick'
date: 2017-03-07 23:28:18
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## pick 함수

__자바스크립트에서 객체는 키(key)와 값(value)의 쌍으로 이루어져있습니다.__ 프로그래밍을 하는 과정에서 키를 기준으로 값을 객체로부터 꺼내는 일을 반복합니다. 많은 데이터를 가진 객체 하나에서 여러 개의 값을 꺼내오려면 어떻게 할까요?

#### 1번 - 어제의 함수
```javascript
var user_1 = { // [1] 기존의 데이터
  id: 1,
  first_name: 'Joeun',
  last_name: 'Ha',
  age: 28,
  country: 'South Korea',
  city: 'Seoul',
  mobile_phone: '010-0000-0000',
  email: 'imjoeunha@gmail.com',
  blog_url: 'http://joeun.me',
  };

var user_data = { // [2] 필요한 데이터
  id: user_1.id,
  first_name: user_1.first_name, 
  last_name: user_1.last_name
  };

$.post('/api/user_name/check', user_data)
  .done(redirect('/main')); // [3] '오늘의 함수 redirect' 편을 참고하세요.
```

위의 코드는 기존의 데이터를 가공해서 원하는 데이터만을 추려내서 특정 api로 전송하고 있습니다. 아래와 같은 `pick` 함수를 사용한다면 보다 쉽게 원하는 데이터를 추려낼 수 있습니다. [underscore.js](underscorejs.org)라는 라이브러리에서 볼 수 있는 함수입니다. 아래는 그보다 단순하게 구현되어 있습니다. 원본 객체와 함께 꺼내길 원하는 키 값을 배열로 전달하면 추려진 객체를 반환합니다.

#### 2번 - 오늘의 함수
```javascript
var user_1 = { // [1] 기존의 데이터
  id: 1,
  first_name: 'Joeun',
  last_name: 'Ha',
  age: 28,
  country: 'South Korea',
  city: 'Seoul',
  mobile_phone: '010-0000-0000',
  email: 'imjoeunha@gmail.com',
  blog_url: 'http://joeun.me',
  };

function pick(target, keys) {
  return keys.reduce(function(obj, key) {
    return obj[key] = target[key], obj;
  }, {});
}


console.log(pick(user_1, ['age', 'id'])); // [2] 출력 결과는 { age: 28, id: 1 } 입니다. 이때, 객체 값의 순서가 배열로 전달한 키의 순서대로 반환됩니다.

$.post('/api/user_name/check', pick(user_1, ['id', 'first_name', 'last_name'])) // [3] 간편하게 반복해서 원하는 객체를 만들 수 있습니다.
  .done(redirect('/main')); 

$.post('/api/city/check', pick(user_1, ['id', 'city']))
  .done(redirect('/main'));
```