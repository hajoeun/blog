---
title: 클린 코드 - 협업을 위한 코드 1
categories:
  - programming
tags:
  - clean code
  - 클린 코드
description: '야생 개발자, 클린 코드를 만나다'
date: 2020-01-13 20:00:00
slug: clean-code-0
---

[클린 코드를 주제로 했던 강의](https://speakerdeck.com/hajoeun/200107-ssafy)를 글로 정리합니다. (강의 내용과 글의 코드가 상이할 수 있습니다.)

---

## 야생 개발자
> Wild [waɪld]: animals or plants live or grow in natural surroundings and are not looked after by people.

사람들과 협업 경험이 적은 개발자, 그게 제 상황이었습니다. 문과 출신 개발자인 저는 개발에 입문하기 전엔 나름대로 문학소년이었죠. 그래서인지 처음 프로그래밍을 배우면서 ["프로그래밍, 이거 제법 문과스러운데? 🤔"](/like-me-2/#문과스러운-프로그래밍)라고 생각했었습니다. 문학소년 입장에서 문과의 꽃은 시라고 생각했습니다. 프로그래밍도 시 쓰듯 하는 게 좋은 게 아닐까 생각했죠.

### 멋진 코드는 함축적인 코드
시는 함축적인 의미를 담고 있는 경우가 많죠. 코드도 그래야 한다고 생각했습니다. 짧은 내용에 의미를 담으면 멋진 것으로 생각했죠.

```js
evt1('#is_prime', ({ currentTarget }) => (
    rend(current.loans = has_c(currentTarget, 'all') ?
        current.loans.filter(loan => loan.is_prime) :
        origin.loans.sort(compare[current.sort_by]))
    && toggle_c(currentTarget, 'all')
));
```

위의 코드에서처럼 짧은 변수명으로 설명해도 문제없다고 생각했습니다. 오히려 멋진 게 아닐까 생각했죠. 처음엔 어렵지만, 나중에 생각해보면 다 이해가 가니까요.

### 우아한 코드는 적당히 어려운 코드
시도 그렇습니다. 처음에는 이해가 가질 않죠. 이게 무슨 말인고 적당히 어려워하다가 어느 날 그 의미가 와닿습니다. 그 짜릿함이 코드에도 녹아들어야 한다고 생각했습니다.

```js
evt1('#is_prime', ({ currentTarget }) => (
    rend(current.loans = has_c(currentTarget, 'all') ?
        current.loans.filter(loan => loan.is_prime) :
        origin.loans.sort(compare[current.sort_by]))
    && toggle_c(currentTarget, 'all')
));
```

처음 나온 코드와 같은 코드입니다. `=`, `&&`가 적당한 어려움을 주고 있죠. 할당과 동시에 값을 함수에 넘기기도 하고 중괄호 없는 화살표 함수 내에서 두개의 동작을 하기도 하죠. 처음엔 알아보기 힘들지만 깨닫고 나면 제법 뭔가 있어보이는 코드. 그게 우아한 코드라고 생각했습니다.

### 깨끗한 코드는 짧고 예쁜 모양의 코드
앞선 코드들을 보시면 코드가 간결하고 전체 형태가 사각형 안에 들어오고 있습니다. 이런 형태의 코드가 좋은 코드라고 생각했습니다. 작은 사격형 안에 들어가면서 짧게 정리된 코드. 그게 바로 깨끗한 코드라고 생각했죠.

### 협업을 위한 코드
조금 어렵긴 해도 제가 여러분에게 설명드린 것처럼 옆에 있는 동료에게 설명하면 충분히 이해할 수 있는 코드니까 문제될거 없다고 생각했습니다. 사실 그렇지 않더군요. 항상 동료 옆에 붙어 있을 수 없을뿐더러. 기민하게 대응해야하는 상황에 위와 같은 코드는 실수할 여지가 많이 생긴다는걸 알게 됐습니다.

---

그렇다면 협업을 위한 코드, 클린 코드는 무엇을 강조하고 있을까요. [다음 글](/clean-code-1)에서 확인해보세요.
