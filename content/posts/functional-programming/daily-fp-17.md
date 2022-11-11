---
title: '오늘의 함수 - lazys'
date: 2018-02-17 17:23:09
categories:
  - programming
tags:
  - JavaScript
  - 오늘의 함수
  - 함수형 프로그래밍
description: 지연 평가(Lazy Evaluation) 기법을 위한 함수들입니다.
slug: daily-fp-lazys
---
_오늘 발견한 재미있는 함수를 소개합니다_

## lazys

오늘은 명절을 맞아(?) `lazys` 함수 가족을 소개합니다. `lazys`라고 이름 붙인걸 보고 눈치채신 분들도 계실 것 같습니다. 바로 '지연 평가(Lazy Evaluation)' 기법을 위한 함수들입니다. 느긋한 계산법이라고 불리기도 하는 이 기법을 [위키피디아](https://ko.wikipedia.org/wiki/느긋한_계산법)에서는 __계산의 결과값이 필요할 때까지 계산을 늦추는 기법__이라고 설명합니다. 또 이러한 기법을 사용하면 __필요없는 계산을 하지 않으므로 실행을 더 빠르게__할 수 있다고 설명하는군요. 어떤 상황인지 직접 살펴보겠습니다.

(예제는 [함수형 JS 스터디 시즌2](https://github.com/hajoeun/functional-js-study2)의 [6주차 미션](https://github.com/hajoeun/functional-js-study2/issues/6)을 토대로 합니다. [partial.js](https://marpple.github.io/partial.js/)를 라이브러리로 사용합니다.)

#### (1) 어제의 함수

```javascript
var users = [
  { name: 'ID', age: 32, city: 'seoul', blood: 'A' },
  { name: 'BJ', age: 31, city: 'seoul', blood: 'O' },
  { name: 'JM', age: 32, city: 'busan', blood: 'O' },
  { name: 'PJ', age: 27, city: 'seongnam', blood: 'B' },
  { name: 'HA', age: 27, city: 'seoul', blood: 'O' },
  { name: 'JE', age: 27, city: 'seongnam', blood: 'O' },
  { name: 'JI', age: 32, city: 'incheon', blood: 'A' },
  { name: 'MP', age: 28, city: 'seoul', blood: 'O' },
  { name: 'JY', age: 31, city: 'seoul', blood: 'O' },
  { name: 'TH', age: 27, city: 'busan', blood: 'AB' },
  { name: 'DS', age: 33, city: 'incheon', blood: 'O' },
  { name: 'YJ', age: 24, city: 'busan', blood: 'O' },
  { name: 'MB', age: 37, city: 'incheon', blood: 'B' },
  { name: 'JJ', age: 29, city: 'busan', blood: 'A' },
  { name: 'TU', age: 21, city: 'seoul', blood: 'O' },
  { name: 'UB', age: 23, city: 'seongnam', blood: 'O' },
];
```

위의 `users`로 __부산 외에 거주하면서 혈액형이 O형인 나이가 가장 많은 세 사람의 이름__을 찾아내야 하는 상황입니다.

```javascript
_.go(users,
  _.sort_by(user => -user.age), // 나이가 많은 순서대로 정렬
  _.reject(user => user.city === 'busan'), // 부산 외에 거주하면서
  _.filter(user => user.blood === 'O'),  // 혈액형이 O형인
  _.map(user => user.name),  // 사람의 이름
  _.take(3), // 세개
  console.log); // ["DS", "BJ", "JY"]
```

익숙한 함수들로 원하는 값을 쉽게 얻어냈습니다. 낯설게 느껴지는 함수가 있다면 정렬을 위해 사용한 `_.sort_by`와 배열 중 앞의 데이터만 뽑아내는 `_.take` 함수입니다. 사용법은 그리 어렵지 않습니다. `_.sort_by`의 경우 보조함수의 리턴 값을 기준으로 오름차순으로 정렬합니다. (음수가 리턴 값이니 결과는 내림차순이겠죠.) `_.take`는 `_.first` 함수의 또 다른 별칭입니다. 두번째 인자에 숫자를 넣으면 그만큼의 길이를 갖는 배열을 리턴합니다. 예제에선 3명을 원했으니 `_.take(3)`으로 사용됐습니다. 두 함수 모두 커링을 지원합니다.

위와 같은 결과를 얻기 위해서 `_.reject`, `_.filter`, `_.map`은 위에서 내려주는 배열의 길이만큼 함수를 실행해서 조건을 검사하거나 값을 추출해야합니다. 그래서 총 36회의 함수 실행이 일어나죠.

```javascript
var count = 0;

_.go(users,
  _.sort_by(user => -user.age),
  _.reject(user => {
    count++;
    return user.city === 'busan'}),
  _.filter(user => {
    count++;
    return user.blood === 'O'}),
  _.map(user => {
    count++;
    return user.name}),
  _.take(3),
  console.log); // ["DS", "BJ", "JY"]

console.log(count); // 36
```

위의 예제처럼 얻길 원하는 값이 몇개 되지 않을 때, 나머지에 대해서도 함수가 계산(evaluation)되는 것은 낭비라고 생각하는게 지연 평가의 등장 배경입니다. __필요한 값들만 우선 계산하고 나머지는 계산을 지연시켜서 필요하지 않다면 계산하지 않도록 하는 기법__이 지연 평가인 것입니다. 그럼 지연평가가 적용되면 어떻게 결과가 달라질까요?

#### (2) 오늘의 함수
```javascript
var count = 0;

_.go(users,
  _.sort_by(user => -user.age),
  lazys.reject(user => {
    count++;
    return user.city === 'busan'}),
  lazys.filter(user => {
    count++;
    return user.blood === 'O'}),
  lazys.map(user => {
    count++;
    return user.name}),
  lazys.take(3),
  console.log); // ["DS", "BJ", "JY"]

console.log(count); // 16
```

`lazys`라는 네임스페이스를 갖는 함수로 기존의 함수를 대체했습니다. (`_.sort_by`는 지연 평가 함수에 포함되지 않습니다.) 함수 실행 회수를 보니 16회 입니다. 같은 결과를 만들었음에도 20회나 적게 실행된 것입니다. 어떻게 구현되었기에 이와 같은 결과를 만들어내는지 살펴보겠습니다. 먼저 `map`, `filter`, `reject`의 구현입니다.

```javascript
let lazys = {}; // 네임스페이스 정의
function make_lazy(...fns) { // [1]
  return list => { // [2]
    if (list.is_lazy) return list.push(fns), list; // [3]
    let lazy = [fns]; // [4]
    lazy.data = list; // [5]
    lazy.is_lazy = true; // [6]
    return lazy; // [7]
  }
}

lazys.map = fn => make_lazy(fn, _.map) // [8]
lazys.filter = fn => make_lazy(fn, _.filter)
lazys.reject = fn => make_lazy(fn, _.reject)
```

[1] `make_lazy` 함수는 `take`를 제외한 함수에서 사용하는 함수입니다. 이 함수는 `take`가 최종 계산에 사용할 `lazy`라는 배열을 만들어냅니다.
[2] `make_lazy` 함수가 리턴하는 함수는 `list`를 인자로 받습니다. 이 `list`는 예제로 따지자면 `users`에 해당합니다.
[3] 만약에 `list`가 `is_lazy`라는 값을 참으로 가지고 있다면, `list`에 처음에 받아둔 함수(`fns`)를 그대로 넣고 `list`를 리턴합니다. '`list`가 `is_lazy`라는 값을 참으로 가지고 있다'는 조건은 이 `list`가 `lazy`임을 의미합니다.
[4] 실제 `lazy`가 새로 생성되는 경우는 `users`와 같은 데이터가 들어왔을 경우입니다. 이때는 받아둔 함수(`fns`)를 배열로 감싸서 `lazy`를 생성합니다. 이 데이터는 이후 `take`에 의해 계산됩니다.
[5] 진짜로 가공해야할 데이터는 `lazy`에 붙여둡니다.
[6] `lazy`가 진짜 `lazy`임을 남겨둡니다. [3]에서 검사할 수 있었던 이유입니다.
[7] 완성된 `lazy`를 리턴합니다.
[8] `map`, `filter`, `reject`가 같은 방식으로 만들어집니다. 어떻게 논리를 전개할지 정해둔 보조 함수(`fn`)를 받고 `make_lazy`에게 첫번째 인자로 보조 함수, 두번째 인자로 보조 함수가 처리되어야할 논리를 담고 있는 모체가 되는 함수 전달합니다. 이 인자가 [1]에서 `fns`가 배열의 형태로 사용됩니다.

앞서 만들어진 세 함수는 `lazy`라는 데이터를 만들어 `take`에 전달하는 역할을 합니다. __함수를 평가(계산)하지 않습니다.__ 실제 평가는 결과값의 양을 알고 있는 `take` 함수의 몫입니다.

```javascript
lazys.take = limit => { // [10]
  return lazy => { // [11]
    let i = -1, ll = lazy.length, dl = lazy.data.length, res = [];
    while (++i < dl) { // [12]
      let j = 0,
      v = lazy.data[i], // [13-1]
      rev = lazy[j][1]([v], lazy[j][0])[0]; // [13-2]

      while (rev && ++j < ll) rev = lazy[j][1]([v], lazy[j][0])[0]; // [14]
      if (rev) {
        res.push(rev); // [15]
        if (res.length === limit) return res; // [16]
      }
    }
  }
}
```

[10] `limit`은 결과값의 양을 의미합니다. `lazy.take(3)`으로 호출된 오늘의 예제에서는 세개의 데이터가 채워지면 평가를 종료합니다.
[11] 앞선 함수들이 만들어낸 `lazy`를 인자로 받습니다.
[12] `lazt.data`에 붙어온 데이터의 길이만큼 반복합니다.
[13-1] `v`는 `lazt.data`에서 꺼낸 하나의 값입니다. `users` 데이터의 경우로 보자면 `i`가 0일때, `v`는 `{ name: 'ID', age: 32, city: 'seoul', blood: 'A' }`와 같습니다.
[13-2] `rev`는 [3]과 [4]에서 `lazy`로 추가된 함수들에 의해 평가된 결과값입니다. `users` 데이터의 경우로 보자면 `i`가 0일때, `_.reject([v], user => user.city === 'busan')`에 의해 평가되고 첫번째 인자를 꺼낸 결과인 `rev`는 `v`와 같은 값을 가진 상태가 됩니다.
[14] `rev`의 결과가 존재하고 `lazy`의 길이보다 적을 때까지 `lazy`의 함수들을 꺼내 평가합니다. `rev`로 반복의 여부를 검사함으로 불필요한 평가를 하지 않을 수 있습니다.
[15] 반복문 이후에도 `rev`가 값으로 존재한다면(`undefined`가 아니라면) 결과값 `res`에 넣습니다.
[16] `res`의 길이가 원하는만큼 채워지면 결과를 리턴합니다.
