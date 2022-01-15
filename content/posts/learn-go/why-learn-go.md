---
title: Go를 배우는 이유
categories:
  - programming
tags:
  - Go
  - Golang
date: 2020-02-11 22:00:00
description: 마스코트가 너무 귀여운 탓
banner: ./images/preview.jpg
slug: why-learn-go
---

## Write in Go

엘사가 부른 'Let it go'라는 노래를 모르는 분은 없을 것 같습니다. 그렇다면 'Write in Go'는 어떤가요? 지금까지 모르셨다면 오늘 꼭 들어보셨으면 좋겠습니다. 이 곡은 ScaleAbility라는 아카펠라 그룹이 2014년에 발표한 곡입니다. 갑자기 웬 가수 이야기냐고요? ScaleAbility가 어떤 그룹인지 들여다보면 그 이유가 나옵니다.

**"ScaleAbility is Google NYC's a capella group."** 그렇습니다. ScaleAbility는 구글 개발자로 구성된 아카펠라 그룹입니다. Write in Go는 Let it go와 멜로디가 완전히 같습니다. 내용은 완전 다르죠. Go(Golang)로 코드를 작성하라고 권하는 노래입니다. Go를 사용하면 귀찮은 일이 없다고 말하죠. ("The code never bother me anyway.") 이 곡 덕분에 Go를 배우고 싶은 마음이 커졌습니다. [유튜브](https://www.youtube.com/watch?v=LJvEIjRBSDA)에서 들어보세요.

그렇다면 ScaleAbility는 어떤 이유로 Go를 써야 한다고 말했을까요?

## 쉽고 단순해서

Go는 복잡함이 싫어 태어난 언어입니다. [언어 설계자들이 직접 밝혔죠.](https://web.archive.org/web/20140313072938/http://www.drdobbs.com/open-source/interview-with-ken-thompson/229502480) 때문에 키워드도 적습니다. 반복문에 for만 존재할 정도죠. (do, while이 없습니다!) [코드 서식(format)을 자동으로 맞춰줘서](https://golang.org/doc/effective_go.html#formatting) Go를 사용하는 누구나 같은 규칙에 따라 코드를 작성할 수 있습니다. 덕분에 코드 리뷰 시에 오직 논리에만 집중할 수 있죠. 가비지 컬렉션도 가능해 메모리를 직접 관리할 필요도 없습니다. 이처럼 Go는 어렵고 불필요한 건 일절 담지 않아 쉽고 단순합니다.

## 빠르고 강력해서

쉽고 단순하다고 해서 얕봐선 안 됩니다. Go는 엄청난 속도를 자랑합니다. 쉽고 단순하기로 유명한 [Python과 비교하면 30~50배가 빠릅니다.](https://www.edureka.co/blog/golang-vs-python/#perf) Python은 실행 단계에 해석기(Interpreter)가 필요한 한편 Go는 기계어로 미리 컴파일되기 때문에 엄청난 속도를 내는 것이죠. 그리고 Java나 C++처럼 [대형 시스템에서 운용할 수 있게 설계되었습니다.](https://youtu.be/7VcArS4Wpqk?t=575)

## 진짜 이유

솔직하게 말하자면 제 진짜 이유는 여기 있습니다. 쉽고 단순하면서 빠르고 강력하다는 것도 배우기로 마음 먹은 뒤에 알아본 것이죠. 진짜 이유는 회사에서 Go를 사용하기 때문입니다. (마스코트가 너무 귀여운 탓도 있습니다.) 기존의 서비스를 새로 구현하는데 Go가 쓰입니다. 서버쪽이라 아직은 제가 쓰진 않습니다. 다만, 리뷰를 해야할 것 같아 배워두려고 합니다.

오랜만에 새로운 언어를 배우는거라 기대가 됩니다. 이 과정을 글로 남겨볼 생각합니다. 우선은 [공식 문서](https://golang.org/doc/)를 조금 읽어봐야겠습니다. 그리고 [강의](https://academy.nomadcoders.co/p/go-for-beginners)를 하나 들으며 실제 서비스를 만들어볼 계획입니다. [쓸데 없는 짓](https://github.com/golang/go/wiki/WebAssembly)도 조금 해볼 생각입니다. [Github 저장소](https://github.com/hajoeun/write-in-go)에 배운 것을 조금씩 올리겠습니다.
