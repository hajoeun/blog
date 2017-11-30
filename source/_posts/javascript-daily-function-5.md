---
title: '오늘의 함수 - pipe'
date: 2017-03-23 22:48:59
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## pipe 함수

미리 예고드린 것처럼 오늘은 `pipe` 함수를 소개해드리겠습니다. 우선 이 함수는 underscore의 `compose` 함수와 같은 일을 합니다. 복수의 함수를 합쳐 하나의 함수로 만드는 것입니다. 사용법에 있어서 조금 차이가 있는데, 그 부분은 생략하겠습니다. 우선 `pipe` 함수가 필요한 아주 간단한 상황을 살펴보겠습니다.

#### (1) 어제의 함수 - 함수의 연속 실행
```javascript
function add10(num) {
  return num + 10;
}

var result = add10(add10(add10(5))); // [1] add10 함수를 세번 실행합니다. 첫번째 인자는 5입니다.
console.log(result); // [2] 결과는 35가 나옵니다.
```

아주 간단한 예제입니다. `add10` 함수는 값이 들어오면 10을 더해서 반환합니다. [1] 에서 함수를 세번 실행하고 있습니다. 5에 10을 세번 더해 35라는 값을 반환합니다. 이 예제의 포인트는 __함수가 값으로 쓰인다는 점__입니다. 가장 좌측에 위치한 `add10` 함수는 인자로 함수 하나를 갖고 있고 인자인 그 함수가 또 함수를 인자로 갖고 있습니다. 이렇듯 인자로 함수를 중첩해서 넘깁니다. 허나 실제로 실행되는 순서, 논리를 읽어나가는 순서는 우측에서부터 시작합니다. 5를 인자로 받은 함수가 먼저 실행되고 그 결과를 자신을 감싸고 있던 함수에 전달하는 식으로 진행됩니다. 

이렇게 함수를 값으로 전달함으로써 함수를 연속적으로 실행해서 결과를 얻어낼 수도 있습니다. 이제 오늘의 주인공 `pipe` 함수를 만나보겠습니다.

#### (2) 오늘의 함수 - pipe 함수
```javascript
function pipe() {
  var funcs = Array.prototype.slice.apply(arguments); 
  // [1] 함수에 들어온 인자(함수)들의 모임인 arguments를 배열로 만들어줍니다. (원래 arguments는 유사 배열입니다.)

  return function(seed) {
    return funcs.reduce(function(value, func) { 
      // [2] reduce 함수를 사용해서 함수의 실행 결과를 하나로 합칩니다.
      return func(value);
    }, seed);
  };
}

var add30 = pipe(add10, add10, add10); 
// [3] pipe 함수를 이용해 add10 함수를 세번 연속 호출하는 함수를 만듭니다.

var result1 = add30(5); // [4] 만들어진 함수로 결과를 만듭니다.
var result2 = add30(13); // [5] pipe로 만들어진 함수는 재사용 가능합니다.

console.log(result1); // 35
console.log(result2); // 43
```
