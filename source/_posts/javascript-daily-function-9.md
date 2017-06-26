---
title: '[오늘의 함수] omit'
date: 2017-06-12 20:59:55
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 오늘의함수
---
_오늘 발견한 재미있는 함수를 소개합니다_

## omit

오늘은 `pick` 함수의 반대 버전인 `omit`을 소개해드릴까 합니다. 다시 말해 `omit`은 객체에서 키가 일치하는 프로퍼티를 제외한 새로운 객체를 반환하는 함수입니다. 

사실 이 함수를 굳이 소개할 필요가 있을까 싶었는데, 사연이 생겨서 올리게 되었습니다. 2주 전쯤 [Codewars](https://www.codewars.com/kumite/)라는 사이트에서 제공하는 'kumite'(일본어로 대련을 의미합니다.) 페이지에 `pick` 함수를 올려두었습니다. 그리고 며칠 뒤 `omit`과 같은 일을 하는 `flick`함수를 대련 코드로 올리셨기에 살펴보다가 블로그에 소개하면 좋겠다고 생각해서 올리게 되었습니다.

우선 [Codewars](https://www.codewars.com/kumite/59421af0c32f438c1a000044?sel=595073a15ceb2bda6d000161)에 올려둔 코드 전체를 보여드리겠습니다.

#### (1) pick 함수와 flick 함수
```javascript
var _ = {};

// [1] 제가 작성한 pick 함수입니다. 기존의 pick과 크게 다르지 않습니다.
_.pick = (target, ...keys) => {
  if (typeof keys[0] == 'function') {

    var predicate = keys[0];
    keys = Object.keys(target);
    
    return keys.reduce((obj, key) => {
      return predicate(target[key], key, target) ? (obj[key] = target[key], obj) : obj;
    }, {})
  }

  return keys.reduce((obj, key) => {
    return obj[key] = target[key], obj;
  }, {});
};

// [2] Robert.Cutright이라는 개발자가 작성한 flick 함수입니다. omit 함수와 같은 일을 합니다.
_.flick = (target, ...keys) => {
  if (typeof keys[0] == 'function') {

    var predicate = keys[0];
    keys = Object.keys(target);
    
    return keys.reduce((obj, key) => {
      return predicate(target[key], key, target) ? obj : (obj[key] = target[key], obj);
    }, {})
  }

  var obj = Object.assign({}, target);
  Object.keys(obj).filter(key => keys.includes(key) ? delete obj[key] : obj[key]);
  return obj;
};
```

Robert가 작성한 코드는 정상적으로 동작합니다. 하지만 저는 한가지가 아쉬웠습니다. 바로 `filter`를 사용한 부분입니다. `reduce`를 사용하면 새로운 객체 복사본을 만드는 `var obj = Object.assign({}, target);` 같은 코드를 작성하지 않아도 된다는 점을 놓친 것 같았습니다. 그리고 이렇게 새로운 객체를 생성해서 `delete obj[key]`로 데이터를 제거해나가는 코드는 불필요한 코드라는 생각이 들었습니다. 그래서 아래와 같이 변경했습니다.

```javascript
_.omit = (target, ...keys) => {
  if (typeof keys[0] == 'function') {
	  var predicate = keys[0];
    return _.pick(target, (...args) => !predicate(...args)) // [1] pick을 사용하고 predicate를 뒤집었습니다.
  }
  
  return Object.keys(target).reduce((obj, key) => { // [2] reduce를 사용하면서 새로운 객체를 복사한 뒤 요소를 제거하지 않고 바로 생성합니다.
    return keys.includes(key) ? obj : (obj[key] = target[key], obj);
  }, {});
};
```
