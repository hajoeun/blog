---
title: '미니게임 - BINGO(2)'
date: 2017-07-26 13:55:31
categories:
  - programming
tags:
  - javascript
  - 미니게임
  - 만들기
  - 빙고
  - bingo
---
_(의식의 흐름대로) 미니 게임을 만들어보자!_

## BINGO[2] - View
숫자 데이터(배열)를 만들어서 DOM에 그리기까지

### 빙고판 데이터 만들기
75개의 숫자(1~75) 중에서 25개의 숫자를 임의로 선택해서 5x5 크기의 판을 만들어보자.

#### 1부터 75까지 담고 있는 배열을 만든다.

```javascript
var base_arr = [], i = 0;
while (++i < 76) base_arr.push(i);

// Partial.js의 함수들을 사용하면 아래와 같이 할 수 있다.
// var base_arr = _.go(76, _.range, _.rest);
```

#### 빙고판을 만들어줄 함수를 만든다.
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

#### 상황판에 해당하는 배열과 빙고판에 해당하는 배열을 만드는 함수를 만든다.
사실 위의 `make_bingo`는 5x5의 빙고판을 만들어주지 않는다. 길이가 15인 배열 5개를 가진 배열을 만들 뿐이다. 이렇게 만들어진 판은 게임에 참가하는 유저에게 주어지는 판이 아니라 게임 진행 상황을 확인할 수 있는 상황판이 된다. 이제 실제 유저가 사용할 수 있는 진짜 5x5 빙고판을 만들어보자.

```javascript
function make_user_data(arr) {
  var rand_arr = _.shuffle(arr);
  return make_bingo(rand_arr);
}

var result = make_user_data(base_arr);
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

function make_user_data(arr) {
  var rand_arr = _.shuffle(arr);
  return reduce_first_5(make_bingo(rand_arr));
} // var make_user_data = _.pipe(_.shuffle, make_bingo, reduce_first_5);

var user_data = make_user_data(base_arr);
console.log(user_data[0]); // 순서가 섞인 배열 (B의 범위에 속하는 배열)
console.log(user_data[0].length); // 5
```
`result`는 5개의 배열을 갖는 배열이며 각 배열의 길이는 5이다. 그리고 각 배열은 임의의 순서가 섞여 있다. 이 상태를 5x5 빙고판의 데이터라고 보자. (`make_user_data``라는 함수를 이용하면 매번 새로운 빙고판 데이터를 만들 수 있다.)


### 데이터를 이용해서 빙고판 그리기
결국 게임을 진행하려면 DOM에 만든 배열을 그려야하는데, 어떻게 그려야할까. 우선 그려질 숫자를 적어 넣을 판을 먼저 만들어야 한다.

#### html table 태그 문자열을 만든다.
DOM에 그려질 html 태그를 괄호까지 직접 타이핑하는 것은 너무 번거로운 일이다. 그래서 대부분은 [pug](https://pugjs.org/api/getting-started.html), [ejs](http://www.embeddedjs.com/), [handlebars](http://handlebarsjs.com/) 같은 템플릿 엔진을 사용한다. 이와 같은 도구는 값에 따라 다른 태그를 유동적으로 작성해야할 때 매우 유용한데, Partial.js에서는 `_.template` 함수가 이와 같은 일을 한다. 

```javascript
var table_template = _.template('data', `
        table 
          tr
            th B
            th I
            th N
            th G
            th O {{ _.go(data, `, _.template.each('d1', `
          tr {{ _.go(d1, `, _.template.each('d2',`
            td {{d2}}
          `),`)}}`),
        `)}}
      `);

table_template(user_board);
/* 출력 결과
"<table ><tr ><th >B</th><th >I</th><th >N</th><th >G</th><th >O <tr ><td >10</td><td >7</td><td >5</td><td >4</td><td >8</td></tr><tr ><td >28</td><td >20</td><td >30</td><td >16</td><td >26</td></tr><tr ><td >33</td><td >41</td><td >45</td><td >42</td><td >32</td></tr><tr ><td >47</td><td >59</td><td >50</td><td >51</td><td >52</td></tr><tr ><td >65</td><td >67</td><td >68</td><td >69</td><td >63</td></tr></th></tr></table>"
*/
```
`_.template(data_name, template_structure)` 함수는 두개의 인자를 받아서 함수를 반환한다. 이 함수는 데이터를 받아 html 태그 문자열을 만든다. 처음에 `_.template` 함수가 받는 두개의 인자는 각각 태그를 그릴 때 사용할 '데이터의 이름'과 '템플릿의 구조'를 받는다. 데이터의 이름은 템플릿의 구조에서 <code>&#123;&#123;&#125;&#125;</code> 안에서 그려질 태그 문자열에 반영될 데이터의 이름이다. 템플릿 구조 안에서 이중 중괄호 안은 자바스크립트의 영역이다. 자세한 내용은 [Partial.js의 문서](https://marpple.github.io/partial.js/#함수-스타일의-템플릿-함수)를 참고하면 된다.

참고: `_.template.each` 함수는 템플릿을 반복적으로 그려야할 때 사용한다. 템플릿의 구조를 정의하기 위해 사용된 역따옴표는 ES6부터 개행이 포함된 문자열을 담을때 사용한다. ES5에서는 개행 전에 역슬래시가 포함되어야 한다.

#### 필요한 함수를 조립한다.
DOM에 그려질 View를 만들기 위한 작업은 어느정도 되었다. 이제 함수를 조립해서 실제로 사용할 함수를 만들자.

```javascript
var make_bingo_table = _.pipe(_.unzip, table_template, D.el);

var make_user_board = _.pipe(make_user_data, make_bingo_table, D.appendTo('.user_board'));

var make_admin_board = _.pipe(make_bingo, make_bingo_table, D.appendTo('.admin_board'));
```
세개의 함수가 준비되었다. `make_user_board(base_arr)`의 형태로 사용하면 user_board를 클래스로 갖는 DOM 엘리먼트에 기대했던 빙고판이 붙는다. 여기서 사용된 `D`를 네임스페이스로 갖는 함수는 [Don.js](https://rawgit.com/joeunha/bingo/master/docs/js/don.js)라는 라이브러리가 가진 함수들이다. 사용법은 jQuery와 같은데 메서드로 사용하지 않고 함수로 사용한다는 점만 다르다. 덕분에 더욱 우아한 함수형 코드가 작성 가능하다. 


### 맺음
전체 코드는 아래와 같다. 다음 글에서 Control 부분을 완성할 예정이다.

```javascript
var base_arr = [], i = 0;

while (++i < 76) base_arr.push(i);

function find_idx(n) {
  var i = 4;
  if (n <= 15) i = 0;
  else if (n <= 30) i = 1;
  else if (n <= 45) i = 2;
  else if (n <= 60) i = 3;
  return i;
}

function make_bingo(arr) {
  return arr.reduce(function(o, n) {
    var i = find_idx(n);
    return o[i].push(n), o;
  }, [[],[],[],[],[]])
}

function reduce_first_5(arr) {
  return arr.reduce(function(l, v, i) {
    return l[i] = _.first(v, 5), l;
  }, [])
} // var reduce_first_5 = _.reduce((l, v, i) => (l[i] = _.first(v, 5), l), []);

function make_user_data(arr) {
  var rand_arr = _.shuffle(arr);
  return reduce_first_5(make_bingo(rand_arr));
} // var make_user_board = _.pipe(_.shuffle, make_bingo, reduce_first_5);

var table_template = _.template('data', `
    table
      tr
        th B
        th I
        th N
        th G
        th O {{ _.go(data, `, _.template.each('d1', `
      tr {{ _.go(d1, `, _.template.each('d2',`
        td {{d2}}
      `),`)}}`),
  `)}}
  `);

var make_bingo_table = _.pipe(_.unzip, table_template, D.el);

var make_user_board = _.pipe(make_user_data, make_bingo_table, D.appendTo('.user_board'));

var make_admin_board = _.pipe(make_bingo, make_bingo_table, D.appendTo('.admin_board'));
```