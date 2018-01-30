---
title: '오늘의 함수 - if'
date: 2017-12-04 16:36:54
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
---
_오늘 발견한 재미있는 함수를 소개합니다_

## if

오늘은 조건문인 if를 함수로 구현해보려고 합니다. 조건문은 프로그래밍에 아주 빈번하게 사용됩니다. [지난 시간](/programming/javascript-daily-function-10/)에 `parse_query_obj`라는 함수를 만들기 위해 `_.if` 함수가 잠시 등장했습니다. 이처럼 조건문의 사용은 함수형에도 예외일 수 없습니다. 오늘은 함수형 스타일로 프로그래밍하는 상황에 `_.if` 함수의 유/무가 어떻게 다른지 비교하고 `_.if` 함수의 내부가 어떻게 생겼는지 살펴보겠습니다.


#### (1) 어제의 함수
지난 시간에 만든 `parse_query_obj` 함수가 `_.if` 함수 없이 만들어졌다면 어떤 형태였을까요?

```javascript
// var parse_query_obj = _.if(_.identity, // [1] _.if의 첫번째 인자는 조건을 확인하는 함수
//   __(str => str.slice(1).split('&'), // [2] 두번째 인자는 조건이 참이면 실행될 함수
//     _.compact, 
//     _.reduce(function(obj, str) { 
//       var arr = str.split('='); 
//       obj[arr[0]] = arr[1];
//       return obj;
//     }, {})))
//   .else(_.always({})); 

var parse_query_obj = function(value) {
  return value ? _.go(value, // [3] value 값이 참이라면 함수들을 즉시 실행합니다.
    str => str.slice(1).split('&'),
    _.compact, 
    _.reduce(function(obj, str) { 
      var arr = str.split('=');
      obj[arr[0]] = arr[1];
      return obj;
    }, {})) : {};
}
```

딱히 나쁘다고 말할 수준은 아닙니다. 삼항연산자를 사용하니 깔끔하고 이해도 쉽습니다. 그렇다면 `make_query_obj` 함수를 만드는 과정 속에 `parse_query_obj` 함수도 만드는 경우는 어떨까요?

```javascript
var make_query_obj = _.go(
  window.location.search,
  function(value) { // parse_query_obj
    return value ? _.go(value, 
      str => str.slice(1).split('&'),
      _.compact, 
      _.reduce(function(obj, str) { 
        var arr = str.split('=');
        obj[arr[0]] = arr[1];
        return obj;
      }, {})) : {};
  },
  // ...
  );
```

역시 나쁘지 않지만 아쉽지 않나요? `_.if` 함수가 있었다면 조금 더 읽기 좋은 코드가 되지 않을까요?

```javascript
var make_query_obj = _.go(
  window.location.search,
  _.if(_.identity, __( 
    str => str.slice(1).split('&'),
    _.compact, 
    _.reduce(function(obj, str) { 
      var arr = str.split('='); 
      obj[arr[0]] = arr[1];
      return obj;
    }, {})))
  .else(_.always({})),
  // ...
  );
```

`_.if` 함수의 사용으로 보다 직관적이고 이해가 쉬운, 읽기 좋은 코드가 되었습니다. 작성하는 것도 직관적으로 작성할 수 있습니다. 분기가 필요한 순간에 조건문을 작성하듯 `_.if` 함수를 적으면 그만입니다. 


#### (2) 오늘의 함수
`_.if` 함수의 사용법을 확인했으니 내부를 살펴보겠습니다.

```javascript
_.if = function(predi, fn) {
  var store = [fn ? [predi, fn] : [_.identity, predi]]; // [1]
  
  function If() {
    var context = this, args = arguments; // [2]
    return _.go(store, // [3] 
      _.find(function(fnset) { return fnset[0].apply(context, args); }), // [4]
      function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; }); // [5]
  }

  return _.extend(If, { // [6]
    else_if: function(predi, fn) { return store.push(fn ? [predi, fn] : [_.identity, predi]) && If; }, // [7]
    else: function(fn) { return store.push([_.constant(true), fn]) && If; }
  });
};
```

위의 코드가 `_.if` 함수의 전부입니다. 의외로 짧은 코드입니다. 그 속에 재미난 기법들이 숨어있습니다. 천천히 살펴보겠습니다. 번호를 주석으로 넣어두었으니 순서대로 설명해나가겠습니다. 

[1] Line 2 - 우선 `store`라는 배열을 만듭니다. 이 배열은 조건을 판별하는 `predi` 함수와 조건이 참일 경우 실행될 `fn` 함수의 묶음인 배열을 값으로 가진 2차원 배열입니다. 이 과정에 나타나는 삼항연산자는 `fn` 값이 없는 경우, 즉 인자가 1개만 주어진 경우를 확인합니다. 만약에 인자가 1개만 들어왔다면 그건 `predi`가 아니라 `fn`에 해당하는 함수입니다. 따라서 `predi`에 해당하는 조건부를 생략하면 `_.identity`를 `predi`에 넣어줍니다. (상단의 예제에서는 이해를 돕기 위해 첫번째 인자로 `_.identity`를 넣었지만 실제로는 넣지 않아도 동작합니다.)

[2] Line 5 - 본격적인 `If` 함수 내부입니다. 이후에 사용하기 위해 실행 컨텍스트인 `this`와 매개변수를 담은 `arguments`를 변수에 할당해둡니다. 

[3] Line 6 - `_.go` 함수로 원하는 동작을 수행한 결과를 리턴합니다. `_.go`의 첫번째 인자는 배열인 `store` 입니다.

[4] Line 7 - `_.find`의 술부에 해당하는 함수를 미리 적용(커링)해둡니다. 이때 술부 내부를 살펴보면 `fnset`이라는 값이 존재하는데 이는 `store`가 가졌던 배열입니다. 이 배열은 `[predi, fn]`의 형태로 생겼습니다. 결국 `fnset[0].apply(context, args)` 이 대목은 `predi`를 실행해보는 것입니다. 이를 통해 참 값이 반환되면 `_.find` 함수가 찾는 값이 됩니다. 따라서 해당 `fnset`이 이후 함수로 전달됩니다.

[5] Line 8 - 전달된 `fnset`의 두번째 인자는 참인 경우 실행될 함수입니다. `fnset[1].apply(context, args)`로 함수를 실행합니다.

[6] Line 11 - 만들어둔 함수 `If`에 몇가지 함수를 더 붙여서 리턴합니다. (클로저 함수가 리턴됩니다.) 자바스크립트에서 함수는 객체이기 때문에 `_.extend`를 이용해 확장이 가능합니다. 추가로 붙는 함수는 `else_if`와 `else` 입니다. 

[7] Line 12 - `store`에 추가로 배열을 만들어 넣습니다. 그리고 `If` 함수를 리턴합니다. 클로저로 `store` 값이 기억되고 누적되기 때문에 실제로 `If` 함수가 호출될때 `store`의 길이는 `if`, `else_if`, `else`가 호출된 만큼의 길이를 갖습니다.

이렇게 만들어진 함수는 아래와 같이 사용할 수 있습니다. (feat. [window.functions.js](https://github.com/marpple/window.functions.js))

```javascript
_go(11,
  _.if(_lt(10), // [1] 10보다 작으면
    _pipe(
      _add(100), 
      console.log)
  ).else_if(_gte(20), // [2] 20과 같거나 크면
    _pipe(
      _add(200), 
      console.log)
  ).else(
    _pipe(
      _add(300), 
      console.log)
  )); 
  // [3] 결과는 311 입니다.
```


#### (3) 내일의 함수
`_.if` 함수의 불편한 점을 발견하지 못하셨나요? 인자를 두개 넘겨서 조건부와 실행부를 결정하기 때문에 각 함수를 `_.pipe` 함수와 같은 합성 함수로 묶어줘야 합니다. 아무래도 불편하죠. 실제로 하나의 함수로 모든 일을 하는 경우는 드문 일이니까요. 그냥 알아서 함수를 합성해주면 더 편할텐데요. 그래서 만들어진 `_.if2`를 다음 시간에 소개할까 합니다. 이 함수를 사용하면 코드는 아래처럼 달라집니다.

```javascript
_go(11,
  _.if2(_lt(10))(
    _add(100), 
    console.log
  ).else_if(_gte(20))(
    _add(200), 
    console.log
  ).else(
    _add(300), 
    console.log
  ));
```