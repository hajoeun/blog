---
title: '오늘의 함수 - val'
date: 2018-02-24 20:16:00
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: val은 객체에서 원하는 값 하나만을 반환합니다.
slug: 'daily-fp-val'
---
_오늘 발견한 재미있는 함수를 소개합니다_

## [val](https://marpple.github.io/partial.js/docs/#val)

오늘은 짧막한 이름을 가진 `val` 함수를 소개합니다. val이라는 이름은 value의 약자입니다. 여기서 value(값)는 객체에서 프로퍼티의 값을 의미합니다. 오늘 글에서는 '값'이라고 표기하겠습니다. 이름이 유사한 함수로는 `values`가 있는데, 이 함수는 객체에 있는 모든 값을 반환하는 함수입니다. 반면 `val`은 원하는 값 하나만을 반환합니다.
(기능이 유사한 함수로 [underscore](http://underscorejs.org/#property)의 `_.property`, [ramdajs](http://ramdajs.com/docs/#path)의 `R.path`가 있지만 사용법이 조금 다릅니다.)

예제를 살펴보겠습니다.

#### (1) 어제의 함수

```javascript
let person = {
  name: 'Oliver Queen',
  status: 'alive',
  occupation: ['Mayor of Star City', 'Vigilante'],
  family: {
    father: {
      name: 'Robert Queen',
      status: 'deceased'
    },
    mother: {
      name: 'Moria Queen',
      status: 'deceased'
    },
    sister: {
      name: 'Thea Queen',
      status: 'alive'
    }
  }
}
```

여기 `person`이라는 한 인물의 [데이터](http://arrow.wikia.com/wiki/Oliver_Queen)가 있습니다. 여기서 우리가 원하는 값을 얻는 것은 전혀 어렵지 않습니다.

```javascript
console.log(person.name); // 'Oliver Queen'
console.log(person.occupation[0]); // 'Mayor of Star City'
console.log(person.family.sister.name); // 'Thea Queen'

console.log(person.family.brother.name);
// [에러] Uncaught TypeError: Cannot read property 'name' of undefined
```

`sister.name`까지는 쉽게 얻었지만 존재하지 않는 값인 `brother.name`을 얻으려고 하니 에러가 났습니다. 당연한 결과입니다. 하지만 개발하는 중에 위와 같은 경우는 흔한 경우입니다. 때문에 아래와 같은 코드로 에러를 방지합니다.

```javascript
console.log(
  person.family.brother && person.family.brother.name
); // undefined

console.log(
  person.family.brother ? person.family.brother.name : 'none'
); // 'none'
```

`family` 객체는 반드시 존재한다는 가정 아래에선 위와 같은 방법으로 처리가 가능하지만 `family`라는 객체마저 없을 수도 있다면 상황이 귀찮아집니다. 이때 필요한게 오늘의 함수 `val`입니다.


#### (2) 오늘의 함수

```javascript
console.log(val(person, 'name')); // 'Oliver Queen'
console.log(val(person, 'family.sister.name')); // 'Thea Queen'
console.log(val(person, 'family.brother.name')); // undefined
console.log(val(person, 'family.brother.name') || 'none'); // 'none'
```

`val`은 객체와 키(문자열)를 받습니다. 이때 키는 점(.) 연산자를 사용할 수 있습니다. `brother.name` 값을 얻으려 할때 `undefined`를 반환한 것으로 보아, 함수 내부에서 에러를 방지하고 있음을 알 수 있습니다. 내부 구현을 살펴보겠습니다.

```javascript
function val(obj, key) {
  let keys = key.split('.');
  let i = 0, len = keys.length;
  let res = obj[keys[i]];

  while (++i < len) {
    if (res === undefined) return;
    res = res[keys[i]];
  }
  return res;
}
```

`val` 함수는 객체(`obj`)와 키(`key`)를 받습니다. 여기서 문자열인 키는 곧장 `split`에 의해 배열로 쪼개집니다. `res`는 선언되면서 첫번째로 발견한 값을 담습니다. `keys`의 길이만큼 반복문을 수행합니다. 이때 `res`가 없다면 함수를 끝맺습니다. (아무런 값 없이 `return`하면 `undefined`가 반환됩니다.) 그렇지 않은 경우 다음 `res`를 찾습니다. 이를 반복한 뒤 최종 `res`를 반환합니다.

여기서 `obj[keys[i]]`와 같은 형태로 값을 찾기 때문에 배열을 접근하기 위해선 아래와 같이 해야합니다.

```javascript
console.log(val(person, 'occupation.0')); // 'Mayor of Star City'
```
