---
id: 464
title: fork(), execlp(), wait() 함수
date: 2016-03-26T00:27:03+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=464
permalink: /fork-execlp-wait-%ed%95%a8%ec%88%98/
categories:
  - cs basic
tags:
  - csbasic
  - operatingsystem
  - os
---
운영체제를 배우고 있습니다. <a href="http://rabbylab.xyz/%ed%94%84%eb%a1%9c%ea%b7%b8%eb%9e%a8-%ed%94%84%eb%a1%9c%ec%84%b8%ec%8a%a4-%ec%8a%a4%eb%a0%88%eb%93%9c/" target="_blank">이전 글</a>에서 프로그램, 프로세스 그리고 스레드에 대해 다뤘습니다. 오늘은 fork(), execlp(), wait() 함수를 살펴보겠습니다.

이 세 함수는 앞서 살펴본 프로세스와 연관을 맺고 있는 함수입니다. 각각 복사, 대체, 대기를 담당하는 함수들입니다. 오늘은 예시와 함께 살펴보도록 하겠습니다. 예시는 C 언어로 작성되었습니다.

먼저 fork() 함수 입니다. 이 함수는 프로세스를 복사(duplicate)합니다. 이때 복사가 되어지는 원본을 parent 라고 부르고 복사가 된 복사본을 child 라고 부릅니다. 자식은 부모의 판박이라 복사본인 프로세스는 부모와 동일한 코드를 가집니다. 다만 자식이 부모의 자리를 넘봐선 안되겠죠? 이쪽 세계에도 질서가 있습니다. Process ID(PID)를 부여해서 자식과 부모를 구분짓습니다. 부모의 PID는 다양하게 형성됩니다. 하지만 자식의 경우는 ID가 항상 0 입니다. 구분짓기 쉽죠.

이제 아래의 코드를 보겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">#include &lt;stdio.h&gt;

int main(int argc, char *argv[]) {

   fork();
   printf("Hello, World!\n");
   
   return 0;
}
</pre>

우리에게 너무나 익숙한 Hello, World! 를 출력하는 코드입니다. printf 앞에 fork 함수가 자리하고 있습니다. 이 코드의 결과물은 Hello, World! 가 두번 출력되는 것으로 끝입니다. 그 내용은 그리 어렵지 않습니다. fork 함수는 자신을 포함한 프로세스 전체를 복사하여 새로운 프로세스를 하나 만듭니다. 두개의 프로세스가 Hello, World!를 출력하고 종료됩니다. 그렇다면 메세지를 여덟번 출력하기 위해선 fork 함수를 몇번 사용해야 할까요? 정답은 세번입니다.

저는 이걸 이해하는데 은근히 오래걸렸습니다. 어떻게 세번일까요? 이렇게 이해하면 쉽습니다. &#8216;1 &#8211; 2 &#8211; 4 &#8211; 8&#8217; 하나가 두개가 되고 두개가 네개가 되고&#8230; 두배씩 커지는거죠. 이 간단한 원리를&#8230; 저는 종이 몇장을 찢어가며 고민했습니다.

이제 exec 식구(family)들을 만나볼 시간입니다. execlp 함수는 가족이 많습니다. exec 가문이죠. 가족 구성원은 execl, execlp, execle, execv, execvp, execvpe 가 있습니다. 이들의 역할은 특정 파일을 실행(execute)하는 것 입니다. 그 파일을 실행하여 현재 프로세스를 대체(replace)해버립니다. 다른 이름을 가지고 있지만 결과적으로 하는 일은 같습니다. 다만 일하는 방식, 사용되는 방식이 각기 이름따라 다릅니다. 저는 execlp 만 다루겠습니다. 코드 보시겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;

int main(int argc, char *argv[]) {

   execlp("./hello", "hello", NULL);
   printf("This is execlp function test!\n");

   return 0;
} 
</pre>

이 코드도 앞선 fork 예제처럼 Hello, World! 메세지를 출력하게 됩니다. 갑자기 무슨 소리냐고 하실지 모르지만 결과적으론 그렇습니다. 주인공인 execlp 함수를 살펴보기 전에 hello 라는 프로그램을 만들어두었다는 점을 이해하셔야합니다. hello 프로그램은 Hello, world! 라는 메세지를 출력하는 프로그램입니다. 결국 저희는 이 프로그램을 다른 프로세스에서 실행시키고자 하는 중입니다. 그럼 이제 그 주체가 되는 execlp 함수를 살펴보겠습니다. 총 세개의 인자를 가지고 있습니다. 첫번째 인자인 &#8220;./hello&#8221; 는 실행시킬 프로세스의 경로를 의미합니다. 그럼 두번째 인자는 뭘까요? 이는 프로그램의 이름을 의미합니다. 이때 적힌 이름은 지금 경로에 위치한 프로그램의 이름이 아니라 호출하는 프로세스에서 부르게될 이름입니다. 그래서 hello가 아니라 bye라고 해도 무방합니다. 세번째는 옵션입니다. 저희는 특별한 옵션을 넣지 않기로 하고 NULL 값을 넣어주었습니다. 결과적으로 ./hello 경로에 있는 hello 프로그램이 호출되며 기존의 프로세스를 대체하기 때문에 그 이후에 등장하는 메세지를 출력하지 않습니다.

이제 마지막 wait입니다. 이 함수는 이름처럼 특정 프로세스의 종료를 기다립니다(wait). 코드를 보겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;

int main(int argc, char *argv[]) {

   int child_pid = fork();
   if(child_pid == 0) {
      execlp("./hello", "bye", NULL);
   }
   else {
      wait();
      printf("This is wait function test!\n");
   }
   
   return 0;
}
</pre>

결과부터 생각해볼까요? 위의 if문 안에 있는 execlp는 같은 프로그램을 호출한 것이라면 Hello, World!가 출력될 것입니다. 그리고 다른 출력문인 This is wait function test! 구문도 출력됩니다. 어떻게요? 이제 살펴보죠. 우선 첫번째 줄의 child\_pid라는 변수는 fork()의 리턴 값을 받습니다. 이때 알아야할 것이 fork()가 어떤 값을 리턴하는가 하는 것이죠. fork는 프로세스의 ID 값을 리턴합니다. 그러니까 앞서 말씀드린 것 처럼 child인 경우에 0을 돌려보내겠죠. 물론 잊지 말아야할 사실은 fork()가 호출되면서 이미 프로세스가 복사되었다는 사실입니다. 그래서 두개의 프로세스에서 같은 코드를 진행해갑니다. 다만 다른 것은 child\_pid 값 뿐이죠. 그로인해 출력되는 값도 달라집니다. 부모는 else 구문에 있는 메세지를 출력하고, 자식은 execlp를 통해 hello 프로그램을 자신과 대체시킵니다. 결과적으론 자식을 대체한 hello 프로그램이 먼저 실행되고 부모의 메세지가 등장하게 됩니다. wait 함수가 부모 프로세스로 하여금 자식 프로세스가 끝나길 기다리게 만들기 때문입니다. 이해되셨나요?

위의 모든 코드는 vi로 작성되었고 gcc컴파일러를 통해 컴파일하고 리눅스 환경에서 테스트 되었습니다. 오류 혹은 질문은 댓글 주시면 감사하겠습니다. 감사합니다.