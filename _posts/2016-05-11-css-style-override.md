---
id: 520
title: '[CSS] Style Override'
date: 2016-05-11T15:52:47+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=520
permalink: /css-style-override/
categories:
  - freecodecamp
tags:
  - css
  - fcc
  - freecodecamp
---
CSS Style Override는 컴포넌트, 라이브러리를 커스텀하기 위해 사용됩니다. 어떤 식으로 Override가 가능한지 살펴보겠습니다.

CSS 파일은 위에서 아래로 순차적으로 실행됩니다. 때문에 동일한 Element에 동시에 적용되는 경우, 가장 마지막에 선언된 Style이 가장 높은 우선순위를 갖습니다.

예를 들어 아래와 같은 상황에서 h1은 blue-text 속성 값을 지니고 파란색으로 표기되죠.

<pre class="brush: plain; title: ; notranslate" title="">&lt;style&gt;
  body {
    background-color: black;
    font-family: Monospace;
    color: green;
  }
  .pink-text {
    color: pink;
  }
  .blue-text {
    color: blue;
  }
&lt;/style&gt;


&lt;h1 class="pink-text blue-text"&gt;Hello World!&lt;/h1&gt; //파란색

</pre>

다만 id로 속성을 지정할 경우에는 어떤 class보다 높은 우선순위를 가집니다. 결국 아래와 같은 코드는 h1이 주황색으로 표기됩니다.

<pre class="brush: plain; title: ; notranslate" title="">&lt;style&gt;
  body {
    background-color: black;
    font-family: Monospace;
    color: green;
  }
  #orange-text {
    color: orange;
  }
  .pink-text {
    color: pink;
  }
  .blue-text {
    color: blue;
  }
&lt;/style&gt;


&lt;h1 id="orange-text" class="pink-text blue-text"&gt;Hello World!&lt;/h1&gt; //주황색

</pre>

id 값보다 높은 우선순위를 갖는 방법은 in-line으로 스타일을 지정하는 방법입니다. 위의 코드에서 h1에 `style="color: white"`를 추가해주면 다른 class/id보다 높은 우선순위를 가진 in-line style에 의해 h1는 흰색으로 표기됩니다.

하지만 이 모든 방법보다 우위의 순위를 가질 수 있는 방법이 있습니다. 바로 `!important`를 추가하는 것이죠. 예를들어 모든 class와 id 그리고 in-line style에 의해 가장 마지막으로 밀린 pink-text를 최상위 스타일로 적용하고 싶다면, `color: pink !important;`를 적용해주면 된다. 이 결과로 h1은 분홍색으로 표기됩니다.

**정리하자면 CSS Style의 우선순위는**

  1. **동일한 class일 경우 가장 마지막에 선언된 Style이 높다.**
  2. **(1번을 포함하고) class보다 id가 높다.**
  3. **id보다 in-line style이 높다.**
  4. **!important는 앞선 모든 것보다 높다.**

**라고 정의할 수 있습니다.**