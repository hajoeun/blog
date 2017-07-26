---
title: '[미니게임] 코드 - BINGO'
date: 2017-07-26 13:55:31
categories:
  - joeun.me
  - programming
tags:
  - javascript
  - 미니게임
  - 만들기
  - 빙고
  - bingo
---
_(의식의 흐름대로) 미니 게임을 만들어보자!_

### 빙고판 데이터 만들기
75개의 숫자(1~75) 중에서 25개의 숫자를 임의로 선택해서 5x5 크기의 판을 만들어보자.

##### 1부터 75까지 담고 있는 배열을 만든다.

```javascript
var base_arr = [], i = 0;
while (++i < 76) base_arr.push(i);

// Partial.js의 함수들을 사용하면 아래와 같이 할 수 있다.
// var base_arr = _.go(76, _.range, _.rest);
```

##### 빙고판을 만들어줄 함수를 만든다.
다섯개의 배열(B, I, N, G, O 에 해당하는 배열)을 값으로 갖는 배열을 만들어야 하는데, 이때 숫자들은 15개씩 각 배열에 속해야 함으로 적절한 위치를 찾아주는 함수가 필요하다. (물론 순서대로 넣어주면 되지만 랜덤한 숫자일 필요가 있기 때문에 위치를 찾아주는 수고가 필요하다.)

```javascript
function find_idx(n) {
  var i = 4;
  if (n <= 15) i = 0;
  else if (n <= 30) i = 1;
  else if (n <= 45) i = 2;
  else if (n <= 60) i = 3;
  return i;
}
```
위의 함수를 이용해서 다섯개의 배열을 값으로 갖는 배열을 만드는 함수를 만든다.

```javascript
function make_bingo(arr) {
  return arr.reduce(function(o, n) {
    var i = find_idx(n);
    return o[i].push(n), o;
    }, [[],[],[],[],[]])
}

// Partial.js의 함수는 커링을 지원한다. 
// 첫번째 인자를 제외한 인자가 들어오면 동작할 준비가 된 함수를 반환한다.
// var make_bingo2 = _.reduce(
//  (o, n) => {
//     var i = find_idx(n);
//     return o[i] = o[i].concat(n), o;
//     }, [[],[],[],[],[]]);
```

##### 상황판에 해당하는 배열과 빙고판에 해당하는 배열을 만드는 함수를 만든다.
사실 위의 `make_bingo`는 5x5의 빙고판을 만들어주지 않는다. 길이가 15인 배열 5개를 가진 배열을 만들 뿐이다. 이렇게 만들어진 판은 게임에 참가하는 유저에게 주어지는 판이 아니라 게임 진행 상황을 확인할 수 있는 상황판이 된다. 이제 실제 유저가 사용할 수 있는 진짜 5x5 빙고판을 만들어보자.

```javascript
function make_user_board(arr) {
  var rand_arr = _.shuffle(arr);
  return make_bingo(rand_arr);
}

var result = make_user_board(base_arr);
console.log(result[0]); // 순서가 섞인 배열 (B의 범위에 속하는 배열)
console.log(result[0].length); // 15
```
`_.shuffle` 함수 덕분에 순서가 섞인 배열을 얻게 되었지만 여전히 배열이 너무 길다. 줄여보자.

```javascript
function reduce_first_5(arr) {
  return arr.reduce(function(l, v, i) {
    return l[i] = _.first(v, 5), l;
  }, [])
} // var reduce_first_5 = _.reduce((l, v, i) => (l[i] = _.first(v, 5), l), []);

function make_user_board(arr) {
  var rand_arr = _.shuffle(arr);
  return reduce_first_5(make_bingo(rand_arr));
} // var make_user_board = _.pipe(_.shuffle, make_bingo, reduce_first_5);

var result = make_user_board(base_arr);
console.log(result[0]); // 순서가 섞인 배열 (B의 범위에 속하는 배열)
console.log(result[0].length); // 5
```
`result`는 5개의 배열을 갖는 배열이며 각 배열의 길이는 5이다. 그리고 각 배열은 임의의 순서가 섞여 있다. 이 상태를 5x5 빙고판의 데이터라고 보자. (`make_user_board`라는 함수를 이용하면 매번 새로운 빙고판 데이터를 만들 수 있다.)


### 데이터를 이용해서 빙고판 그리기
결국 게임을 진행하려면 DOM에 만든 배열을 그려야하는데, 어떻게 그려야할까. 우선 그려질 숫자를 적어 넣을 판을 먼저 만들어야 한다.

##### html table 태그 문자열 만들기
