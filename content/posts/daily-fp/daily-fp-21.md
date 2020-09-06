---
title: '오늘의 함수 - map'
date: 2018-05-20 20:00:00
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
description: map은 돌림직한 데이터형(collection)을 순회하면서 새로운 값으로 매핑(mapping)해서 새로운 배열을 반환합니다.
slug: daily-fp-map
---
_오늘 발견한 특별한 함수를 소개합니다_

## map

오늘은 조금 특별한 함수를 소개합니다. `map` 함수입니다. 사실 이 함수 자체가 특별한 것은 아닙니다. 이미 [pluck 함수](/programming/javascript-daily-function-19/)에서 등장한 적도 있고 함수형 프로그래밍에서 기본기처럼 사용되는 함수입니다. 오늘의 함수가 특별한 이유는 구현 방식 때문입니다. 한창 진행 중인 강의([프로그래머스에서 주최한 유인동님의 강의](https://programmers.co.kr/learn/courses/3409))에서 구현하는 방식으로 구현해볼까 합니다. 거기에 조금 더 응용을 해볼까 합니다. 우선 `map`이 필요한 상황과 사용 방법에 대해 살펴보겠습니다.


#### (1) 어제의 함수

```javascript
map(a => a + 10, [1, 2, 3, 4, 5]); // [11, 12, 13, 14, 15]
```

아시다시피 `map`은 돌림직한 데이터형(collection)을 순회하면서 새로운 값으로 매핑(mapping)해서 새로운 배열을 반환합니다. 위의 코드를 보시면 아시겠지만 기존에 구현하던 것과 차이가 있습니다. 배열보다 함수가 먼저 나옵니다. 이는 [Ramda.js의 사용법](https://ramdajs.com/docs/#map)과 같습니다.

기본적인 구현은 아래와 같이 할 수 있습니다.

```javascript
function map(f, coll) {
  let res = [];
  for (const x of coll) res.push(f(x));
  return res;
}
```

오늘의 구현은 조금 더 복잡합니다. 비동기 상황을 지원하는 `reduce`와 `then`함수 등을 활용해서 비동기 상황을 지원하는 `map`을 구현해보겠습니다. 기본적으로 사용될 `reduce`와 `then` 함수의 구현은 아래와 같습니다.

```javascript
// Promise가 주어지면 then 으로 풀어서 값을 전달하는 then 함수
const then = (f, x) => x instanceof Promise ? x.then(f) : f(x);

// then 함수를 활용해 비동기 상황을 지원하도록 만들어진 reduce 함수
function reduce(f, coll, acc) {
  return then(function(coll) {
    const iter = coll[Symbol.iterator]();
    return then(function recur(acc) {
      for (const x of iter)
        if ((acc = f(acc, x)) instanceof Promise) return acc.then(recur);
      return acc;
    }, acc === undefined ? iter.next().value : acc);
  }, coll);
}

// 아래와 같이 동작합니다.
reduce((a, b) => a + b, [1, 2, 3, 4, 5], 10); // 25

// 아래와 같은 비동기 상황을 지원합니다.
reduce((a, b) => a + b, Promise.resolve([1, 2, 3, 4, 5]), 10).then(console.log);
reduce((a, b) => a + b, [1, 2, 3, 4, 5], Promise.resolve(10)).then(console.log);
```

#### (2) 오늘의 함수

`reduce` 함수는 추상화 레벨이 높은 함수라서 콜렉션을 순회하는 대부분의 함수를 구현할 수 있습니다. 이러한 특징을 활용해서 `map`을 구현하겠습니다. 대략적인 골격은 아래와 같겠죠.

```javascript
const map = (f, coll) => {
  return reduce((res, x) => {
    res.push(f(x));
    return res;
  }, coll, [])
};
```

배열을 초기값으로 하는 `reduce`의 형태로 구현이 가능합니다. 축약하면 아래와 같습니다.

```javascript
const map = (f, coll) => reduce((res, x) => (res.push(f(x)), res), coll, []);
```

여기서 `push`라는 함수를 만들어볼 수 있겠습니다. `(res.push(f(x)), res)`와 같이 push 메서드를 실행하고 본체(배열)을 반환하는 함수입니다.

```javascript
const push = (arr, v) => (arr.push(v), arr);
const map = (f, coll) => reduce((res, x) => push(res, f(x)), coll, []);
```

그럼 테스트를 해보겠습니다.

```javascript
map(a => a + 10, [1, 2, 3, 4, 5]); // [11, 12, 13, 14, 15]
map(a => a + 10, Promise.resolve([1, 2, 3, 4, 5])).then(console.log); // [11, 12, 13, 14, 15]
// map(a => Promise.resolve(a + 10), [1, 2, 3, 4, 5]).then(console.log); // Uncaught TypeError: map(...).then is not a function
map(a => Promise.resolve(a + 10), [1, 2, 3, 4, 5]); // [Promise, Promise, Promise, Promise, Promise]
```

두가지 경우는 잘 통과했지만 마지막은 실패하는 모습을 보여줍니다. 생각해보면 미리 만들어둔 `reduce`는 인자로 전달되는 값(coll, acc)가 비동기인 경우만을 제어합니다. 함수가 만들어낸 값이 비동기일 경우를 제어하지 못하죠. 이제 `map`에도 `then`을 사용해야할 순간입니다. 함수에 적용한 결과가 Promise일지도 모른다는 가정으로 접근해야겠죠.

```javascript
const push = (arr, v) => (arr.push(v), arr);
const map = (f, coll) => reduce(
  (res, x) => then(v => push(res, v), f(x)), // <-- 여기가 포인트!
  coll, []);

map(a => Promise.resolve(a + 10), [1, 2, 3, 4, 5]).then(console.log); // [11, 12, 13, 14, 15]
```

이제 원하는대로 동작합니다. `f(x)`의 결과값을 `then` 함수의 두번째 인자로 전달하면 됩니다. 그리고 `push` 함수로 결과를 만들면 되죠. 이미 원하던 바는 이뤘습니다.

#### (3) 더보기

아래부터는 굳이 안해도 되는 구간입니다. 함수로 쪼개면 이렇게도 할 수 있음을 보여드리려고 합니다. 한번 막 만들어보겠습니다. 우선 `push` 함수를 고쳐보겠습니다.

```javascript
const push = arr => v => (arr.push(v), arr);
const map = (f, coll) => reduce(
  (res, x) => then(push(res), f(x)), // <-- 간결해진 함수
  coll, []);
```

`push` 함수를 함수를 반환하는 함수로 만들고 첫번째 함수에서 배열을 두번째 함수에서 값을 받는 함수로 만들면 `map` 내부에서 보다 간결하게 표현할 수 있습니다.

조금 더 간결한 표현을 위해 몇가지 함수의 도움을 받아야합니다. [`pipe`](/programming/javascript-daily-function-20/), `spread`가 필요합니다. 두 함수를 만들기 위해선 또 두개의 함수가 더 필요한데, 배열을 멀티 리턴 값으로 치환해주는 [`to_mr`](/programming/javascript-daily-function-14/)과 `go` 함수가 필요합니다. 이미 몇차례 소개해드린 적이 있어서 간단하게 구현만 살피겠습니다.

```javascript
// 배열을 받아 멀티 리턴 값으로 치환하는 to_mr 함수 (이전에 소개드린 방식과 구현이 다릅니다)
const to_mr = arr => ({ __mr: true, value: arr });

// 첫번째로는 함수를 받고 두번째로는 인자를 받아 순서대로 실행한 뒤 멀티 리턴으로 반환하는 spread 함수
const spread = (...fs) => (...args) => to_mr(fs.map((f, i) => f(args[i])));

// 시작값과 함수들을 받아 즉시 함수들을 실행하는 go 함수
const go = (x, ...fs) => reduce((res, f) => res.__mr ? f(...res.value) : f(res), fs, x);

// 함수들을 합성하는 pipe 함수
const pipe = (...fs) => (...args) => go(to_mr(args), ...fs);
```

위의 함수 중 두가지 함수 `spread`와 `pipe`를 사용하면 아래와 같이 간결한 `map`을 만들 수 있습니다.

```javascript
// const map = (f, coll) => reduce((res, x) => then(push(res), f(x)), coll, []); // 기존 구현
const map = (f, coll) => reduce(
  pipe(spread(push, f), then), // <-- 함수로 함수를 만들기!
  coll, []);
```

기존 구현에서 `(res, x) => then(push(res), f(x))` 이 부분을 가만 살펴보면 전달되는 인자의 순서와 `then`내부에 실행되는 함수가 필요로하는 인자의 순서가 같음을 알 수 있습니다. 이때 `spread`를 사용하면 좋겠다는 생각이 들죠. 사용할 함수를 미리 `spread`에 적용해두고 그 결과를 `then` 함수에 적용하기 위해선 `pipe` 함수가 필요한거죠. 결국 `spread` 함수의 최종 실행 결과는 `push(res), f(x)`과 같습니다. 이 결과가 `then`에 전달됩니다. 멀티 리턴을 지원하는 `pipe` 함수이기에 이와 같은 전개가 가능합니다.

여기에 덧해서 커링을 지원하는 `map`을 만들려면 `curry` 함수가 필요합니다.

```javascript
const curry = fn => (x, y) => y === undefined ? y => fn(x, y) : fn(x, y);
const map = curry((f, coll) => reduce(pipe(spread(push, f), then), coll, []));
```

인자가 하나만 들어오면 커링을 하고 그렇지 않으면 즉시 실행합니다. 이제 `go` 함수를 써서 보다 함수형스럽게(?) 표현할 수 있습니다.

```javascript
// map(a => Promise.resolve(a + 20), [1, 2, 3, 4, 5]).then(console.log);

go([1, 2, 3, 4, 5],
  map(a => Promise.resolve(a + 20)),
  console.log); // [11, 12, 13, 14, 15]
```
