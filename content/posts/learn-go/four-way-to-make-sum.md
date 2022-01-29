---
title: Go로 sum을 만드는 네가지 방법
categories:
  - programming
tags:
  - Golang
date: 2020-02-12 22:00:00
description: for, range and variadic function
banner: ./images/preview.jpg
slug: four-way-to-make-sum
---

## 하나씩 더하기

우선 인자를 하나씩 전달 받아서 직접 더해줄 수 있습니다.

```go
func sum(a int, b int, c int) int {
  return a + b + c
}

fmt.Println(sum(1, 2, 3)) // 6
```

## 배열과 반복문 활용하기

하나씩 더해주는게 번거로우니 `for`를 사용할 수 있도록 배열을 사용할 수 있습니다. 배열의 길이를 확인하기 위해 `len` 함수도 사용해야 합니다. 배열은 Array라고 부르는 고정 배열과 Slice라고 부르는 동적 배열이 있습니다. 여기서는 고정 배열을 사용합니다.

```go
func sum(numbers [3]int) (total int) {
  number := 0
  for i := 0; i < len(numbers); i++ {
    number = numbers[i]
    total += number
  }
  return total
}

fmt.Println([3]int{1, 2, 3}) // 6
```

## 가변 인자 함수(variadic function) 활용하기

아무래도 더 많은 수를 더하려면 배열보다 좋은 방법이 필요합니다. [가변 인자 함수](https://gobyexample.com/variadic-functions)를 활용할 수 있습니다. 자바스크립트에서 [Rest Parameter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)와 같은 역할을 합니다.

```go
func sum(numbers ...int) (total int) {
  number := 0
  for i := 0; i < len(numbers); i++ {
    number = numbers[i]
    total += number
  }
  return total
}

fmt.Println(1, 2, 3, 4, 5) // 15
```

## range 활용하기

[`range`](https://gobyexample.com/range)는 Array, Slice, Map과 같은 돌림직한 타입(iterable type)은 물론 문자열도(유니코드로 변환) 순회할 수 있게 해줍니다. 자바스크립트에서 [`for ...of`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of)와 유사한 역할을 합니다.

```go
func sum(numbers ...int) (total int) {
  for i := range numbers {
    total += numbers[i]
  }
  return total
}

fmt.Println(1, 2, 3, 4, 5) // 15
```

index와 value를 동시에 반환해주기 때문에 아래와 같이 쓸 수도 있습니다. (재미있는건 [사용하지 않을 값을 반드시 언더스코어로 정의해주어야 한다](https://golang.org/doc/effective_go.html?h=underscore#blank)는 점인데, 이건 다른 구문에서도 마찬가지입니다. 보통 다른 언어에서 컨벤션으로 여겨지는게 언어에서 강제한다는 점이 신선합니다.)

```go
func sum(numbers ...int) (total int) {
  for _, number := range numbers {
    total += numbers[i]
  }
  return total
}

fmt.Println(1, 2, 3, 4, 5) // 15
```
