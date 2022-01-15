---
title: '자바스크립트로 블록체인 - add_block'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - blockchain
  - 블록체인
date: 2018-06-26 00:00:00
description: 자바스크립트로 블록체인을 구현해보자
slug: block-chain-js-2
---
_자바스크립트로 블록체인을 구현해보자_

__\*주의: 해당 글은 대략적인 구조를 설명함으로 실제 암호화폐의 구현과 다를 수 있습니다.__

## 선언

[지난 시간](/programming/block-chain-js-1/)에 해시값을 구하는 함수와 블록을 채굴하는 함수를 구현했습니다. 오늘은 블록을 체인에 추가하는 함수 `add_block`를 구현해보겠습니다. 더불어 블록의 유효성을 검사하는 함수(`is_block_valid`)와 보상을 주는 함수(`reward_to`)도 만들어볼까 합니다.

우선 블록체인 환경에서 공통으로 사용할 변수들을 선언합니다. 다양한 방법이 가능하지만 저는 노드(Node.js) 환경의 전역 변수인 `global`에 몇가지 변수들을 아래와 같이 선언하기로 했습니다.

```javascript
let G = typeof window == 'object' ? window : global;

G.CHAIN = {};
G.DIFF = 2;
G.HEAD = '';
G.USERS = {
  '0001': { name: 'A', balance: 70 },
  '0002': { name: 'B', balance: 50 },
  '0003': { name: 'C', balance: 110 }
};
```

#### G
굳이 전역 변수임을 명시하지 않고도 전역에 붙여서 사용할 수 있지만 혼란을 방지하기 위해 `G`라는 키워드를 사용하기로 했습니다. 그리고 여기에 붙는 값을 대문자로 표기합니다. `DIFF`는 난이도입니다. `HEAD`는 가장 최근에 만들어진 블록의 해시값입니다. `USERS`는 블록체인에 참여한 노드(user)들의 정보를 담고 있습니다. 키 값은 주소에 해당하는 값이고 각각의 노드는 이름(`name`)과 잔액(`balance`) 정보를 가지고 있습니다.

`CHAIN`이 블록을 담을 객체입니다. 배열로 선언하지 않은 이유는 블록 자체가 순서대로 정렬되지 않아도 찾을 수 있다는 걸 보다 쉽게 표현하기 위함입니다. 배열로 생성될 때마다 push 메서드로 넣어주면 편하지만 해시값으로 이전 블록을 추적하는 재미(?)가 덜합니다.

__이때 `G`는 해당 블록체인을 만들어가는 모든 노드가 공유하고 있다고 생각해주세요.__


## 구현

앞서 선언한 전역 변수(`G`)를 사용해서 `add_block` 함수를 아래와 같이 구현할 수 있습니다.

```javascript
function is_block_valid(block) {
  if (block.hash.substring(0, G.DIFF) !== Array(G.DIFF + 1).join('0')) return false;
  return calculate_hash(block) === block.hash;
}

function add_block(block) {
  if (!is_block_valid(block)) return false;
  G.CHAIN[block.hash] = block;
  G.HEAD = block.hash;
  return true;
}

function reward_to(address) {
  return function(is_success) {
    if (is_success) {
     G.USERS[address].balance += G.DIFF * 10;
     G.DIFF++;
    }
  }
}
```

#### is_block_valid
생성된 블록이 유효한지 검사하기 위해서는 블록이 가진 해시값(hash)이 제대로 계산된 것인지 확인해야 합니다. 실제로 블록체인에서는 이 과정을 다른 노드들이 수행합니다. 채굴에 성공했다고 주장하는 A라는 노드가 실제로 채굴에 성공한 것이 맞는지 다른 노드(B,C,D...)가 확인하는 절차인 것이죠.

이를 위해,
1. 발견한 해시값이 난이도(`G.DIFF`)에 부합하는지
2. 발견한 난스(nonce)가 제대로된 해시값을 만들어내는지

확인합니다.

#### add_block
유효성 검사를 통과한다면 블록을 체인에 추가합니다. 이때 해당 블록의 해시값을 키로 줍니다. 그것만이 유니크한 값이기 때문이죠. 그리고 `G.HEAD`를 갱신합니다. 이제 가장 최신의 노드는 현재 생성된 노드입니다. 블록 추가 성공 여부(true/false)를 반환합니다.

#### reward_to
주소값을 인자로 받고 블록 추가 성공 여부(`is_success`)를 확인한 뒤 보상을 주고 난이도를 조정합니다. 이때 함수가 함수를 반환하는 것을 확인할 수 있는데, [처음](/programming/block-chain-js/)에 예고드린 것처럼 제 방식으로 풀어내기 위함입니다. [`go` 함수](/programming/functional-js-study/#5-go)를 사용해서 보상 받을 노드를 설정하는 방식을 써볼까 합니다.

난이도를 조정하는 부분은 실제 블록체인에서는 훨씬 고상하고 어려운 방법을 취합니다. 비트코인의 경우 채굴에 성공하기까지의 시간을 계산해서 너무 빨랐으면 난이도를 올리고 너무 느렸으면 난이도를 낮춘다고 합니다. 우선 저는 단순하게 블록이 추가될 때마다 난이도를 올리겠습니다.


## 테스트

함수를 합성해서 즉시 실행하는 `go` 함수와 조합하여 아래와 같이 테스트할 수 있습니다. 성공적으로 체인에 블록을 추가하고 보상도 이루어졌죠.

```javascript
const go = (seed, ...fns) => fns.reduce((res, f) => f(res), seed);
const MY_ADDRESS = '0001';

go(mining(G.HEAD, new Date(), [{ A: -10, B: 10 }], G.DIFF),
  add_block,
  reward_to(MY_ADDRESS),
  () => console.log('Block Chain: ', G.CHAIN),
  () => console.log(`${MY_ADDRESS}'s Balance:`, G.USERS[MY_ADDRESS].balance));

// Block Chain:  { '0047ba9d3380fe143b0eeb8b1216c99ebd69f7350732b81167cfd06c8d2356a7':
//    { previousHash: '',
//      timestamp: 2018-06-26T10:08:35.977Z,
//      transactions: [ [Object] ],
//      nonce: 138,
//      hash: '0047ba9d3380fe143b0eeb8b1216c99ebd69f7350732b81167cfd06c8d2356a7' } }
// 0001's Balance: 90
```

오늘의 코드는 [Github](https://github.com/hajoeun/block-js/blob/master/v02.js)에서 확인하실 수 있습니다. 다음 시간에는 보다 많은 블록을 생성해보고 거래(transaction)를 관리하는 함수를 만들어 보겠습니다.
