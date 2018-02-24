---
title: '오늘의 함수 - memoize'
date: 2018-02-12 22:56:22
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## memoize

오늘은 `memoize` 함수를 소개합니다. 이 함수는 '메모이즈' 함수라고 읽는데 이는 메모이제이션(memoization)이라는 기술을 구현한 함수이기 때문입니다. 기술을 구현했다고 표현하니 어렵게 보이기도 하고 멋져보입니다. 여기서 말하는 기술이라고 표현한 메모이제이션을 [위키피디아](https://ko.wikipedia.org/wiki/메모이제이션)에서는 __컴퓨터 프로그램이 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거하여 프로그램 실행 속도를 빠르게 하는 기술__이라고 설명합니다. 어떤 경우를 말하는 것이고 또 어떻게 구현하는지 살펴보겠습니다.

#### (1) 어제의 함수

```javascript
const arr1 = [1,2,3,4,5], arr2 = [6,7,8,9,10];
function sum(arr) { 
  console.log("SUM!")
  return arr.reduce((sum, num) => sum + num); 
}

console.log(sum(arr1)); // "SUM!" 15
console.log(sum(arr2)); // "SUM!" 40
```

`sum`은 배열을 받아서 값을 모두 더하는 함수입니다. 내부에는 로그 함수가 있어서 결과를 리턴하기 전에 "SUM!"이라는 문자열을 출력합니다. 이 문자열은 실제로 `sum` 함수가 호출되었는지 확인해주는 역할을 합니다.

```javascript
console.log(sum(arr1)); // "SUM!" 15
console.log(sum(arr2)); // "SUM!" 40

console.log(sum(arr1)); // "SUM!" 15
console.log(sum(arr2)); // "SUM!" 40

console.log(sum(arr1)); // "SUM!" 15
console.log(sum(arr2)); // "SUM!" 40
```

이미 실행 결과를 알고 있는 `arr1`, `arr2`를 몇번씩 넣어도 "SUM!"은 출력됩니다. 이 지점이 위키피디아에서 정의한 __'컴퓨터 프로그램이 동일한 계산을 반복해야 할 때'__입니다.


#### (2) 오늘의 함수
이제 __'이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거'__하는 작업을 해보겠습니다. 우선 메모리에 계산한 값을 저장해야겠지요.

```javascript
var cache = {}; // [1] 계산된 값을 저장해둘 객체(캐시)
function sum2(arr) { 
  if (cache[arr]) return cache[arr]; // [2] 저장된 값이 있으면 저장된 값을 리턴한다.
  console.log("SUM!");
  return cache[arr] = arr.reduce((sum, num) => sum + num); // [3] 없다면 값을 저장하고 결과를 리턴한다.
}

console.log(sum2(arr1)); // "SUM!" 15
console.log(sum2(arr2)); // "SUM!" 40

console.log(sum2(arr1)); // 15
console.log(sum2(arr2)); // 40
```

개선된 `sum2` 함수는 `cache`라고 이름 붙여진 객체에 계산된 값을 저장함으로써 동일한 계산을 반복하지 않도록 했습니다. 덕분에 같은 값을 넣어 함수를 실행하니 "SUM!"이 출력되지 않게 되었습니다. __'반복 수행을 제거'__하는 목적을 달성했지만 `cache`의 선언 방식이나 `sum2`의 구현이 그리 근사하지 않습니다. 이제 `memoize`를 사용해보겠습니다. 

```javascript
var sum = memoize(function(arr) { 
  console.log("SUM!")
  return arr.reduce((sum, num) => sum + num); 
}, function(key) { return key; });

console.log(sum(arr1)); // "SUM!" 15
console.log(sum(arr2)); // "SUM!" 40

console.log(sum(arr1)); // 15
console.log(sum(arr2)); // 40
```

우리가 원하는 모습입니다. `sum`의 구현인 익명 함수를 `memoize`로 한번 실행시켜 만든 `sum`은 `sum2`와 같이 반복되는 작업을 하지 않습니다. 더군다나 `cache`를 선언하지도 않았습니다. 그럼 어떻게 계산된 값을 저장할까요? 이제 `memoize`의 구현을 살펴볼 시간이네요.

```javascript
function memoize(func, hasher) { // [1]
  function f(...args) { // [2]
    var key = hasher(...args); // [3]
    if (f.cache[key]) return f.cache[key]; // [4]
    return f.cache[key] = func(...args);
  }
  f.cache = {}; // [5]
  return f;
}
```

짧은 코드지만 알찬 코드입니다. 한줄씩 살펴보겠습니다. 
[1] `memoize`는 두개의 함수를 인자로 받습니다. 실제 로직을 담고 있는 `func`와 메모리의 키 값을 만들어낼 `hasher`가 있습니다. 
[2] `f`라고 정의된 함수는 이 함수의 최종 리턴 값입니다. 여기서 받는 `...args`는 `sum`의 경우를 놓고보자면 `arr1`가 됩니다.
[3] `hasher`는 `f`가 받은 값을 그대로 사용해서 `key`에 해당하는 값을 만들어냅니다. 이 값은 들어온 `args`에 따라 달라지겠죠. 이를 완전히 유니크한 키로 만드는 것은 `hasher` 함수를 잘 정의하는데 달려있습니다.
[4] 만약에 캐시(`f.cache`)에 이미 저장된 값이 있으면 저장된 값을 리턴합니다. 그렇지 않으면 `func`의 실행 결과를 저장하고 그 값을 리턴합니다.
[5] 캐시는 함수에 붙어서 리턴됩니다. 앞선 예제의 경우를 생각하면 `sum`에 붙어 있게됩니다. 때문에 원한다면 캐시를 비울 수도 있게 됩니다.

짧은 코드에 적은 데이터를 사용하는 함수이기 때문에 예제만으로 __'프로그램 실행 속도를 빠르게'__했다고 보긴 어렵습니다. 하지만 같은 방식으로 더 큰 데이터를 다루는 코드에서 사용한다면 그 차이를 확연하게 느끼실 수 있습니다.
