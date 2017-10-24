---
title: '[오늘의 함수] nest'
date: 2017-03-28 23:07:24
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## nest 함수

[`pick` 함수 편](http://joeun.me/2017/03/07/javascript-daily-function-1/)에서도 말씀드린 것처럼 자바스크립트에서 객체는 키(key)와 값(value)의 쌍입니다. 때론 값에 또 다시 객체를 담아 내부에 객체가 반복해서 등장하는 형태의 객체를 만들기도 합니다. 이런 객체를 중첩 객체(nested object)라고 부릅니다. 오늘은 이러한 중첩 객체를 만들어주는 함수를 소개드릴까합니다. 바로 `nest` 함수입니다.

#### (1) 어제의 함수
```javascript
  var nested_obj = {};
  nested_obj.first = {};
  nested_obj.first.second = {};
  nested_obj.first.second.third = "I'm nested object.";

  console.log(nested_obj.first.second.third); // "I'm nested object."
```

이처럼 중첩된 구조의 객체를 만들기 위해선 일일이 각 순서마다 객체를 생성해줘야하는 번거로운 작업이 수반됩니다. 하지만 `nest` 함수는 이를 한번에 만들어줍니다.

#### (2) 오늘의 함수 - 중첩 객체 만들기
```javascript
  var nest = function(key, value) {
    return key.split('.').reduceRight(valkey, value); // [1] 가장 끝의 인자를 먼저 생성하기 위해 reduceRight를 사용합니다.
  };

  function valkey(value, key) { // [2] 값과 키를 받아 객체를 만들어주는 함수입니다. (함수 이름은 value_and_key를 줄인 것입니다.)
    return { [key] : value }; // [3] ES6부터 지원하는 문법입니다. (Computed property names) 
  }
  
  var nested_obj = nest('first.second.third', "I'am nested object.");
  console.log(nested_obj.first.second.third); // "I'm nested object."
```