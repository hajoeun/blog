---
title: '오늘의 함수 - pluck'
date: 2018-03-05 21:21:56
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: pluck는 배열 속 객체에서 원하는 값만 잡아 뜯는(뽑는) 함수입니다.
slug: daily-fp-pluck
---
_오늘 발견한 재미있는 함수를 소개합니다_

## [pluck](https://marpple.github.io/partial.js/docs/#pluck)

Pluck는 '뽑다'는 의미를 가지고 있습니다. 풀을 뽑을 때 'pluck grass'라고 합니다. '잡아 뜯다'는 느낌이 강합니다. 오늘 소개할 함수 `pluck`도 배열 속 객체에서 원하는 값만 잡아 뜯는(뽑는) 함수입니다. __배열이라는 땅에 자란 객체라는 풀 중에 뽑아야할 풀(객체)만 뽑아내는 함수__라고 생각하시면 편하겠습니다. 뽑아낸 결과가 다시 땅(배열)이라는게 좀 이상하긴 하네요.

예제를 살펴보겠습니다.

#### (1) 어제의 함수

```javascript
let queen_family = [
  { name: 'Oliver Queen', status: 'alive'},
  { name: 'Robert Queen', status: 'deceased' },
  { name: 'Moria Queen', status: 'deceased' },
  { name: 'Thea Queen', status: 'alive' }
];
```

[지난 시간](/programming/javascript-daily-function-18/)에 다뤘던 데이터에서 일부를 가져왔습니다. 가족 구성원의 정보(객체)가 담긴 배열입니다. 우리가 원하는건 가족 구성원의 이름이라고 가정하겠습니다. 가족 모두의 이름을 찾아 배열로 만드는 일은 간단합니다. `map` 함수를 사용하면 됩니다.

```javascript
let names = map(queen_family, person => person.name);
// queen_family.map(person => person.name)

console.log(names); // ["Oliver Queen", "Robert Queen", "Moria Queen", "Thea Queen"]
```

`map`을 사용하니 원하는 값을 쉽게 배열로 만들어주네요. 그런데 여기서 낯익은 구문이 나옵니다. 바로 `person => person.name` 이 함수입니다. [지난 시간](/programming/javascript-daily-function-18/)에 다룬 `val` 함수를 사용할 수 있을 것 같습니다.

```javascript
let names = map(queen_family, val('name'));

console.log(names); // ["Oliver Queen", "Robert Queen", "Moria Queen", "Thea Queen"]
```

오늘의 함수인 `pluck`는 `map`과 `val`함수가 함께 하는 일을 혼자서 해냅니다.


#### (2) 오늘의 함수

```javascript
let names = pluck(queen_family, 'name');

console.log(names); // ["Oliver Queen", "Robert Queen", "Moria Queen", "Thea Queen"]
```

훨씬 깔끔하네요. 그렇다면 `pluck`는 어떻게 구현할까요?

```javascript
const pluck = (arr, key) => map(arr, val(key));
```

장난인 듯 장난 아닌 멋진 구현입니다. 결국 `pluck`는 두 함수의 조합(합성)으로 만들 수 있는 함수입니다. 근사하지 않나요?
