---
title: 클린 코드 - 협업을 위한 코드 3
categories:
  - programming
tags:
  - 클린 코드
description: 함수와 주석 그리고 오류 처리
date: 2020-01-17 20:00:00
slug: clean-code-2
---

[클린 코드를 주제로 했던 강의](https://speakerdeck.com/hajoeun/200107-ssafy)를 글로 정리합니다. (강의 내용과 글의 코드가 상이할 수 있습니다.)

---

#### 클린 코드

[로버트 마틴(Robert C. Martin)](https://en.wikipedia.org/wiki/Robert_C._Martin)의 책을 통해 클린 코드를 알게 됐습니다. 협업을 잘하기 위해 회사에서 동료들과 함께 스터디를 진행했습니다. 이를 통해 배운 클린 코드에 대한 몇 가지 지식을 추려봤습니다. 간단한 예시와 실제 사례도 담았습니다.

<br/>

##### 함수와 주석
> 프로그래밍은 여느 글짓기와 비슷하다 - Robert C. Martin

함수는 코드를 문장처럼 읽히게 하는데 가장 큰 역할을 합니다. 간단한 사례를 통해 프로그래밍이 글짓기와 비슷해질 수 있는 이유를 살펴보겠습니다.

```tsx
const renderSubFigure = subFigure => (
  subFigure && <figure>{ subFigure }</figure>
);
```

간단한 컴포넌트를 그려주는 함수입니다. 여기서 포인트는 `data`의 존재 여부에 따라 엘리먼트를 그릴지 말지 검사하는 부분입니다. `&&` 연산자를 이용해 값이 참으로 평가되어 존재한다고 판단되면 `<figure>`를 그리도록 하고 있죠. 이에 대해서도 리뷰가 남습니다.

<img src="/images/code-review-4.png" style="border-radius: 4px; width: 100%;"/>

조금 더 명시적으로 변경했으면 좋겠다는 리뷰입니다. 명시적이란 표현은 '내용이나 뜻을 분명하게 드러내 보이는. 또는 그런 것'이라고 사전에서 정의하고 있습니다. 어찌 보면 의미 있는 이름을 짓는 것과 같은 내용이네요. 동료인 리뷰어는 `!!`를 사용하거나 `optional` 함수를 사용하길 제안합니다. 제안을 받아들이고 코드를 개선했습니다.

```tsx
// !!를 사용해 참/거짓을 평가하고 있음을 명시적으로 드러냄
const renderSubFigure = subFigure => (
  !!subFigure && <figure>{ subFigure }</figure>
);
```

```tsx
// optional을 사용해 값의 존재 유무에 따라 동작하는 코드임을 명시적으로 드러냄
const renderSubFigure = subFigure => (
  optional(subFigure, it => <figure>{ it }</figure>)
);
```

두 방법 모두 명시적으로 어떤 행위를 하는지 표현하고 있습니다. optional 함수에 대한 이해가 있다면 두번째 경우가 조금 더 읽기 좋은 코드가 될 것 같습니다. 함수를 하나만 더 사용한다면 더 명시적으로 표현할 수도 있죠.

```tsx
const renderFigure = it => <figure>{ it }</figure>;

const renderSubFigure = subFigure => (
  optional(subFigure, renderFigure)
);
```

`renderSubFigure` 함수 내부가 이제 이렇게 읽힙니다. "optional한 subFigure 값이 존재한다면 figure를 render 한다"

> 코드 자체가 글인데 주석은 왜 써야해?

함수만으로 코드를 명시적으로 풀어낼 수 있다면 주석이 필요 없습니다. 주석에 의존하기 시작하면 코드의 가독성이 떨어집니다. 주석 없이 코드만으로 이해 가능한 코드를 작성해야합니다. 따라서 주석 사용은 지양해야합니다. 서술적이고 명시적인 이름을 지어 주석 대신 코드로 이야기할 수 있는 코드가 좋은 코드입니다.

<br/>

##### 오류 처리
> 논리와 오류 코드를 뒤섞지 마라 - Robert C. Martin

로버트 마틴이 주장하는 논리와 오류 코드를 뒤섞지마라는 얘기는 비즈니스 로직에 집중할 수 있게 하라는 의미입니다. 비즈니스 로직, 유저에게 영향을 주는 코드에 온전히 집중할 수 있도록 그 외의 코드를 뒤섞지마라는 이 조언을 어떻게 받아드려야 할까요. 앞서서 [잘 쓴 문장처럼 읽히도록 바꿔둔 코드](/clean-code/#깨끗한-코드)에 로깅 코드를 추가해봄으로써 어떻게 이 조언을 실천할 수 있을지 확인해보겠습니다.

우리가 바꿔둔 아래의 함수는 유저가 필터를 적용할 때마다 실행되는 코드입니다. 어떤 필터가 적용했는지 로그를 남길 수 있는 코드를 추가해달라는 요구 사항을 반영하려면 어떻게 해야할까요?

```js
on_click("#is_prime", ({ currentTarget }) => {
  const has_class_all = has_class(currentTarget, "all");
  let filter_name = ''; // 1

  if (has_class_all) {
    const is_prime = loan => loan.is_prime;
    const filtered_loans = current.loans.filter(is_prime);

    filter_name = "prime_only"; // 2
    set_state({ loans: filtered_loans });
  } else {
    const compare_function = compare_functions[current.sort_by];
    const sorted_loans = origin.loans.sort(compare_function);

    filter_name = "all"; // 3
    set_state({ loans: sorted_loans });
  }

  console.log(filter_name); // 4
  render(current.loans);
});
```

이렇게 기존의 코드에 네 줄의 코드에 넣어서 원하는 로그를 남길 수 있습니다. 아주 쉽죠. 하지만 문제는 비즈니스 로직을 읽는 중에 흐름을 끊고 있다는 점입니다. "'all' 클래스를 가졌다면 현재 데이터(current.loans) 중에서 필터링하고, **필터 이름을 정해준다.** 그렇지 않다면 기존 데이터(origin.loans)를 정렬하고, **필터 이름을 정해준다.** 그리고 **로그를 남긴 뒤**, 랜더링한다." 코드를 읽는 중에 다른 논리가 계속 끼어들고 있죠. 두가지 논리가 뒤섞여 있습니다. 정리가 필요해보이네요.

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
  event_log(has_class_all); // 1
});

const event_log = has_class_all => {
  const filter_name = has_class_all ? "prime_only" : "all";
  console.log(filter_name);
}
```

이제는 기존 함수 내에 한 줄의 코드만 넣어서 원하는 바를 이루고 있습니다. 이렇게 읽을 수 있죠. "'all' 필터링 된 이후에, **그걸 기준으로 로그를 남기는구나**" 숨어든 논리가 밖으로 표현됩니다. 이제는 기능 추가나 디버깅을 할때도 고쳐야할 부분이 적어진 상황이죠. 논리가 분명해져서 읽기 좋은 코드가 됐습니다.

---

마지막 글은 클린 코드를 배우고 어떤 변화가 있었는지 그리고 클린 코드를 적용함에 있어 주의해야할 내용에 대해 다룹니다.
