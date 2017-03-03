---
id: 516
title: PRATO 개발기 (1)
date: 2016-04-28T15:14:17+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=516
permalink: /prato-%ea%b0%9c%eb%b0%9c%ea%b8%b0-1/
categories:
  - rabbylab(wordpress)
tags:
  - toy-project
---
### 소개

PRATO는 PraiseTogether의 약자입니다. 함께 찬양하고 노래하기 위해 필요한 콘티(곡의 순서)를 제작하는 과정에 필요한 모든 과정을 제공하는 웹 서비스입니다.

해당 서비스는 기존에 콘티 제작 과정이 웹 검색-문서 편집-출력의 과정에서 웹 브라우저와 문서 편집 도구를 별도로 이용해야만 했던 불편함을 해소하고자 시작되었습니다. 불필요한 다운로드 과정을 생략하고 하나의 웹 페이지에서 모든 과정을 수행할 수 있는 서비스입니다.

주요 기능은 &#8216;**악보 검색**&#8216;, &#8216;**콘티 편집**&#8216;, &#8216;**콘티 출력**&#8216; 입니다.

개발 과정 및 코드는 [Github](https://github.com/joeunha/praisetogether)을 통해 확인하실 수 있습니다.

&nbsp;

### 개발 환경 만들기

그나마 경험이 많은 AngularJS로 프론트엔드를 꾸릴까 합니다. 서버단을 구현할 능력이 있을지 모르나, 시간과 능력이 허락한다면 MEAN Stack으로 전체를 구현해볼 생각입니다. 개발 환경 세팅에 소요되는 시간을 최소화하기 위해 스캐폴딩 도구인 [Yeoman](http://yeoman.io/)을 이용했습니다.

개발 툴은 SourceTree / Atom / Chrome을 사용합니다. 상황에 따라 Windows 10 / OS X를 혼용하고 있습니다. Windows 10의 경우 bash 툴을 지원하지 않지만 SourceTree에서 제공하는 터미널 기능을 이용하여 개발을 진행하고 있습니다.

node (npm)을 설치한 뒤, yeoman 을 설치하면 yeoman을 사용할 준비가 끝이 납니다. 터미널에서 yo라고 입력하면 generator를 설치할 수 있는 installer가 보입니다. 저는 Grunt / Bower / css 를 선택했습니다. 스캐폴딩이 끝나고 grunt test, grunt build, grunt serve를 순서대로 입력하면 바로 작업 가능한 웹 페이지를 만나보실 수 있습니다. 이로써 개발 환경을 설정 했습니다.

다음 시간에는 페이지 구조를 잡아보겠습니다.