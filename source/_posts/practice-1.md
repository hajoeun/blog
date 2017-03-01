---
id: 472
title: '[Practice] min연산을 갖춘 stack을 구현하라!'
date: 2016-03-26T19:29:50+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=472
permalink: /practice-1/
categories:
  - cs basic
  - study
tags:
  - coin
  - csbasic
  - practice
  - stack
---
###### <span style="color: #999999;">Practice 시리즈를 연재합니다. 지난 3월 3일부터 COIN(코딩인터뷰 준비하는 모임)이라는 이름으로 함께 취업스터디를 진행하고 있는 5명의 친구들과 함께 교재 <코딩인터뷰 완전분석> 이라는 책을 가지고 공부를 시작했습니다. Practice 시리즈는 이 과정에서 함께 고민하며 풀었던 문제에 대해 이야기하는 시리즈입니다.</span>

* * *

###### 

**코딩인터뷰 완전분석 &#8211; 연습문제 3.2**

**&#8220;push와 pop의 두 가지 연산뿐 아니라, 최솟값을 갖는 원소를 반환하는 min연산을 갖춘 stack은 어떻게 구현할 수 있겠는가? push, pop, 그리고 min은 공히 O(1) 시간에 처리되어야 한다.&#8221;**

이 문제의 포인트는 &#8216;min연산&#8217;, &#8216;O(1)&#8217;에 있습니다. min연산은 어떻게 검색을 통해 해낸다고 해도 O(1) 시간에 처리해야하는 문제로 인해 반복문을 사용할 수가 없게되죠. 결국 min연산부터 다시 생각해야합니다. 이 문제를 해결하는 아이디어를 낸 친구가 이렇게 말했습니다. &#8216;그냥 stack을 하나 더 만들면 안돼?&#8217;라고 말입니다. 이때부터 함께 이것저것 아이디어를 덧붙여가며 이야기를 나눠보니 &#8216;옳다쿠나&#8217; 정답이었습니다.

구현은 그리 어렵지 않습니다. 차근차근 해보겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">#include &lt;stdio.h&gt;

int main_stack[10];
int min_chaser[10];
int main_top = 0, chaser_top = 0;
int cur_min;

</pre>

우선 배열을 두개를 선언해줍니다. 하나는 기본 스택을 위한 배열, 다른 하나는 최소값을 추적하는 배열입니다. 그리고 각 스택별로 가장 마지막에 들어온 숫자를 체크하는 top 변수를 스택마다 하나씩 선언하고 0으로 초기화시킵니다. 마지막으로 현재의 최소값을 기억하고 있는 변수를 하나 선언합니다.

<pre class="brush: plain; title: ; notranslate" title="">//chaser_push function
void chaser_push(num) {
   if(chaser_top &gt;= 10) {
      printf("Stack is overflow!\n");
   } else {
      min_chaser[chaser_top] = num;
      chaser_top++;
   }
}

//chaser_pop function
void chaser_pop() {
   chaser_top--;
   printf("I am number %d. I was a min number!\n", min_chaser[chaser_top]);
   min_chaser[chaser_top] = 0;
   cur_min = min_chaser[chaser_top - 1];
}
</pre>

다음은 함수를 만들어줄 차례입니다. 우선 chaser와 관련된 함수를 먼저 만들겠습니다. 왜냐하면 뒤이어 나오는 기본 스택 함수들이 이 함수들을 사용해야하기 때문입니다. chaser\_push는 인자로 num값을 받습니다. 만약에 chaser\_top값이 스택의 범주(10)를 넘어선다면 이는 오버플로우가 발생한 것이라고 경고하는 메세지를 출력합니다. 만약 오버플로우가 아니라면 chaser에 인자로 받은 값을 넣습니다. 그리고 chaser_top 값을 증가시켜줍니다. 기본적인 push구현 방식입니다.
  
이어사 등장하는 chaser\_pop도 일반적인 pop과 같습니다. 우선 chaser\_top을 감소시켜줍니다. 그리고 min\_chaser에서 가장 위에 있는 값을 꺼내줍니다. 출력문을 통해 최소값이었다는 것을 밝힙니다. 원래 최소값이 들어있던 자리를 비워주고 cur\_min값을 바꿔줍니다.

_<span style="color: #999999;">*저는 이 부분에서 chaser가 제일 작은 놈을 가두는 경찰소라는 추상적인 관념을 가지고 작업했습니다. 각 숫자들에 인격을 부여하고 함수 역시 어떤 역할을 감당하는 객체(?)라는 느낌을 가지고 작업하다보니 &#8220;I am number 5. I was a min number!&#8221; 같은 메세지가 나왔습니다.</span>_

<pre class="brush: plain; title: ; notranslate" title="">//main_stack push function
void push(int num) {
   if(main_top &gt;= 10) {
      printf("Stack is overflow.\n");
   } else if (main_top == 0) {
      main_stack[main_top] = num;
      cur_num = num;
      chaser_push(cur_num);
      main_top++;
  } else {
      main_stack[main_top] = num;
      main_top++;
      if(num &lt; cur_num) {
          cur_num = num;
          chaser_push(cur_num);
      }
   }  
}

//main_stack pop function
void pop() {
   if(main_top == 0) {
      printf("Stack is empty.\n");
   } else {
      main_top--;
      
      if(main_stack[main_top] == cur_num) {
         chaser_pop();
      } else {
          printf("I am number %d.\n", main_stack[main_top]);
      }
        main_stack[main_top] = 0;
   }
}
</pre>

기본적인 push&pop 함수를 크게 벗어나지 않습니다. 특이점만 살펴보겠습니다. 우선 main\_stack에 처음으로 push를 하는 경우가 나옵니다. main\_top가 0인 경우죠. 이 경우에는 홀로 존재하기 때문에 곧장 최소값이 됩니다. 때문에 cur\_num에 num을 넣어주고 chaser에도 push를 합니다. 그리고 top을 증가시키구요. 그 이후로는 cur\_num값과 비교해서 더 작은 경우에만 chaser\_push를 호출합니다. pop을 살펴보면 비어있는 경우를 메세지로 알려줍니다. 그렇지 않은 경우 중에서 빼내려고 하는 값과 cur\_num가 같을 경우, main\_stack의 pop이 아니라 chaser\_pop으로 넘어갑니다. 거기서 &#8220;I was a min number!&#8221;라는 메세지를 출력한 뒤에 다시 돌아와 빠진 자리를 비워줍니다. 일반적인 경우에는 main_stack에서 메세지를 출력하고 함수가 끝납니다.

이제 테스트해보겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">int main() {

   push(20);
   push(16);
   push(3);
   push(26);
   push(19);
   push(21);

   pop();
   pop();
   pop();
   pop();
   pop();
   pop();

   return 0;
}
</pre>

결과 값은 아래와 같습니다. (20과 16은 각기 들어갔을 때 당시에 최소값이었습니다.)<img class="size-full wp-image-473 aligncenter" src="http://rabbylab.xyz/blog/wp-content/uploads/2016/03/스크린샷-2016-03-26-오후-7.23.52.png" alt="스크린샷 2016-03-26 오후 7.23.52" width="520" height="176" srcset="http://rabbylab.xyz/blog/wp-content/uploads/2016/03/스크린샷-2016-03-26-오후-7.23.52.png 520w, http://rabbylab.xyz/blog/wp-content/uploads/2016/03/스크린샷-2016-03-26-오후-7.23.52-300x102.png 300w" sizes="(max-width: 520px) 100vw, 520px" />

&nbsp;

[Practice 1] &#8220;min연산을 갖춘 stack을 구현하라!&#8221; 끝.

질문 혹은 문제 제기 환영합니다. 댓글 남겨주세요. ^^