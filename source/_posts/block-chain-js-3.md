---
title: '자바스크립트로 블록체인 - 구현3'
categories:
  - programming
tags:
  - javascript
  - 자바스크립트
  - blockchain
  - 블록체인
date: 2018-06-28 00:00:00
description: 자바스크립트로 블록체인을 구현해보자
---
_자바스크립트로 블록체인을 구현해보자_

__\*주의: 해당 글은 대략적인 구조를 설명함으로 실제 암호화폐의 구현과 다를 수 있습니다.__

## 선언

[지난 시간](/programming/block-chain-js-2/)에는 블록을 체인에 추가하고 채굴을 성공한 노드에게 보상을 주는 부분까지 구현했습니다. 오늘은 거래(transaction)를 관리하는 함수들을 구현해보겠습니다. 더불어 블록 체인의 유효성을 검사하는 함수도 만들어볼까 합니다.

우선 지난번과 마찬가지로 블록체인 환경에서 공통으로 사용할 변수를 선언하겠습니다. `G`는 블록체인을 만들어가는 모든 노드가 공유하고 있는 변수입니다.

```javascript
G.TRX = [];
```

#### G.TRX

거래 내역을 배열로 담고 있습니다. 거래 내역 하나는 객체로 생겼고 어떤 모양일지는 아래에서 살펴봅니다. 이 변수를 장부라고 이해하고 `G.LEDGER`라고 이름 지을까 고민했는데, 길이가 더 짧아서 지금처럼 가기로 했습니다. (`G.TRANSACTIONS`는 너무 길어서 축약했습니다.)

## 구현

이제 아래와 같이 거래를 생성하는 함수를 만들어볼 수 있습니다. 

```javascript
function transaction(fromAddress, toAddress, amount) {
  if (get_balance(fromAddress) >= amount)
    G.TRX.push({ fromAddress, toAddress, amount });
  return G.TRX;
}

function get_balance(address) {
  if (address === '0000') return 1000;
  return G.TRX.reduce((bal, trx) => {
    if (trx.fromAddress === address) bal -= trx.amount;
    if (trx.toAddress === address) bal += trx.amount;
    return bal;
  }, balance_from_chain(address));
}

function balance_from_chain(address) {
  return Object.keys(G.CHAIN).reduce((sum, key) =>
    G.CHAIN[key].transactions.reduce((bal, trx) => {
      if (trx.fromAddress === address) bal -= trx.amount;
      if (trx.toAddress === address) bal += trx.amount;
      return bal;
    }, sum), 0);
}
```

#### transaction
거래를 생성하는 이 함수는 거래 내역(`G.TRX`)에 새로운 거래를 추가하는 것을 목표로 합니다. 인자로 돈을 보내는 주소(`fromAddress`), 받는 주소(`toAddress`), 보내는 양(`amount`)를 받습니다. 받은 인자를 객체로 감싸 거래 내역에 넣어주면(push) 이 함수의 역할은 끝이 납니다. 다만 잔액이 보낼 양보다 많아야하겠죠. 이를 위해 `get_balance` 함수를 호출합니다.  

#### get_balance
이전에 생성된 거래 내역(`G.TRX`)을 주소값(`address`)으로 조회해서 잔액을 확인합니다. 보내는 입장이었다면 빼고 받는 입장이었다면 더합니다. 이 과정에 `reduce` 메서드를 사용했습니다. 해당 메서드는 첫번째 인자로 어떻게 값을 줄여나갈지 정하는 함수를 받고 두번째로는 어떤 값으로 시작할지 지정해주는 값을 받습니다. 이때 시작이 되는 값은 체인에서 조회한 잔액입니다. `balance_from_chain` 함수가 체인에서 잔액을 조회해주죠.

(이 함수에서 첫번째 줄은 주소값이 '0000'일 때 무조건 1000을 반환합니다. 이는 주소값 '0000'은 보상을 주는 노드라고 가정했기 때문입니다.)

#### balance_from_chain
체인에 기록된 거래 내역은 블록 단위로 돌면서 내부의 거래 내역(`transactions`)을 돌면서 잔액을 구해야합니다. 위와 같이 `reduce` 메서드를 중첩해서 사용하면 원하는 값을 얻을 수 있습니다. 화살표 함수와 중첩해서 사용하니 조금 복잡한듯 보입니다만 그리 어려운 내용은 아닙니다.

다만 아쉬운 점은 잔액을 조회하는 코드가 중복된다는 점입니다. 리팩토링할 필요가 있겠군요.


## 리팩토링

우선 중복되는 부분을 바깥으로 꺼내 함수로 만들려고 합니다. `sum_balance`라고 이름 지은 함수를 만들었습니다.

```javascript
function sum_balance(trx, init, address) {
  return trx.reduce((b, t) => {
    if (t.fromAddress === address) b -= t.amount;
    if (t.toAddress === address) b += t.amount;
    return b;
  }, init);
}
```

#### sum_balance
코드 전체를 축약하는 김에 변수명도 조금 짧게 줄였습니다. 앞글자만 남겨버렸네요. 인자를 보시면 배열인 거래 내역(`trx`)과 초기값(`init`), 주소값(`address`)을 받았습니다. 이 녀석들이 있으면 잔액을 구할 수 있습니다.    
 
덕분에 두 함수(`get_balance`, `balance_from_chain`)가 아래와 같이 간결해졌습니다.

```javascript
function get_balance(address) {
  if (address === '0000') return 1000;
  return sum_balance(G.TRX, balance_from_chain(address), address);
}

function balance_from_chain(address) {
  return Object.keys(G.CHAIN).reduce((sum, key) => sum_balance(G.CHAIN[key].transactions, sum, address), 0);
}
```

눈치채신 분들도 계시겠지만 잔액을 위와 같은 방법으로 조회하게되면 이전에 만들었던 `G.USERS` 변수가 필요 없습니다. 그러면 보상을 주는 함수([`reward_to`](/programming/block-chain-js-2/#reward-to))도 수정이 필요합니다.

```javascript
function reward_to(address) {
  return function(is_success) {
/* 변경 전 */
//     if (is_success) {
//       G.USERS[address].balance += G.DIFF * 10;
//       G.DIFF++;
//     }

/* 변경 후 */
    if (is_success) {
      G.TRX = [];
      transaction('0000', address, G.DIFF * 10);
      G.DIFF++;
    }
  }
}
```

#### reward_to
이전과 마찬가지로 고차 함수인 `reward_to` 함수는 주소값(`address`)을 인자로 받고 함수를 반환합니다. 이후 채굴 성공 여부(`is_success`)를 인자로 전달 받는 것까지 완전히 동일하지만 보상을 주는 방식이 다릅니다. 우선 기존의 거래 내역(`G.TRX`)을 초기화합니다. 그리고 거래를 발생시켜 채굴자의 잔액을 늘려 보상을 줍니다. 이 거래가 다음 블록의 첫번째 거래가 되는 것이죠. 이후 이전과 마찬가지로 난이도를 증가시키고 함수를 끝냅니다.


## 테스트

이제 아래와 같이 테스트 해볼 수 있습니다. 몇차례의 거래(잔액이 부족한 거래는 무시하죠.)가 일어나고 블록을 채굴합니다. 또 다시 거래가 일어나고 채굴을 합니다. 거래 내역(`transactions`)를 잘 보세요.

```javascript
const MY_ADDRESS = '0001';

transaction('0000', '0001', 100);
transaction(MY_ADDRESS, '0002', 20);
transaction(MY_ADDRESS, '0003', 30);
transaction(MY_ADDRESS, '0003', 300); // <-- 잔액 부족!

go(mining(G.HEAD, new Date(), G.TRX, G.DIFF),
  add_block,
  reward_to(MY_ADDRESS));

transaction('0003', MY_ADDRESS, 10);

go(mining(G.HEAD, new Date(), G.TRX, G.DIFF),
  add_block,
  reward_to(MY_ADDRESS),
  () => console.log('Block Chain:', G.CHAIN),
  () => console.log(`My Balance:`, get_balance(MY_ADDRESS)));

// Block Chain: { '005d4d146a89f67c0daaba4dd414d5086f051c968b12d985e157f773ed617fb6': 
//    { previousHash: '',
//      timestamp: 2018-06-28T05:27:49.102Z,
//      transactions: [ [Object], [Object], [Object] ],
//      nonce: 36,
//      hash: '005d4d146a89f67c0daaba4dd414d5086f051c968b12d985e157f773ed617fb6' },
//   '0004c4254f3ea25adb367c71244f7b0e4938d13245c8ea6603c1708020d88d14': 
//    { previousHash: '005d4d146a89f67c0daaba4dd414d5086f051c968b12d985e157f773ed617fb6',
//      timestamp: 2018-06-28T05:27:49.115Z,
//      transactions: [ [Object], [Object] ],
//      nonce: 4267,
//      hash: '0004c4254f3ea25adb367c71244f7b0e4938d13245c8ea6603c1708020d88d14' } }
// My Balance: 110
```

오늘의 코드는 [Github](https://github.com/joeunha/block-js/blob/master/v03.js)에서 확인하실 수 있습니다. 다음 시간에는 체인 유효성 검사를 해보겠습니다.