---
id: 531
title: '[CSS] Color, Hex Code and RGB'
date: 2016-05-12T15:21:07+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=531
permalink: /css-color-hex-code-and-rgb/
categories:
  - freecodecamp
tags:
  - css
  - fcc
  - freecodecamp
---
CSS에서 색을 표현할 때 간단하게 &#8216;red&#8217;, &#8216;white&#8217;, &#8216;black&#8217;등으로 표기하기도 합니다. 하지만 실제로는 다양한 색을 표현하기 위해 다른 방식을 더 자주 쓰게 됩니다. &#8216;#FF0000&#8217; 혹은 &#8216;rgb(255, 0, 0)&#8217;처럼 표기하는 경우입니다. 이 두가지 표현 방법에 대해 다루겠습니다.

**Hex Code &#8211; #<span style="color: #ff0000;">00</span><span style="color: #00ff00;">00</span><span style="color: #0000ff;">00</span>**
  
우선은 Hexadecimal Code의 준말인 Hex Code로 `#FF0000`처럼 표기하는 방법입니다. Hexadecimal은 16진법을 의미합니다. 일반적으로 표기하는 방식은 10진법입니다. 16진법은 0부터 15까지의 수를 0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F로 표기합니다. A는 10을 의미하게 되는 것이죠. 이 방식을 이용하면 한자리 수로 16까지 표기 가능하고 두자리로 255까지 표기 가능합니다.

해당 표기법으로 색을 표현할 때는 단순한 규칙을 가집니다.

  * 샵(#)기호 이후의 여섯자리의 숫자가 온다.
  * 첫번째,두번째 숫자는 빨간색(RED)의 정도를 의미한다.
  * 세번째,네번째 숫자는 초록색(GREEN)의 정도를 의미한다.
  * 다섯번째,여섯번째 숫자는 파란색(BLUE)의 정도를 의미한다.
  * 숫자가 클수록 정도(색의 농도)가 높아(짙어)진다.

예를 들어 `#FF0000`의 경우 빨간색입니다. 왜냐하면 가장 앞의 두자리가 FF로 가장 높은 정도를 가지고 뒤의 네자리는 0이기 때문입니다. 같은 원리로 `#00FF00`는 초록색입니다. 이때 색을 섞어서 다양한 색을 표현할 수 있는데 그 표현의 가지수는 256\*256\*256 만큼입니다. 약 1,600만개입니다.

**RGB Code &#8211; rgb(<span style="color: #ff0000;">255</span>, <span style="color: #00ff00;">255</span>, <span style="color: #0000ff;">255</span>)**
  
다음은 RGB Code인데 Red, Green, Blue의 정도를 숫자(10진법)으로 `rgb(255, 0, 0)`처럼 표기하는 방법입니다. 쉼표로 각 색의 정도를 구분짓습니다. 앞선 Hex Code를 이해하셨다면 쉽게 사용하실 수 있습니다. 위의 표기는 빨간색이겠죠?