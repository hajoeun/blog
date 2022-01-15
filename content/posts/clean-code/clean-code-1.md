---
title: 클린 코드 - 협업을 위한 코드 2
categories:
  - programming
tags:
  - clean code
  - 클린 코드
description: 깨끗한 코드와 의미 있는 이름
date: 2020-01-15 20:00:00
slug: clean-code-1
---

[클린 코드를 주제로 했던 강의](https://speakerdeck.com/hajoeun/200107-ssafy)를 글로 정리합니다. (강의 내용과 글의 코드가 상이할 수 있습니다.)

---

## 클린 코드

[로버트 마틴(Robert C. Martin)](https://en.wikipedia.org/wiki/Robert_C._Martin)의 책을 통해 클린 코드를 알게 됐습니다. 협업을 잘하기 위해 회사에서 동료들과 함께 스터디를 진행했습니다. 이를 통해 배운 클린 코드에 대한 몇 가지 지식을 추려봤습니다. 간단한 예시와 실제 사례도 담았습니다.

### 깨끗한 코드
> 깨끗한 코드는 잘 쓴 문장처럼 읽힌다 - Grady Booch

![](/clean-code/code-quality-wtf.jpg)

위의 이미지는 클린 코드가 무엇인지 단적으로 표현하고 있습니다. 좋은 코드와 나쁜 코드를 판별하는 지표로 '분당 WTF의 횟수'를 사용할 수 있다고 말하고 있죠. WTF은 우리말로 표현하자면 "이건 뭐지...?" 정도가 되지 않을까 싶습니다. 코드를 읽는 중에 "이건 뭐지?"하고 이해하기 어려운 코드가 자주 나올수록 나쁜 코드라는 의미죠. 앞에 나온 예시를 다시 보겠습니다.

```js
evt1('#is_prime', ({ currentTarget }) => (
    rend(current.loans = has_c(currentTarget, 'all') ?
        current.loans.filter(loan => loan.is_prime) :
        origin.loans.sort(compare[current.sort_by]))
    && toggle_c(currentTarget, 'all')
));
```

곳곳에서 WTF을 외치게 되죠. 이 짧은 코드에 적어도 일곱 번은 이건 무슨 소릴까 하는 의문이 생길 겁니다. 명백히 나쁜 코드네요. 책에서 소개되는 대가 중 한 명인 [그래디 부치(Grady Booch)](https://en.wikipedia.org/wiki/Grady_Booch)는 **깨끗한 코드는 잘 쓴 문장처럼 읽힌다**고 말합니다. 예시를 잘 쓴 문장처럼 바꾸면 어떻게될까요?

```js
on_click("#is_prime", ({ currentTarget }) => {
  const has_class_all = has_class(currentTarget, "all");

  if (has_class_all) {
    const is_prime = loan => loan.is_prime;
    const filtered_loans = current.loans.filter(is_prime);

    set_state({ loans: filtered_loans });
  } else {
    const compare_function = compare_functions[current.sort_by];
    const sorted_loans = origin.loans.sort(compare_function);

    set_state({ loans: sorted_loans });
  }

  render(current.loans);
  toggle_class(currentTarget, "all");
});
```

'all' 클래스를 가졌다면 현재 데이터(current.loans) 중에서 필터링해 랜더링 하고, 그렇지 않다면 기존 데이터(origin.loans)를 정렬해 랜더링 하고 있습니다. 확실히 이제는 문장처럼 읽힙니다.

### 의미 있는 이름
> 의도를 분명하게 밝혀라 - Robert C. Martin

이번에는 실제 코드 리뷰 중에 있었던 사례를 살펴보겠습니다. 여기 `clearEmptyKey`라는 함수가 있습니다. `undefined` 혹은 `null`을 빈 값(empty)으로 보고 지워버리는 함수입니다. (함수 선언부 내에 사용되는 함수는 [immutable.js에서 제공하는 함수](https://immutable-js.github.io/immutable-js/docs/#/Collection/filter)입니다.)

```js
const clearEmptyKey = data => (
  Map(data).filter(item => (
    item !== undefined && item !== null
  )).toObject()
);

const userInfo = {
  id: 90,
  name: "hajoeun",
  gender: null
};

console.log(clearEmptyKey(userInfo));
// { id: 327, name: "hajoeun" }
```

기존에 준비되어 있던 이 함수를 활용해서 PR을 날렸고 리뷰가 시작됐습니다. 해당 함수의 이름에 대해 의문이 제기됐습니다.

<img src="/clean-code/code-review-0.png" style="border-radius: 4px; width: 100%;"/>

함수의 의도가 분명하게 드러나지 않은 상황이었죠. 실제 함수의 의도를 댓글로 설명하며 더 좋은 이름을 찾기 시작합니다.

<img src="/clean-code/code-review-1.png" style="border-radius: 4px; width: 100%;"/>

새로운 함수의 이름을 제안하고 근거를 제시했습니다. 실제로 [underscore와 같은 라이브러리에서 compact](https://underscorejs.org/#compact)는 무의미한 값(falsy)을 제거하는 함수로 사용됩니다.

<img src="/clean-code/code-review-2.png" style="border-radius: 4px; width: 100%;"/>

각자의 생각을 공유하며 의미있는 이름을 도출해가고 있습니다. underscore에서와 같이 compact로만 이름을 짓기 어려운 이유는 대상이 되는 값의 타입이 다양할 수 있기 때문입니다. 저는 이를 추상화 레벨이 너무 높다고 표헌하고 있네요.

<img src="/clean-code/code-review-3.png" style="border-radius: 4px; width: 100%;"/>

이에 동료들이 동의하는 뜻을 표합니다. 제시한 함수의 이름이 제 의도를 드러낸다고 동의한 것이죠. 타입 앞에 `compact-`라는 접두사를 붙여 함수 이름을 지어 시리즈로 함수를 만들기로 했습니다.

```js
const compactObject = data => (
  Map(data).filter(item => (
    item !== undefined && item !== null
  )).toObject()
);

const compactString = data => (
  data.replace(/ /g, '')
);

const compactValues = data => (
  Map(data)
    .map(item => (
      typeof item === 'string' ? compactString(item) : item)
    )).toObject()
);
```

이처럼 함수는 의도를 분명히 밝혀야합니다. 리뷰를 통해 clear 대신 compact라는 이름을 사용해서 의도를 분명하게 했죠. 이제 compact로 시작하는 함수를 보면 그 의도를 쉽게 알아차려 코드를 문장처럼 읽을 수 있습니다. **의미 있는 이름은 의도를 분명히 드러내 팀을 코드만으로 소통하게 만듭니다.**

---

[다음 글](/clean-code-2)은 함수와 주석 그리고 오류 처리에 대해 다룹니다.
