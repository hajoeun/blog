---
title: '[함수형 자바스크립트] 고차 함수와 커링(currying)'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - 고차 함수
  - higher-order function
  - currying
  - 커링
  - partial.js
  - 함수형 프로그래밍
  - 함수형 자바스크립트
date: 2017-10-18 18:49:54
---
## 고차 함수와 커링(currying)
함수형 프로그래밍의 꽃인 고차 함수 개념과 커링에 대해서 이야기 해보자.
(모든 예제는 웹 브라우저의 '검사' 도구를 열어서 테스트할 수 있다.)

### 보조 함수의 활용
##### 1. 고차 함수란?
고차 함수는 __값으로 다룰 수 있는 함수__다. 함수를 값으로 다룰 수 있기 때문에 __함수를 인자로 사용__할 수도 있고 함수를 __리턴값으로 사용__할 수도 있다. 이러한 특징을 잘 보여주는 예제가 [지난 시간](http://joeun.me/2017/10/17/functional-js-study/) 살펴본 함수들이 가진 보조함수들이다. `_each`를 다시 한번 살펴보자.

```javascript
_each([1,2,3,4,5], num => console.log(num)); // _each 함수에 두번째 인자로 함수가 사용된다.
```

화살표 함수로 정의된 `num => console.log(num)`가 `_each` 함수의 인자로 전달되고 이는 보조함수의 역할을 한다. 인자로 함수를 넘겨서 어떤 일을 수행해야하는지를 전달한다면 함수의 추상화 레벨이 올라간다. `_each`의 경우 반복적으로 동일한 일을 처리하는 경우를 추상화해두고 그 일이 어떤 일인지는 개발자가 함수를 호출하는 시기에 결정할 수 있도록 위임한 것이다. 

```javascript
var persons = [
  { name: 'JE', age: 27 }, 
  { name: 'SJ', age: 34 },
  { name: 'HR', age: 38 },
  { name: 'YS', age: 27 }
];
var YB = _filter(persons, person => person.age < 30);
console.log(YB); // [{ name: 'JE', age: 27 }, { name: 'YS', age: 27 }]
```

`_filter` 함수는 어떤 조건에 따라 원하는 데이터를 골라내는 함수다. 위의 예제는 30세 미만의 사람만 골라냈다. 고차 함수인 `person => person.age < 30` 함수를 어떤 조건을 정의해 전달함으로써 추상화된 `_filter` 라는 함수를 사용할 수 있었다.


##### 2. callback, iteratee, predicate의 차이
지난 시간에 확인한 것처럼 `_each` 함수의 내부에서는 두번째 인자로 전달되는 보조함수를 `iter`라고 정의하고 있는데 이는 'iteratee'의 준말이다. 반복되는 함수라는 뜻이다. `_filter` 함수는 같은 함수를 `predi`라고 정의하고 있다. 술부라는 의미를 가진 'predicate'의 준말이다. 결과값이 어떠해야 하는지 정의하고 있는 함수이기 때문이다. 
보조함수 중에서 잘 알려진 함수는 'callback' 함수다. 유명세 때문인지 '보조함수(고차함수) === 콜백함수'라고 생각하는 경우도 있다. 하지만 보조함수가 가지는 이름 callback, iteratee, predicate는 그 함수가 하는 역할에 따라 지어진 이름일 뿐이다. callback 함수가 '회신'이라는 의미를 가지고 비동기 상황이 끝난 뒤에 어떠한 일을 할지 정의하는 함수인 것처럼 다른 보조함수들도 그에 맞는 이름을 갖는 것이다. 


지금까지 인자로 사용하는 함수인 보조함수를 통해 고차 함수를 알아봤다. 그렇다면 리턴값으로 사용되는 고차 함수는 어떤 경우가 있을까? 커링(currying)을 통해 그 예를 살펴보자.

### 고차 함수의 응용
##### 0. 커링이란?
수학자 Haskell Curry의 이름을 딴 이 기법은 __함수가 함수를 만드는 기법__이다. 함수로 함수를 만들기 위해선 결과값으로 함수를 전달할 수 있어야한다. 이 지점에서 리턴값으로 사용할 수 있는 고차 함수가 등장한다. 

```javascript
function add(a) {
  return function(b) {
    return a + b;
  }
}
```
커링을 이야기할때 가장 자주 등장하는 형태의 함수다. 이 함수 `add`는 인자 `a`를 받고 익명 함수를 리턴한다. 리턴된 익명 함수는 `b`를 받고 `a`와 `b`를 더한 값을 리턴한다. 리턴되는 익명 함수는 `a`에 대해 알고 있는 클로저다. 때문에 이후에 들어오는 값인 `b`와 `a`를 이용해 어떠한 일을 할 수 있는 함수가 된다. 

`add` 함수는 이렇게 사용할 수 있다.
```javascript
var add10 = add(10); // <-- 함수를 리턴했다.
console.log(add10(11)); // 21
console.log(add10(21)); // 31
```

`10`이라는 값을 알고 있는 익명 함수가 `add10`이라는 변수에 담긴다. 클로저인 익명 함수가 `add10`이라는 이름을 갖게된 것이다. 새로운 이름을 가진 이 함수가 실행되면 자신이 알고 있는 `10`과 새로 받는 값을 모두 이용할 수 있다. 최초의 `add` 함수 정의에서 두 값을 더하는 것으로 정했기 때문에 이후에 들어온 값 `11`이나 `21`을 `10`과 더하는 일을 수행한다. 

`add` 함수를 정의할 때 화살표 함수를 사용하면 조금 더 근사하다.

```javascript
var add = a => b => a + b;
```

이러한 형태의 함수는 미리 정의된 일 밖에 할 수 없으니 아쉽다. 커링하는 일 자체를 추상화하는 새로운 함수를 만들어보자.

##### 1. curry 함수
```javascript
function _curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    }
  }
}
// var _curry = a => b => fn(a, b);
```

함수가 익명 함수를 리턴했는데 그 함수가 다시 함수를 리턴한다. 복잡한것처럼 보이지만 단순하다. 천천히 살펴보자. 

우선 `_curry`는 함수를 인자로 받는다. 이때 받은 함수를 커링이 되는 함수로 만드는 것이 `_curry` 함수의 목표다. 목표를 달성하기 위해 다짜고짜 첫번째 익명 함수를 리턴한다. 첫번째 익명 함수는 `fn`이 사용할 첫번째 인자를 받는 함수다. `a`를 받은 뒤에 다시 한번 더 익명 함수를 리턴한다. 두번째 익명 함수다. 두번째 함수는 `fn`에게 필요한 두번째 인자를 받고 `fn`을 실행한다. 그 결과를 리턴한다. 글로만 읽으면 어떻게 동작하는지 이해하기 어렵다. 예제를 보자.

```javascript
var add = _curry((a, b) => a + b); // <-- 첫번째 함수를 리턴했다.

var add10 = add(10); // <-- 두번째 함수를 리턴했다.
console.log(add10(11)); // 21
console.log(add10(21)); // 31
```

커링하는 일을 추상화 해둔 `_curry`라는 함수를 사용했다. 덕분에 어떤 일을 할지 `_curry`에 함수에 전달하는 것만으로 커링이 가능한 함수를 만들 수 있게 되었다. 다른 함수도 쉽게 만들 수 있다.

```javascript
var sum = _curry((a, b) => a - b);
var sum10 = sum(10);

console.log(sum10(5)); // 5
```

이처럼 `_curry` 함수를 이용해서 사칙 연산 함수들을 커링이 가능한 함수로 만들 수 있다. 그런데 가만 생각해보면 좀 이상하다 `sum10`이라는 이름을 생각해보자. __10을 뺄 준비가 된 함수__여야할 것 같은데 반대가 되어버린다. (이 대목에서 이상하다고 생각하지 않아도 괜찮다.) `_curryr`이라는 함수를 만들어서 덜 이상하게 순서를 바꿔보자. 

```javascript
var _curryr = a => b => fn(b, a);

var sum = _curryr((a, b) => a - b);
var sum10 = sum(10);

console.log(sum10(5)); // -5
```

`_curryr`을 구현하기 위해선 인자 `fn`의 인자 순서를 뒤집어주면(reverse) 된다. 이제 `sum10`은 __10을 뺄 준비가 된 함수__가 됐다. 어떤 수가 들어오건 10을 뺀다. 이 상태가 되면 이제 지난 시간에 만들어둔 함수들을 발전시킬 수 있다.

```javascript
// 커링 적용 전
_go([1,2,3,4,5,6,7,8,9,10],
  arr => _filter(arr, num => num % 2), // <-- 함수로 한번 감싸서 실행시킨다.
  arr => _each(arr, num => console.log(num))); // <-- 코드가 복잡하다.

_filter = _curryr(_filter);
_each = _curryr(_each);

// 커링 적용 후
_go([1,2,3,4,5,6,7,8,9,10],
  _filter(num => num % 2), // <-- 어떤 일을 해야하는지 알고 있는 함수가 이 자리에 리턴된다.
  _each(num => console.log(num))); // <-- 코드가 간결하다.
```

커링이 적용된 발전된 함수는 `_go` 함수 안에서 보다 간결하게 의미를 전달 수 있는 코드가 되었다. `_filter`와 `_each`가 보조함수를 기억한 함수를 리턴한 뒤에 `_go`가 실행되면 `_go`는 첫번째 인자인 배열을 `_filter`와 `_each`가 남긴 함수에게 전달해서 각각의 일을 수행하도록 한다. 커링으로 간결하고 읽기 좋은 코드가 되었다. 

하지만 이 코드에서도 문제가 남아있다. 바로 커링이 적용된 함수들을 원래 방법대로 사용할 수 없다는 점이다. 지금 상황에서는 `_filter`에 인자를 동시에 두개를 넘겨도 함수를 리턴할 것이다. 약간의 수정이 필요하다.

```javascript
function _curryr(fn) {
  return function(a, b) {
    return !b ? function(b) {
      return fn(b, a);
    } : fn(a, b);
  }
}
// var _curryr = fn => (a, b) => (!b ? b => fn(b, a) : fn(a, b))
```

첫번째 익명 함수에 인자가 하나만 들어왔다면 커링을 적용한 함수를 리턴하고 그렇지 않다면 그냥 원래 방법대로 함수를 실행핟 결과를 리턴하도록 바꿔주면 모든 문제가 해결된다. 물론 인자를 두개 받지 못한다는 단점은 여전히 존재한다. 이 문제는 다음 시간에 해결할 계획이다.

##### 2. `_pipe` 함수 만들기
`_pipe` 함수는 함수를 조합하는 함수다. 여러 개의 함수가 조합된 새로운 함수를 만들기 위해 사용한다. 이런 식으로 사용할 것이다.
```javascript
var odd_sum = _pipe(_filter(n => n % 2), _reduce((t, n) => t + n));

_go([1,2,3,4,5,6,7],
  odd_sum,
  console.log); // 16
```

`_filter`와 `_reduce`를 조합해서 홀수값의 총합을 만드는 함수를 만들었다. 이 함수는 어떤 배열이 들어와도 홀수값의 합을 반환하는 함수가 된다. 이처럼 반복적으로 사용될만한 함수 조합을 `_pipe`로 묶어서 정의해두면 함수의 활용성이 좋아진다. 

끝으로 어떻게 구현하는지 살펴보자. 아래와 같이 `_go`를 사용하면 쉽게 구현할 수 있다.
```javascript
var slice = Array.prototype.slice;
function _pipe() {
  var fns = slice.call(arguments)
  return function(seed) {
    return _go.apply(null, [seed, ...fns]);
  }
}
```

---

### 전체 스터디 일정
  ##### 1주차 | [기본 함수 구현하고 사용하기](http://joeun.me/2017/10/17/functional-js-study/)
  ##### 2주차 | 고차 함수와 커링(currying)
  ##### 3주차 | [함수형 자바스크립트 라이브러리](http://joeun.me/2017/10/19/functional-js-study-2/)
  ##### 4주차 | [Movie Box 1 - 필터링, 정렬](http://joeun.me/2017/10/23/functional-js-study-3/)
  ##### _5주차 | Movie Box 2 - 필터링, 정렬 복습_
  ##### _6주차 | Movie Box 3 - 지연평가 L, memoize_
  ##### _7주차 | Movie Box 4 - 비동기 상황 다루기_

[예제 코드](https://github.com/joeunha/functional-js-study/tree/master/02_week)

<script src="https://rawgit.com/joeunha/functional-js-study/master/02_week/functional.js"></script>
