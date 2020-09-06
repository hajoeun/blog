---
title: '자바스크립트로 블록체인 - mining'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - blockchain
  - 블록체인
date: 2018-06-25 00:00:00
description: 자바스크립트로 블록체인을 구현해보자
slug: block-chain-js-1
---
_자바스크립트로 블록체인을 구현해보자_

__\*주의: 해당 글은 대략적인 구조를 설명함으로 실제 암호화폐의 구현과 다를 수 있습니다.__

## 구현

오늘은 [지난 시간](/programming/block-chain-js/)에 설명한 기본 개념과 데이터 구조를 골자로 블록을 채굴하는 함수를 구현해보겠습니다. 노드(Node.js) 환경에서 구현하고 ES6 문법을 사용합니다. 암호화 알고리즘으로 SHA256을 사용하고 해당 함수를 가져오기 위해 [crypto-js](https://www.npmjs.com/package/crypto-js)라는 패키지를 사용합니다. (설치 방법은 생략하겠습니다.)

아래의 코드에 오늘 이야기할 모든 내용이 있습니다. 해쉬 값을 계산하는 `calculate_hash` 함수와 이를 사용하여 블록을 채굴하는 `mining` 함수입니다.

```javascript
const { SHA256 }  = require('crypto-js');

function calculate_hash(block) {
  let { previousHash, timestamp, transactions, nonce } = block;
  return SHA256(previousHash + timestamp + JSON.stringify(transactions) + nonce).toString();
}

function mining(previousHash, timestamp, transactions, diff) {
  let block = { previousHash, timestamp, transactions, nonce: 0 };
  block.hash = calculate_hash(block);

  while (block.hash.substring(0, diff) !== Array(diff + 1).join('0')) {
    block.nonce++;
    block.hash = calculate_hash(block);
  }

  return block;
}
```

#### SHA256
찬찬히 살펴보죠. 우선 해시함수인 `SHA256`을 가져왔습니다. 이 함수에게 문자열을 전달하면 16진수로 표현된 해시값을 반환합니다. [웹 사이트](https://passwordsgenerator.net/sha256-hash-generator/)에서 테스트 해볼 수도 있습니다. 이렇게 만들어진 값은 유니크한 값으로 블록의 고유한(unique) 주소 값이 됩니다. 하지만 진짜 고유한 값이 되려면 전달하는 문자열이 고유해야합니다. 같은 문자열을 넣으면 같은 해시값을 반환하기 때문이죠.

#### calulate_hash
`calculate_hash` 함수를 살펴보면 어떻게 고유한 값을 만드는지 알 수 있습니다. 이전 블록의 해시값(`previousHash`)과 현재 블록이 생성되는 시간(`timestamp`), 거래내역(`transaction`) 그리고 난스(`nonce`)를 조합해서 고유한 값을 만들어냅니다. 거래내역은 배열의 형태이기 때문에 `JSON.stringify`를 이용해 문자열로 치환합니다. 해시함수가 반환하는 값도 문자열로 바꿔 반환하면 우리가 원하는 해시값이 됩니다.

#### mining
채굴을 위해 사용되는 `mining` 함수는 이전 블록의 해시값, 시간, 거래내역, 난이도(`diff`)를 인자로 받습니다. 그리고 해당 값과 난스, 해시값을 합쳐 블록(`block`)을 만들어둡니다. 블록은 반복적인 해시값 계산을 통해 난이도를 통과하면 최종적으로 반환됩니다.

while 문의 조건을 살펴보면 해시값의 앞자리 수가 난이도 만큼의 0을 갖는지 확인합니다. 난이도가 2라면 해시값은 '00A123...'과 같은 형태가 되어야 한다는 뜻이죠. 속을 살펴보면 난스를 하나씩 증가시켜 반복적으로 해시값을 계산하는 것을 확인할 수 있습니다. 이렇게 반복 계산을 통해 원하는 값을 발견하면 while 문을 벗어납니다. 이렇게 난스를 증가시켜가며 난이도에 맞는 해시값을 발견하는게 바로 __'채굴'__입니다. 참 쉽죠?

## 테스트

실제로 함수를 돌려보면 아래와 같은 결과를 만듭니다. 159회의 시도(nonce)를 통해 해시값을 발견하고 블록을 만들어냈군요!

```javascript
console.log(mining('', new Date(), [{ adam: -10, eve: 10 }], 2));

//  { previousHash: '',
//    timestamp: 2018-06-25T03:25:01.985Z,
//    transactions: [ { adam: -10, eve: 10 } ],
//    nonce: 159,
//    hash: '006a918403e96e3545c8dfa58d360a6e6dd284e8ca74c2a81228243b2e45a1c0' }
```

오늘의 코드는 [Github](https://github.com/joeunha/block-js/blob/master/v01.js)에서 확인하실 수 있습니다. 다음 시간에는 체인에 추가하는 과정을 구현해겠습니다.
