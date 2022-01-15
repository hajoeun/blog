---
title: '함수형 자바스크립트 - 함수형 자바스크립트 라이브러리'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - 함수형 프로그래밍
  - 함수형 자바스크립트
date: 2017-10-19 18:41:14
slug: functional-js-study-2
---
## 함수형 자바스크립트 라이브러리
함수형으로 프로그래밍하는데 도움을 주는 자바스크립트 라이브러리를 알아보고 배워보자.
(모든 예제는 웹 브라우저의 '검사' 도구를 열어서 테스트할 수 있다.)

### Partial.js
##### 0. Underscore
자바스크립트 생태계에서 `_`(underscore)라는 네임스페이스는 보통 [Underscore](http://underscorejs.org/)나 [Lodash](https://lodash.com/)의 차지다. underscore가 먼저 등장했고 이후에 조금 더 다양한 함수와 기능으로 무장한 채로 lodash가 등장했다. 그리고 이제 같은 네임스페이스를 사용하지만 보다 함수형 프로그래밍에 적합한 [Partial](https://marpple.github.io/partial.js/)을 소개할 차례다.


##### 1. 부분 적용 함수 `_.partial`
[지난 시간](/functional-js-study-1/)에 다룬 `curryr` 함수는 해결되지 않은 문제를 가지고 있었다.

```javascript
var add = curryr((a, b) => a + b);
```

`curryr`에 의해 커링이 가능하게 만들어진 함수는 받을 수 있는 인자의 개수가 2개로 제한되어 있다는 점이었다. `reduce`와 같이 3개 이상의 인자를 받는 함수가 커링이 가능하도록 만들기 위해서는 `curryr`을 새로 만들어야하는 상황이었다.

```javascript
function curryr3(fn) {
  return function(a, b, c) {
    if (arguments.length == 1) // <-- 인자의 수에 따라 다른 값을 리턴
      return function(b) {
        return fn(b, a);
      };
    if (arguments.length == 2)
      return function(c) {
        return fn(c, a, b);
      };
    return fn(a, b, c);
  }
}
```

`curryr3`은 세개의 인자를 받는 함수라도 커링이 가능하도록 만들어주는 함수다. 허나 인자의 수에 따라 새로운 함수를 여러개 만들어 두는 것은 그리 근사한 방법이 아니다. 이 부분도 추상화가 가능하다. 바로 `_.partial` 함수다. 이 함수는 커링을 보다 높은 레벨로 추상화한 함수다. `curry`와 마찬가지로 커링이 가능한 함수를 리턴하는 함수이지만 미리 값을 적용시켜둘 인자의 순서를 정할 수 있는 함수다. 사용법을 살펴보자.

```javascript
var arr = [1,2,3,4,5,6,7,8,9,10];

var sum_init_0 = _.partial(reduce, _, (total, num) => total + num, 0);
console.log(sum_init_0(arr)); // 55

var sum = _.partial(reduce, _, (total, num) => total + num);
console.log(sum(arr, 100)); // 155

var reduce_arr = _.partial(reduce, arr);
console.log(reduce_arr((total, num) => total + num)); // 55
```

`sum_init_0` 함수는 `0`을 초기값으로 가진 상태로 돌림직한 데이터가 가진 모든 수를 더하는 함수다. 선언되는 과정을 살펴보면 `_.partial` 함수에게 세개의 인자가 전달된다. 첫번째 인자인 `reduce`는 커링의 대상이 될 함수다. 이후의 인자들은 `reduce`에 전달될 인자를 의미한다. 두번째 인자는 `_`인데 이 부분은 나중에 받겠다는 의미가 된다. __'지금은 비워두고 나중에 값이 들어오면 여기에 넣어라'__는 의미가 되는 셈이다. 반면 `(total, num) => total + num`과 `0`은 각각 `iter`, `memo`를 의미하고([기본 함수 구현하고 사용하기](/functional-js-study/) 편의 `reduce` 참고) __'지금 값을 넣어두겠다'__는 의미가 된다. 이렇게 일정 부분만 미리 값을 넣어두는 행위를 __부분 적용__이라고 한다.

`sum` 함수는 돌림직한 데이터가 가진 모든 수를 더하는 함수다. `sum_init_0`와는 초기값의 유무에서 차이가 생긴다. `_.partial` 함수를 살펴보면 마지막 인자 `0`이 없는 것을 알 수 있다. 이처럼 `_.partial`로 부분 적용된 함수를 만들 때 마지막 인자가 들어오지 않으면 `_`과 같은 취급을 한다. 즉 '지금은 비워두고 나중에 값이 들어오면 넣는' 영역으로 본다. 결과적으로 `sum`은 `iter`만을 가진 함수가 되어 실행하는 시점에 데이터 `arr`와 초기값 `100`을 인자로 줄 수 있었다.

반면 `reduce_arr`는 데이터를 가지고 있지만 어떻게 돌리며 접어나갈지 정의 되지 않았다. 때문에 실행되는 시점에 어떻게 돌릴지 정의하는 함수를 주고 결과를 얻어낼 수 있었다. (`reduce`는 초기값이 생략되면 데이터의 첫번째 값을 초기값으로 사용한다.)

이렇게 `_.partial`을 사용하면 `_curry`, `_curryr`이 가지고 있던 단점을 모두 보완할 수 있다. 실제 사용의 사례를 보면 이렇다.

```javascript
_.go(arr,
  _.partial(filter, _, n => n % 2),
  _(reduce, _, (a, b) => a + b, 0), // <-- 네임스페이스 '_'는 _.partial 함수다.
  console.log); // 25
```

위 코드에서 재미난 부분은 Partial.js에서는 네임스페이스인 `_`가 `_.partial` 함수라는 점이다. Partial이라는 라이브러리의 이름이 `_.partial` 함수와 같은 이유가 바로 이 때문이다. 사실 위의 코드는 `_.partial`의 사용 예를 보여주기만을 위한 코드라 그리 근사하지 않다. 지난 시간에 만든 `filter`와 `reduce` 대신 Partial.js의 함수들을 사용하면 보다 깔끔한 코드를 만들 수 있다.

```javascript
_.go(arr,
  _.filter(n => n % 2),
  _.reduce((a, b) => a + b),
  console.log); // 25
```

`_.filter`와 `_.reduce`를 구현하는 코드에는 `_.partial` 함수가 사용되고 있기 때문에 위와 같은 부분 적용이 가능하다.


##### 2. `_.go`, `_.pipe`의 사용
우리는 이미 `go`와 `pipe`를 만들고 사용해보았다. 이번에 사용해볼 `_.go`와 `_.pipe`는 조금 특별한 비밀을 가지고 있다. 이전에 직접 만들었던 함수와 같은 일을 한다. 함수를 실행하거나 함수를 조합하여 리턴한다. 전달된 인자 중에 __비동기 함수가 있더라도 완벽하게 제어해준다는 점__을 제외하면 주요 역할은 동일한 함수다.

```javascript
function syncDate() {
  return new Date();
}
function promiseDate() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(new Date());
    }, 1000);
  });
}

_.go([1, 2, 3],
  _.map(syncDate),
  _.map(d => d.toString()),
  console.log);
// 결과:
//  ["Sun Feb 05 2017 03:33:36 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:36 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:36 GMT+0900 (KST)"]

_.go([1, 2, 3],
  _.map(promiseDate),
  _.map(d => d.toString()),
  console.log);
// 결과:
//  ["Sun Feb 05 2017 03:33:37 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:38 GMT+0900 (KST)",
//   "Sun Feb 05 2017 03:33:39 GMT+0900 (KST)"]
```

위의 예제는 Partial.js의 [소개 페이지](https://marpple.github.io/partial.js/#컬렉션을-다루는-비동기-제어-함수)에 나오는 코드를 가져왔다. 잠깐 코드를 살펴보면 동기적으로 날짜를 리턴하는 `snycData` 함수와 비동기적으로 날짜를 리턴하는 `promiseData` 함수가 있다. 두 함수를 `_.map`에 넣어 실행하면 날짜 데이터를 갖는 배열을 리턴한다. 다시 한번 `_.map`으로 날짜 데이터를 문자열로 치환하여 리턴하면 결과값과 같은 날짜와 시간을 표시한 문자열이 담긴 배열이 나온다. 비동기 상황임에도 불구하고 동기 상황과 같은 결과를 리턴한다. 물론 3초정도의 시간이 소요된다. [1주차](/functional-js-study/)에 만들어본 일반 `go`를 사용하면 위와 같은 결과를 만들어내지 못한다.

```javascript
go([1, 2, 3],
  _.map(promiseDate),
  _.map(d => d.toString()),
  console.log); // []
```

비동기 상황을 무시하고 지나가면서 빈 배열만을 리턴한다. 살펴본 것처럼 Partial.js `_.go`를 사용하면 이와 같은 문제없이 비동기 상황을 생각한대로 제어할 수 있다.


##### 3. 템플릿 함수 `_.template`
HTML 코드를 보다 쉽게 작성하기 위해 [Pug](https://pugjs.org/api/getting-started.html), [Handlebars.js](http://handlebarsjs.com/), [ejs](http://www.embeddedjs.com/)와 같은 템플릿 엔진이 존재한다. Partial.js는 함수 스타일의 템플릿 엔진인 `_.template` 함수를 지원한다. Pug와 같은 문법을 사용하는 이 함수의 사용법에 대한 자세한 설명은 [소개 페이지](https://marpple.github.io/partial.js/#함수-스타일의-템플릿-함수)에서 확인할 수 있다.


### 함수형 jQuery, don.js
##### 1. jQuery vs don.js
don.js는 jQuery가 지원하는 함수들을 함수형 스타일로 지원한다.

```javascript
// jQuery
$('body');
$('body').addClass('container');

// don.js
D('body');
D.addClass(D('body'), 'container');
```

jQuery가 체인 방식으로 함수들을 이어나가는 것과 달리 __don.js는 함수의 리턴값을 사용함__으로 함수를 이어나간다. 때문에 Partial.js와 궁합이 잘 맞는다.


##### 2. Don.js with Partial.js

```javascript
// jQuery (http://api.jquery.com/map/)
console.log(
  $( ":checkbox" )
    .map(function() {
      return this.id;
    })
    .get() // <-- 이때 배열이 된다.
    .join());


// don.js
_.go(
  D('[type="checkbox"]'),
  _.map(function(el) {
    return el.id;
  }), // <-- 이미 배열인 상태다.
  _.join(), // arr => arr.join(),
  _.log);
```

jQuery가 셀렉터를 통해 찾아 리턴하는 값이 jQuery 객체인데 반해 don.js의 리턴값은 기본형 데이터인 배열이거나 엘리먼트 자체임으로 어떤 순수 함수인 다른 함수들과 조합이 자유롭다. 위의 예제에서 jQuery의 경우, `map`을 실행한 뒤에 `get`을 실행하지 않으면 배열의 기본 메서드인 `join`을 실행할 수 없다. 하지만 don.js는 항상 기본형 데이터를 사용하기 때문에 자유롭게 함수들을 이어갈 수 있다.

`_.template` 계열의 템플릿 함수들과 함께 사용하면 더 don.js를 재미있고 유용하게 사용할 수 있다. 우선 예제를 위해 아래와 같은 주문서 데이터(`projections`)가 있다고 가정하자.

```javascript
var projections = [
  { id: 1, user_id: 2, _: { user: { name: 'ID', age: 36 }, products: [ { name: '긴팔티' }, { name: '후드티' } ] } },
  { id: 2, user_id: 7, _: { user: { name: 'BJ', age: 32 }, products: [ { name: '긴팔티' } ] } },
  { id: 3, user_id: 8, _: { user: { name: 'JM', age: 34 }, products: [ { name: '에코백' }, { name: '청바지' }] } },
  { id: 4, user_id: 9, _: { user: { name: 'PJ', age: 27 }, products: [ { name: '양말' }, { name: '후드티' }, { name: '긴팔티' }, { name: '에코백' } ] } },
  { id: 5, user_id: 1, _: { user: { name: 'HA', age: 25 }, products: [ { name: '에코백' } ] } },
  { id: 6, user_id: 11, _: { user: { name: 'JE', age: 26 }, products: [ { name: '머플러' } ] } },
  { id: 7, user_id: 12, _: { user: { name: 'JI', age: 31 }, products: [ { name: '머그컵' } ] } },
  { id: 8, user_id: 15, _: { user: { name: 'MP', age: 23 }, products: [ { name: '에코백' } ] } },
  { id: 9, user_id: 15, _: { user: { name: 'MP', age: 23 }, products: [ { name: '에코백' }] } },
  { id: 10, user_id: 15, _: { user: { name: 'MP', age: 23 }, products: [ { name: '에코백' }] } },
];
```

예제 데이터는 주문서의 아이디, 주문자의 정보와 제품 정보를 담고 있다. 이를 이용해서 주문 목록을 그린다고 가정해보자. 템플릿 함수 중 하나인 `_.t$`(`_.template$`의 약식) 함수를 사용하면 아래와 같은 코드로 원하는 목록을 그릴 수 있다.

```javascript
_.go(
  projections,
  _.sum(_.t$(`
    li#{{$.id}}
      .user_info#{{$.user_id}}
        h4 {{$._.user.name}}
      ul.products {{_.sum($._.products, `, _.t$(`
        li {{$.name}}
      `) ,`)}}
      button 주문취소
      `)),
  // _.hi, // <-- 앞의 주석을 제거하면 어떤 문자열이 만들어지는지 확인할 수 있다.
  D.appendTo('.user_list'));
```

`_.sum`은 `projections` 데이터를 바탕으로 `_.t$` 함수가 만들어낸 HTML 문자열을 하나의 문자열로 합쳐준다. 이렇게 합쳐진 긴 문자열은 `D.appendTo` 함수에게 전달되는데 이 함수는 `'.user_list'`라는 문자열을 인자로 받았다. 클래스 명이 'user\_product'에 해당하는 엘리먼트에게 이후에 들어오는 HTML 문자열을 엘리먼트로 변환해서 붙여넣겠다는 의미다. 결과적으로 앞에서 `_.sum`에 의해 합쳐진 문자열이 `D.appendTo`에 의해 엘리먼트로 변환되고 'user\_product'에 해당하는 클래스를 가진 곳에 붙여진다.

이벤트를 달아서 주문을 취소하는 동작을 만들기 위해선 아래와 같은 `on` 함수를 사용하면 된다.

```javascript
_.go(
  D('body'),
  D.on('click', 'button', _.pipe(
    _.v('$currentTarget'),
    D.parent('li'),
    D.hide)
  ));
```

`_.pipe` 함수가 등장했다. `D.on` 함수의 세번째 인자로 받을 함수는 '클릭 이벤트가 발생하면 어떤 일을 할지 정의한 함수'가 들어와야 한다. 이 함수를 `_.pipe`가 여러개의 함수를 조합해서 만들었다. 내부를 보면 `_.v('$currentTarget')` 함수가 이벤트의 대상이 되는 엘리먼트를 꺼내고 `D.parent('li')`가 부모 중에 li 엘리먼트인 것을 찾아 리턴한다. 마지막에 `D.hide`가 리턴된 엘리먼트를 숨긴다. 이러한 순서에 의해 버튼을 클릭하면 대상을 담고 있는 li 엘리먼트가 가려지는 동작을 수행한다.

---

### 전체 스터디 일정
  - 1주차 - [기본 함수 구현하고 사용하기](/functional-js-study/)
  - 2주차 - [고차 함수와 커링(currying)](/functional-js-study-1/)
  - 3주차 - 함수형 자바스크립트 라이브러리
  - _4주차 - Movie Box 1: 필터링, 정렬_
  - _5주차 - Movie Box 2: 필터링, 정렬 복습_
  - _6주차 - Movie Box 3: 지연평가 L, memoize_
  - _7주차 - Movie Box 4: 비동기 상황 다루기_

[예제 코드](https://github.com/hajoeun/functional-js-study/tree/master/03_week)
