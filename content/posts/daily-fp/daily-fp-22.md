---
title: '오늘의 함수 - match'
date: 2019-06-17 20:00:00
categories:
  - programming
tags:
  - javascript
  - 오늘의 함수
  - 함수형 프로그래밍
  - 조건문 함수
description: match는 조건에 맞는 함수를 실행하는 함수를 만듭니다.
slug: daily-fp-match
---
_오늘 발견한 재미있는 함수를 소개합니다_

## match

오늘 다뤄볼 함수는 [몇번 다룬 적 있는 조건문 함수](/tags/조건문-함수/) 중 하나인 `match` 함수 입니다. 다른 조건문 함수보다 특별한 지점을 갖진 않지만 시간이 지나 조금 다른 방식으로 구현하게 되어 오늘의 함수로 소개드려보고자 합니다. 본문을 이해하기 위해선 함수를 합성하는 함수인 [`pipe`](/programming/javascript-daily-function-5/)나 다수의 함수를 연속적으로 실행시키는 함수에 대한 이해가 필요합니다.

#### (1) 어제의 함수

예시를 설명하기 위해 장황한 컨텍스트를 설명하기 보다 함수만을 보여드리는게 좋을 것 같아 바로 `match`를 사용하지 않는 경우를 보여드리겠습니다. `match` 함수가 필요한 상황입니다.

```javascript
switch (parseInt(input_value)) {
  case 1:
    action3(action2(action1(value)));
    break;
  case 2:
    action3(action2(action1(value)));
    break;
  default:
    action4(value);
    return;
}
```

예제코드는 사용자로부터 특정한 값(`input_value`)을 전달 받고 이에 대해 몇가지 액션을 취하는 동작(`action`)을 합니다. switch-case 구문은 그 자체로 가독성이 좋은 코드입니다. 하지만 오늘 집중하고 싶은건 `pipe` 같은 합성 함수에서 조건문 함수를 사용하는 방식입니다. 만약에 함수를 합성하는 파이프라인 안에서 위의 코드를 삽입하면 아래와 같이 처리하게 됩니다.

```javascript
const pipeline = pipe(
  parseInt,
  value => {
    switch (value) {
      case 1:
        action3(action2(action1(value)));
        break;
      case 2:
        action3(action2(action1(value)));
        break;
      default:
        action4(value);
        return;
    }
  }
);

pipeline(input_value);
```

모양새나 가독성이 나쁘지 않습니다. 하지만 모든걸 함수로 표현하고 싶은 욕심이 드는군요! 오늘의 함수로 구현해볼까요?

#### (2) 오늘의 함수

```javascript
const pipeline = pipe(
  parseInt,
  match
    .case(1)(action1, action2, action3)
    .case(2)(action1, action2, action3)
    .default(action4)
);

pipeline(input_value);
```

위와 같이 표현할 수 있습니다. `match` 함수는 `case`와 `default`라는 메서드를 가진 함수네요. 그리고 `case`는 연속해서 실행하면서 조건에 맞으면 실행할 함수들을 넣어주고 있습니다. 군더더기 없이 깔끔하게 표현되는 것 같네요. 그럼 구현은 어떻게 했을까요? 아래의 코드를 살펴보겠습니다. 오늘의 구현은 위에서 아래로 읽지 마시고 주석으로 표기된 순서대로 살펴보시면 이해가 쉽습니다!

**구현체 톺아보기 1**
```javascript
const match = (function self(input) { // [1] self 함수가 선언됩니다. input을 인자로 받는군요!
  const init = () => {
    self.actions = {};
    self.case = condition => (...fns) => { // [5] case 메서드를 self 함수에 달아주네요.
        self.actions[condition] = fns;
        return self;
    };
    self.default = (...fns) => { // [6] default도 마찬가지구요.
        self.actions.__default__ = fns;
        return self;
    };
  };

  if (input === undefined) { // [3] 아무런 값이 들어오질 않았으니 여기에 걸립니다.
    init(); // [4] 뭔갈 초기화 해주고 있네요?
    return self; // [7] 그리곤 자신을 반환합니다.
  }

  if (input && self.actions[input]) { // 아직은 보지 않으셔도 괜찮습니다.
    const matarials = [input, ...self.actions[input]];
    const result = matarials.reduce(call);
    init();
    return result;
  } else if (input && !self.actions[input]) {
    const matarials = [input, ...self.actions.__default__];
    const result = matarials.reduce(call);
    init();
    return result;
  }
})(); // [2] 오잉? 함수가 바로 실행됩니다! 아무런 값도 넘겨주지 않았어요.
```

여기까지 잘 따라오셨나요? 1번부터 7번까지 거치며 `match` 함수를 생성했습니다. 즉시 실행한 결과를 통해 `self` 함수가 반환됐죠. 이 결과로 `const match = self;`가 된 상황입니다. 다만 이 `match`는 `self` 내부에 선언된 `init` 함수를 통해 몇가지 값을 가진 상태가 되었습니다. 이 상황에서 실제로 `match`를 사용하게 되면 어떤 일이 벌어지는지 살펴보죠. 제일 아래에 실행부로 스크롤을 내려서 시작하세요. 이번에도 순서대로 따라오시면 됩니다.

**구현체 톺아보기 2**
```javascript
const match = (function self(input) {
  const init = () => {
    self.actions = {};
    self.case = condition => (...fns) => { // [3] 내부를 살펴보죠. 아닛, case는 함수를 반환하는 함수였네요!
        self.actions[condition] = fns; // [4] 아! fns는 아래에서 선언한 action1, action2, action3를 담은 배열이군요.
        // [4-1] 이 배열을 self가 가진 객체인 actions라는 곳에 담아두고 있네요.
        // [4-2] 키 값이 처음 case를 실행할때 전달된 값(condition)이라는 점을 눈여겨보세요.
        return self; // [5] 다시 자기 자신을 반환하는군요.
    };
    self.default = (...fns) => { // [8] 음... 이건 case와 조금 다르네요.
        self.actions.__default__ = fns; // [9] 바로 action4를 __default__라는 키의 값으로 담습니다.
        return self; // [10] 이번에도 자기 자신은 반환하는군요!
    };
  };

  if (input === undefined) {
    // ...
  }

  if (input && self.actions[input]) { // 지금도 때가 아니군요.
    const matarials = [input, ...self.actions[input]];
    const result = matarials.reduce(call);
    init();
    return result;
  } else if (input && !self.actions[input]) {
    const matarials = [input, ...self.actions.__default__];
    const result = matarials.reduce(call);
    init();
    return result;
  }
})();


const pipeline = pipe(
  parseInt,
  match // [1] match는 바로 메서드인 case를 부르는군요.
    .case(1)(action1, action2, action3) // [2] 오호, case가 두번 연속 실행됐습니다. 어떤 일이 일어난걸까요?
    .case(2)(action1, action2, action3) // [6] 2번부터 5번까지 한번 더 수행합니다. 이제 self.actions는 두개의 키를 갖겠죠?
    .default(action4) // [7] 여기선 어떤 일이 벌어질까요?
);

pipeline(input_value);
```

쉽지 않으셨을 것 같습니다. 1번부터 무려 10번까지 달려오셨습니다. 복잡한 로직을 잘 따라오고 계시다면 정말 대단하신겁니다. 어렴풋이 내용이 이해가 가셨다면 한번 보세요. 지금 10번에서 반환한 값이 `self`였습니다. 무슨 일이 벌어진걸까요?

```javascript
const pipeline = pipe(
  parseInt,
  self // default까지 실행되면 이 자리에 self만 남습니다.
  // match
  //   .case(1)(action1, action2, action3)
  //   .case(2)(action1, action2, action3)
  //   .default(action4)
);
```

**"default까지 실행되면 이 자리에 self만 남습니다."** 이게 무슨 말이죠? 왜 다시 `self`가 남은건가요. 처음 선안한 `self`와 지금의 이 함수는 어떻게 다른거죠? 두 함수는 같은 로직을 갖지만 재료가 다릅니다. 마지막에 남은 `self`는 **조건(condition)과 조건에 따른 행동(action)을 알고 있는 상태의 함수입니다.** 이 함수에게 이제 어떤 값이 들어오면 그 값에 따라 특정 행동(action)을 할 준비가 된 상황이죠. 이 상태는 `match.case`, `match.default`를 통해 `self.actions`에 저장되어 있습니다. 이해가 되셨나요? 이제 마무리를 지어보죠!

**구현체 톺아보기 3**
```javascript
const call = (x, f) => f(x); // [7-1] 인자와 실행할 함수를 전달하면 함수에 인자를 넣어 실행합니다.

const match = (function self(input) { // [3] 이제는 input을 가지고 왔을겁니다. (parseInt의 결과값)
  const init = () => {
    // ...
  };

  if (input === undefined) {
    // ...
  }

  if (self.actions[input]) { // [4] 만약에 input 값에 해당하는 키가 존재하면 여기를 거칩니다.
    const matarials = [input, ...self.actions[input]]; // [6] 우리가 가진 재료들을 모아 (이때는 조건에 맞는 함수들)
    const result = matarials.reduce(call); // [7] 결과를 만들어냅니다!
    init(); // [8] 다음에 또 match 함수를 사용하기 위해 초기화를 해줍니다.
    return result; // [9] 결과를 반환하면 끝입니다.
  } else if (!self.actions[input]) { // [5] 아니라면 여기겠죠!
    const matarials = [input, ...self.actions.__default__];
    const result = matarials.reduce(call);
    init();
    return result;
  }
})();

const pipeline = pipe(
  parseInt,
  match // [2] 코드가 실행되는 상황에 이 자리는 self 함수가 차지하고 있습니다.
    .case(1)(action1, action2, action3)
    .case(2)(action1, action2, action3)
    .default(action4)
);

pipeline(input_value); // [1] 합성해둔 함수가 실행됩니다.
```

어떠셨나요? 이번 함수는 제법 길고 복잡해서 설명을 주석으로 장황하게 적었습니다. 다소 여러우셨을 것 같습니다.

여기까지 이 글을 꼼꼼하게 보셨든 쓰윽 보셨든 아마 이런 생각이 드실겁니다. _"함수형 이거... 이렇게까지 (복잡하고 어렵게) 해야하는거야?"_ 제 생각이 정답은 아니지만, _이렇게까지 하실 필요는 없습니다._ 사실 순수하게 로직만 남은 작은 함수를 조합해서 프로그래밍하는게 함수형이지 이런 복잡한 함수의 내부를 들여다보는게 함수형 프로그래밍은 아닙니다. **다만 라이브러리로 구현된 함수만을 사용해 우리가 원하는 것을 온전히 구현해내지 못할 가능성이 큽니다. 때문에 조금 복잡한 함수(순수 함수)를 직접 만들고 뜯어보는 역량이 고급 함수형 프로그래밍에 지대한 영향을 끼친다고 생각합니다.** 그러한 연고로 이렇게 복잡한 코드를 구현해봤습니다. 어떻게 느끼셨을지 모르지만, "이거 제법 재밌네" 하는 정도의 느낌을 가져가셨으면 좋겠습니다.

긴 글 읽고 따라와주셔서 감사합니다! 다음에 또 뵙겠습니다.
