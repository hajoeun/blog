---
title: '[스터디] 함수형 자바스크립트'
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 스터디
  - Functional Programming
date: 2017-10-17 15:36:32
---
_함수형 자바스크립트 스터디 정리_


### 전체 스터디 일정
  1. [기본 함수 구현하고 사용하기](http://joeun.me/2017/10/17/functional-js-study/) [Source](https://github.com/joeunha/functional-js-study/tree/master/01_week)
  2. 커링과 Partial.js 간단 소개 [Source](https://github.com/joeunha/functional-js-study/tree/master/02_week)
  3. jQuery vs Don.js [Source](https://github.com/joeunha/functional-js-study/tree/master/03_week)
  4. Movie Box 1 - 필터링, 정렬 [Source](https://github.com/joeunha/functional-js-study/tree/master/04_week)
  5. Movie Box 2 - 필터링, 정렬 복습 [Source](https://github.com/joeunha/functional-js-study/tree/master/05_week)
  6. Movie Box 3 - 지연평가 L, memoize [Source](https://github.com/joeunha/functional-js-study/tree/master/06_week)
  7. Movie Box 4 - 비동기 상황 다루기 [Source](https://github.com/joeunha/functional-js-study/tree/master/07_week)

---

## 기본 함수 구현하고 사용하기
함수형 프로그래밍에서 사용되는 기본 함수인 `each`, `map`, `filter`, `reduce` 함수와 함수를 실행하는 함수인 `go` 함수를 사용해보고 직접 구현해보자.
(모든 예제는 웹 브라우저의 '검사' 도구를 열어서 테스트할 수 있다.)

### 함수형 실전 코드 예제 소개
##### 0. 예제 데이터

이하 예제에서 사용될 데이터이다. `products`는 객체 형태의 상품 정보를 담고 있는 배열이다. 장바구니에 담긴 데이터라고 가정하고 있다.
```javascript
var products = [
  {
    is_selected: true, // <--- 장바구니에서 체크 박스 선택
    name: "반팔티",
    price: 10000, // <--- 기본 가격
    sizes: [ // <---- 장바구니에 담은 동일 상품의 사이즈 별 수량과 가격
      { name: "L", quantity: 2, price: 0 },
      { name: "XL", quantity: 3, price: 0 },
      { name: "2XL", quantity: 2, price: 2000 }, // <-- 옵션의 추가 가격
    ]
  },
  {
    is_selected: true,
    name: "후드티",
    price: 21000,
    sizes: [
      { name: "L", quantity: 3, price: -1000 },
      { name: "2XL", quantity: 1, price: 2000 },
    ]
  },
  {
    is_selected: false,
    name: "맨투맨",
    price: 16000,
    sizes: [
      { name: "L", quantity: 4, price: 0 }
    ]
  }
];
```

##### 1. 모든 제품의 전체 수량 구하기

제품의 전체 수량을 구하는 코드는 아래와 같이 작성할 수 있다.
```javascript
var sum_total_quantity = function(products) { // <-- 제품의 전체 수량을 구하는 함수
  return _reduce(products, function(tq, product) {
    return _reduce(product.sizes, function(tq2, size) {
      return tq2 + size.quantity;
    }, tq);
  }, 0)
};

var total_quantity = sum_total_quantity(products); // <-- 예제 데이터를 넣으면 전체 수량을 구할 수 있다.
console.log(total_quantity); // 15
```

코드를 살펴보자. 우선 코드에 등장하는 `_reduce` 함수는 돌림직한 데이터(Array, ArrayLike, Object)를 '줄여나가는(reduce)' 함수다. underscore와 같은 라이브러리에선 `fold`라는 이름으로도 사용된다. 이와 같은 표현을 사용하면 `reduce` 함수는 데이터를 '접는(fold)' 함수인 셈이다. 

다시 위의 코드를 보면 가장 밖에 있는 함수가 `products`를 받을 준비를 하고 있다. 이 `products`는 `_reduce`에게 전달된다. `_reduce` 함수는 세개의 인사를 받는데, __접을 데이터__, __어떻게 접을지 정의하는 함수__, __접을 때 사용할 초기값__을 받는다. 여기서 `products`가 접을 데이터가 되고 두번째 함수가 어떻게 접을지를 정의하고 있다. 초기값으로는 `0`을 넘겼다. 그리고 넘겨진 값들로 인해 만들어진 결과를 리턴한다.

이때 어떻게 접을지 정의한 두번째 인자인 함수를 보면 다시 `_reduce`를 사용하고 있는 것을 알 수 있다. 같은 함수가 반복되니 헷갈린다. 하지만 데이터를 보면 그 이유가 드러난다. 우리가 원하는 값은 제품의 수량을 의미하는 `quantity`다. 그런데 값은 `sizes`라는 배열 안에 있기에 다시 한번 `_reduce`를 호출한 것이다. 다시 말해 두번째로 호출되는 `_reduce`는 `sizes` 배열 안의 값을 접어나가는 함수, 먼저 호출된 `_reduce`는 두번째에 의해 접힌 결과를 한번 더 접는 함수인 것이다.

두번째로 호출되는 `_reduce`를 다시 살펴보면 앞서 말한 것처럼 `sizes` 배열을 접을 데이터로 전달한다. 그리고 초기값에 `tq`를 전달하는데 이때 `tq`는 첫번째 `_reduce`가 전달한 `0`에 해당하는 값이다. 이 값은 `products` 배열을 돌면서 값이 계속 누적된다. 값이 쌓여가고 접혀가는 것이다. (이해가 되지 않는다면 우선 넘어간다.) 그리고 어떻게 접을지 정의한 함수에서 진짜 수량을 더한다. `tq2 + size.quantity` 이를 통해 값을 더해나가면 우리가 원하는 총 수량을 구할 수 있다.

위의 과정을 통해 만들어진 함수가 실제로 동작하는 것은 호출이 일어났을 때다. `var total_quantity = sum_total_quantity(products);`처럼 코드를 실행하고 그 결과를 변수에 저장해서 다시 로그 함수에 넘길 수 있지만 선언된 `sum_total_quantity` 함수를 `_go` 함수와 함께 사용하면 아래와 같은 코드가 된다. 별도의 변수 선언 없이 원하는 일을 할 수 있다.
```javascript
_go(products, 
  sum_total_quantity, 
  console.log); // 15
```


##### 2. 선택된 제품의 전체 수량 구하기

선택된 제품들의 수량만을 구하는 코드는 아래와 같다.
```javascript
var selected_products = _filter(products, product => product.is_selected); // <-- 선택된 제품만 골라낸 데이터
var selected_products_total_quantity = sum_total_quantity(selected_products);

console.log(selected_product_total_quantity); // 11
```

비교적 간단한 코드다. `_filter` 함수를 이용해서 우리가 필요한 데이터를 골라내고 있다. 이 함수는 말 그대로 원하는 데이터만을 '거르는' 함수다. 두번째 인자로 전달된 함수는 거를 기준을 제시한다. 리턴값이 참이면 그 값은 `_filter` 필요한 데이터라는 의미가 된다. 위의 코드에서는 선택된 데이터만을 골라내고 있다. 

마찬가지로 `_go` 함수를 사용하면 아래와 같이 표현할 수 있다.
```javascript
_go(products,
  products => _filter(products, product => product.is_selected),
  sum_total_quantity,
  console.log); // 11
```


### 기본 함수 직접 구현하기

##### 1. `_each`
`_each` 함수는 `for`와 같은 반복문을 대체하는 함수다. 오늘 만들 다른 함수들과 마찬가지로 돌림직한 데이터를 돌면서 어떤 동작을 한다. 다른 함수들이 부수효과를 지양하는 것에 반해 이 함수는 부수효과를 이용한다. 인자로 __돌림직한 데이터__와 __돌면서 무엇을 할지 정의한 함수__를 받는다. 

사용의 예는 아래와 같다.
```javascript
_each([1,2,3,4,5], num => console.log(num)); // <-- 1부터 5까지 순서대로 로그가 남는다.
```

실제 함수는 아래와 같이 구현되어 있다.
```javascript
function _each(list, iter) {
  if (Array.isArray(list)) { // <-- 배열을 돌리기 위한 부분
    for (var i = 0, len = list.length; i < len; i++) 
      iter(list[i], i, list);
  } else { // <-- 그 외의 객체를 돌리기 위한 부분
    var keys = Object.keys(list);
    for (var i = 0, len = keys.length; i < len; i++) 
      iter(list[keys[i]], keys[i], list);
  }
}
```

코드를 살펴보면 `for` 구문으로 데이터를 순회하며 `iter`라고 정의한 보조 함수를 한번씩 실행시켜주고 있다. 배열과 객체를 구분해서 값을 찾고 보조 함수에 전달하는데 보조 함수에 전달하는 값은 __순서대로 찾은 값__, __그 값의 인덱스(키)__, __원본 배열(객체)__이다. 이렇게 전달된 인자들을 이용해 `_each` 함수를 보다 유연하게 사용할 수 있게 된다.


##### 2. `_map`
`_map` 함수는 데이터를 돌면서 값을 매핑하고 새로운 배열을 리턴하는 함수다. 앞서 언급한 것처럼 부수효과를 지양한다. `_each`와 마찬가지로 인자로 __돌림직한 데이터__와 __돌면서 무엇을 할지 정의한 함수__를 받는다. 차이점은 받은 함수가 새로운 배열의 값을 정의한다는 점이다.

사용의 예는 아래와 같다.
```javascript
var result = _map([1,2,3,4,5], num => num + 10);
console.log(result); // [11, 12, 13, 14, 15]
```

실제 함수는 아래와 같이 구현되어 있다.
```javascript
function _map(list, iter) {
  var res = [];
  if (Array.isArray(list)) {
    for (var i = 0, len = list.length; i < len; i++) 
      res[i] = iter(list[i], i, list);
  } else {
    var keys = Object.keys(list);
    for (var i = 0, len = keys.length; i < len; i++) 
      res[i] = iter(list[keys[i]], keys[i], list);
  }
  return res;
}
```

`_each` 함수와 다른 점은 `res`라는 결과값을 내부에서 정의하고 이를 반환한다는 것이다. 결과적으로 `_map`은 보조함수에 의해 정의된 값을 담은 새로운 배열을 리턴한다. 


##### 3. `_filter`
위에서 이미 살펴본 `_filter` 함수는 데이터를 거르는 함수다. 사실 `_each`를 제외한 모든 함수는 리턴값이 중요하다. 그 값을 전달함으로 다른 함수와 소통한다. 

사용의 예는 이미 위에서 살펴보았으니 구현체만 살펴보자.
```javascript
function _filter(list, iter) {
  var res = [];
  if (Array.isArray(list)) {
    for (var i = 0, len = list.length; i < len; i++) 
      if (iter(list[i], i, list)) 
        res.push(list[i]);
  } else {
    var keys = Object.keys(list);
    for (var i = 0, len = keys.length; i < len; i++) 
      if (iter(list[keys[i]], keys[i], list)) 
        res.push(list[keys[i]]);
  }
  return res;
}
```

`_map`처럼 결과값 `res`를 갖지만 보조함수가 리턴한 값이 아닌 보조함수의 실행 결과가 참인 경우에만 값을 결과값에 담는다.


##### 4. `_reduce`
역시 이미 앞서 만나본 함수다. `_reduce`는 데이터를 접는 함수다. 다른 함수들과 달리 세개의 인자를 값으로 받는다.

미리 봤던 예제보다 단순한 예제를 살펴보고 구현으로 넘어가자.
```javascript
var result = _reduce([1,2,3,4,5,6,7,8,9,10], function(memo, num) {
  return memo + num;
}, 0);
console.log(result); // 55
```

세개의 인자를 전달 받았다. 첫번째 인자는 1부터 10까지를 담고 있는 배열이다. 이를 어떻게 처리할지 알고 있는 함수와 초기 값을 나머지 인자로 받았다. 예제에서 보조함수는 받은 값을 더하는 함수다. 결과적으로 `_reduce`는 1부터 10까지의 총합을 반환한다. 

이를 구현한 코드는 아래와 같다.
```javascript
function _reduce(list, iter, memo) {
  var i = 0;
  if (Array.isArray(list)) {
    var res = (memo != undefined ? memo : list[i++]); // <-- 남다른 결과값 선언부
    for (var len = list.length; i < len; i++) 
      res = iter(res, list[i], i, list);
  } else {
    var keys = Object.keys(list), res = (memo != undefined ? memo : list[keys[i++]]);
    for (var len = keys.length; i < len; i++) 
      res = iter(res, list[keys[i]], keys[i], list);
  }
  return res;
}
```

결과값 `res`를 선언하는 부분이 조금 남다르다. 앞선 `_map`, `_filter`가 배열을 리턴했던 것과 달리 `_reduce`는 결과값의 데이터형이 호출 당시에 결정된다. 코드에서 `memo`에 해당하는 변수가 바로 초기값이다. 결과값은 초기값의 데이터형에 의해 정해지기 때문에 `res`를 선언하는 과정에서 `memo`가 데이터를 가지고 있는지를 검사한다. `!=`로 검사하여 `null` 혹은 `undefined`인 경우 호출 당시 초기값이 전달되지 않은 것으로 판단하고 `list`의 첫번째 값을 초기값으로 사용한다. 

이후에 다른 함수들과 마찬가지로 반복문을 수행한다. 이때 보조함수 `iter`가 리턴하는 값을 결과값에 덮어씌운다. `list`의 마지막 값을 가지고 보조함수가 수행한 결과가 최종 결과값이 된다.


##### 5. `_go`
`_go` 함수는 파이프라인 코딩이 가능하도록 돕는 함수다. 클로저(Clojure)에서의 `->>` 연산자나 엘릭서(Elixir)에서의 `|>` 연산자와 같은 역할을 한다. 첫번째로 받은 인자(데이터)를 두번째로 받은 인자(함수)에 넘긴다. 두번째 함수가 리턴하는 값을 다시 세번째 인자(함수)로 넘긴다. 예시를 한번 더 살펴보자.

```javascript
_go([1,2,3,4,5,6,7,8,9,10],
  arr => _filter(arr, num => num % 2), // <-- 홀수 값만을 갖는 배열을 리턴한다.
  arr => _reduce(arr, (total, num) => total + num), // [1, 3, 5, 7, 9]을 더하여 리턴한다.
  console.log); // 25
```

코드는 아래와 같이 구현되어 있다.
```javascript
var slice = Array.prototype.slice;
function _go(seed) {
  var fns = slice.call(arguments, 1);
  return _reduce(fns, (se, fn) => fn(se), seed);
}
```

짧은 코드지만 재미난 구석이 많은 코드다. 살펴보자. 우선 `slice`를 사용해서 `arguments` 객체를 배열로 만들어준다. 첫번째 인자인 `seed`를 제외한 나머지들을 모두 `fns`라는 변수에 선언하는데 첫번째 인자를 제외한 모든 인자가 함수일 것이기 때문이다. 이제 이 함수들을 순서대로 실행시켜나가면 된다. 그런데 뜬금없이 `_reduce`가 등장한다. 잠깐 생각해보자.

`_go`는 첫번째 인자로 들어온 __데이터를 여러 함수들에 통과시키며 리턴값을 만들어가는 함수__다. 데이터를 변형해서 무엇으로 만들어가는 함수는 이미 하나 있었다. 데이터를 접는 함수라고 소개했던 `_reduce`가 그런 역할을 한다. __초기값의 데이터형__을 기준으로 __돌림직한 데이터__를 돌면서 데이터를 접어나간다. 우리는 이미 돌림직한 데이터인 `fns`(배열)와 초기값인 `seed`를 가지고 있다. 이제 필요한건 오직 __어떻게 접어나갈지 정의하는 함수__뿐이다. 그렇다. 이게 바로 `_reduce`가 사용된 이유다. 이렇게 이미 정의된 함수 덕에 보다 쉽게 새로운 함수를 만들 수 있다. 이제 어떻게 접어나갈지 살펴보자.

우리는 `fns`가 갖고 있는 함수들의 실행 결과가 필요하다. 이 작업을 단지 `(se, fn) => fn(se)`라고 정의함으로 해결할 수 있다. 이미 정의된 어떤 함수 덕분이다. 여기서 `se`는 처음에는 `seed`와 같은 값이었다가 이후에는 `fn`의 리턴값이 될 것이다. `fn`은 `_reduce`의 내부에서 반복문으로 배열(`fns`)을 돌며 계속해서 다음 값을 넘겨서 받게 되는 함수다. 


### 문제 풀어보기
끝으로 앞서 소개된 '함수형 실전 코드 예제'와 유사한 예제를 풀어보자. 데이터는 `products`라는 변수에 선언되어 있다. ('검사' 창에서 풀어볼 수 있다.) 

##### 1. 모든 제품의 총 가격

##### 2. 선택된 제품의 총 가격 



<script src="https://rawgit.com/joeunha/functional-js-study/master/01_week/functional.js"></script>
<script>
var products = [
  {
    is_selected: true, // <--- 장바구니에서 체크 박스 선택
    name: "반팔티",
    price: 10000, // <--- 기본 가격
    sizes: [ // <---- 장바구니에 담은 동일 상품의 사이즈 별 수량과 가격
      { name: "L", quantity: 2, price: 0 },
      { name: "XL", quantity: 3, price: 0 },
      { name: "2XL", quantity: 2, price: 2000 }, // <-- 옵션의 추가 가격
    ]
  },
  {
    is_selected: true,
    name: "후드티",
    price: 21000,
    sizes: [
      { name: "L", quantity: 3, price: -1000 },
      { name: "2XL", quantity: 1, price: 2000 },
    ]
  },
  {
    is_selected: false,
    name: "맨투맨",
    price: 16000,
    sizes: [
      { name: "L", quantity: 4, price: 0 }
    ]
  }
];
console.log(`
[문제 풀어보기]
  0. 데이터 변수 이름: products
  1. 모든 제품의 총 가격
  2. 선택된 제품의 총 가격 
`)
</script>