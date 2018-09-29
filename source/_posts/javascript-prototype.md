---
id: 484
title: '[JavaScript] 프로토타입'
date: 2016-03-30T00:26:18+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=484
permalink: /javascript-prototype/
categories:
  - rabbylab
tags:
  - javascript
---
오늘은 &#8216;**prototype(프로토타입)**&#8216;에 대해 먼저 이야기해보겠습니다. 프로토타입은 사전에서 &#8220;(후대 사물의) 원조&#8221;라고 정의하고 있습니다. 다른 말로 &#8220;원형&#8221;이라고도 정의합니다. 코드 먼저 보시겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">function GrandFa(){};
GrandFa.prototype.name = "Joeun";

function Father(){};
Father.prototype = new GrandFa();

function Sun(){};
Sun.prototype = new Father();

var o = new Sun();

console.log(o.name);
</pre>

위 코드는 &#8220;Joeun&#8221;을 출력하는 코드입니다. 자세히 살펴보면 첫째줄에서 GrandFa가 선언됩니다. (할아버지가 제일 먼저 계셨죠.) 그리고 두번째 줄에서 그 GrandFa의 이름은 Joeun이라고 GrandFa.prototype.name으로 정의합니다. 이때 프로토타입은 자바스크립트가 객체에 기본적으로 제공하는 프로퍼티입니다. 특정 객체의 원형을 정의하기 위해 사용된다고 생각하면 쉽습니다. 그 후에는 Father가 선언되고 GrandFa의 원형(특징,성질)을 물려받습니다. 상속이죠. 마찬가지로 Sun도 Father의 원형을 물려받습니다. 아들 객체가 마지막으로 o를 생성하고 o가 그 이름을 출력하면 결과물은 Joeun이 됩니다. 무슨 일이 일어난걸까요? 

이 상황을 설명하기 위해 Prototype Chain이라는 개념을 이해해야합니다. 가장 아래에 있는 o.name부터 보겠습니다. 자바스크립트는 o.name을 출력하기 위해 내용물을 들여다봅니다. 그런데 그 안에 아무것도 없는걸 발견하죠. 실제로 저희는 o.name에 아무것도 정의하지 않았으니까요. 그럼 이제 자바스크립트는 o의 원형인 Sun을 찾아갑니다. sun.name을 확인합니다. 역시 비어있습니다. 위로 올라갑니다. Father를 살펴보니 또 없군요. 결국 GrandFa까지 가서 보니 이 가족의 이름은 &#8220;Joeun&#8221;입니다. 그래서 o.name에 해당 내용을 출력합니다. 어떤가요? name을 Family name이라고 했으면 더 쉬웠을지도 모르겠다는 생각이 듭니다. 결국 Prototype Chain은 원형이 이어져있는 겁니다. 하위 항목에 없으면 상위 항목으로 찾으러 올라가는거죠. 너 성이 뭐니? 라고 물어봐서 아들이 모르면 아빠가 알테고 아빠가 모르면 할아버지가 알겠죠? 위로 올라가면서 묻는겁니다.

그럼 이런 경우는 어떨까요?

<pre class="brush: plain; title: ; notranslate" title="">function GrandFa(){};
GrandFa.prototype.name = "Joeun";

function Father(){};
Father.prototype = new GrandFa();
Father.prototype.name = "Rabby"

function Sun(){};
Sun.prototype = new Father();

var o = new Sun();

console.log(o.name);
</pre>

딱 한줄이 추가됐습니다. Father가 생성되고 중간에 이름을 변경합니다. 이때 출력되는 값은 &#8220;Rabby&#8221;입니다. 체인을 타고 올라가다가보니 중간쯤에 값이 있는데 그게 &#8220;Rabby&#8221;였기 때문입니다. (아빠가 성을 바꾸면 아들도 그 성을 따라가겠죠.)

이때 주의하셔야할 부분이 하나 있습니다. 객체를 생성할 때 `var o = Sun.prototype`라고 하면 안됩니다. 그렇게 되면 o가 변경되면 Sun.prototype 값이 영향을 받습니다. 왜 그럴까요?

&#8220;_객체는 결코 복사되지 않는다. 다만 참조된다._&#8221; 바로 이 문장 때문입니다.
  
그렇습니다. 객체는 복사되지 않습니다. 객체는 참조됩니다. 코드를 보시면 알 수 있습니다.

<pre class="brush: plain; title: ; notranslate" title="">function Dev(){};
Dev.prototype.name = "Joeun";

var a = b = c = Dev.prototype;

console.log(a.name);
console.log(b.name);
console.log(c.name);

Dev.prototype.name = "Rabby";

console.log(a.name);
console.log(b.name);
console.log(c.name);
</pre>

이 코드의 결과는 &#8220;Joeun&#8221;이 세번 반복되고 이어서 &#8220;Rabby&#8221;가 세번 반복됩니다. a,b,c를 정의할 때 저희는 Dev.prototype을 참조하게 했습니다. 만약에 복사되었다면 중간에 Dev.prototype.name 값이 바뀐다고 해서 이후 값이 바뀌지 않았겠죠. 하지만 객체는 &#8216;참조&#8217;된다는 특성 때문에 이와 같은 결과가 나온 것입니다. 때문에 객체를 복사하듯 사용하기 위해선 &#8220;new&#8221;를 이용해 생성자로 사용해주셔야 합니다.