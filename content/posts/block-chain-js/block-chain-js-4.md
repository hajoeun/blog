---
title: '자바스크립트로 블록체인 - is_chain_valid'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - blockchain
  - 블록체인
date: 2018-07-02 00:00:00
description: 자바스크립트로 블록체인을 구현해보자
slug: block-chain-js-4
---
_자바스크립트로 블록체인을 구현해보자_

__\*주의: 해당 글은 대략적인 구조를 설명함으로 실제 암호화폐의 구현과 다를 수 있습니다.__

## 구현

지금까지 [블록의 구조를 살펴보는 것](/programming/block-chain-js/)으로 시작해 [채굴](/programming/block-chain-js-1/), [블록 추가](/programming/block-chain-js-2/), [거래 생성](/programming/block-chain-js-3/)과 관련된 코드를 구현했습니다. 오늘은 체인의 유효성을 검사하는 함수를 만들겠습니다. 이를 통해 거래 내역등의 변경을 감지해보도록 하겠습니다. 구현은 아래와 같이 합니다.

```javascript
const every = (coll, fn) =>
  Array.isArray(coll) ? coll.every(fn) : keys(coll).every(key => fn(coll[key], key, coll));

function is_chain_valid(chain) {
  return every(chain, block => {
    const previous = chain[block.previousHash];
    if (block.hash !== calculate_hash(block)) return false;
    if (block.previousHash === '') return true; // Genesis Block
    if (block.previousHash !== calculate_hash(previous)) return false;
    return true;
  });
}
```

#### every

쉽게 생각해서 체인에 얽혀있는 __모든 블록을 순회하며 문제가 없는지 확인__하는게 오늘의 주요 과제입니다. 이때 제격인 함수가 [`every`라는 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/every)입니다. 원래 Array의 메서드로 존재하는 이 함수를 객체인 `G.CHAIN`도 순회할 수 있도록 하기 위해 `every`와 같은 함수로 만들어줍니다. 이를 이용해서 `is_chain_valid`를 구현합니다.

#### is_chain_valid

우리가 확인해야할 내용은 크게 두가지 입니다.
1. 현재의 블록이 유효한지
2. 이전 블록과 잘 연결되어 있는지

현재의 블록이 유효한지 확인하기 위해 해시값을 다시 계산해봅니다. 채굴하면서 생성한 해시값과 일치하지 않는다면 문제가 생긴 것으로 간주합니다. 그리고 지금 알고 있는 이전 블록의 해시값(`previousHash`)을 기반으로 블록을 찾고 마찬가지로 해시값을 다시 계산해서 유효성을 확인합니다. 만약 이전 블록의 해시값이 없다면 제네시스 블록이라고 간주합니다.


## 테스트

이전에 생성된 블록이 있다는 가정해에 아래와 같이 테스트해볼 수 있습니다. 특정 거래의 금액을 조정하면 아래와 같이 유효성 검사에 통과하지 못합니다.

```javascript
let hash_key = keys(G.CHAIN)[1];

console.log('[ Before ]\n Chain Valid: ', is_chain_valid(G.CHAIN)); // true
console.log('Transactions: ', G.CHAIN[hash_key].transactions, '\n');

G.CHAIN[hash_key].transactions[1].amount = 0; // 거래를 조작

console.log('[ After ]\n Chain Valid: ', is_chain_valid(G.CHAIN)); // false
console.log('Transactions: ', G.CHAIN[hash_key].transactions);
```

오늘의 코드는 [Github](https://github.com/joeunha/block-js/blob/master/v04.js)에서 확인하실 수 있습니다. 다음 시간부터는 각 기능을 조금씩 고도화 해보겠습니다.


## 사소한 라이브러리

구현부에서 살펴본 것처럼 `every` 같은 함수를 몇개 만들어두면 객체도 순회하며 원하는 일을 할 수 있습니다. 이를 위해 사용할 수 있는 라이브러리가 있지만 간단한 내용을 처리함으로 직접 만들어 사용하려고 합니다. functions.js라는 이름으로 파일을 만들고 함수 모음을 만들어 필요할때마다 꺼내서 사용하려고 합니다. 해당 코드는 [Github](https://github.com/joeunha/block-js/blob/master/lib/functions.js)에서 확인하실 수 있습니다.
