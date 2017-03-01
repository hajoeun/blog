---
id: 488
title: '[Practice] 동물 쉼터(Animal Shelter)를 구현하라!'
date: 2016-04-02T00:16:46+00:00
author: rabby
layout: post
guid: http://rabbylab.xyz/?p=488
permalink: /practice-animal-shelter/
categories:
  - cs basic
tags:
  - coin
  - csbasic
---
###### Practice 시리즈를 연재합니다. 지난 3월 3일부터 COIN(코딩인터뷰 준비하는 모임)이라는 이름으로 함께 취업스터디를 진행하고 있는 5명의 친구들과 함께 교재 <코딩인터뷰 완전분석> 이라는 책을 가지고 공부를 시작했습니다. Practice 시리즈는 이 과정에서 함께 고민하며 풀었던 문제에 대해 이야기하는 시리즈입니다.

* * *

**코딩인터뷰 완전분석 – 연습문제 3.7**

**“먼저 들어온 동물이 먼저 나가는 동물 쉼터(animal shelter)가 있다고 하자. 이 쉼터는 개와 고양이만 수용할 수 있다. 사람들은 쉼터의 동물들 가운데 들어온 지 가장 오래된 동물부터 입양할 수 있는데, 개와 고양이 중 어떤 동물을 데려갈지 선택할 수도 있다. 특정한 동물을 지정해 데려가는 것은 금지되어 있다. 이 시스템을 자료구조로 구현하라. 해당 자료구조는 enqueue, dequeueAny, dequeueDog, dequeueCat의 연산들을 제공해야 한다. 언어에 기본 탑재되어 있는 LinkedList (Java) 자료구조를 이용해도 좋다.”**

이번부터는 자바로 구현하겠습니다. [이전 글](http://rabbylab.xyz/practice-1/)에서 C로 코딩을 했는데, COIN에서 사용하는 공용 언어로 자바를 선정함에 따라 자바로 코딩하겠습니다.

코드를 보시기에 앞서 문제를 먼저 해부(?)하겠습니다. 동물 쉼터는 &#8216;먼저 들어온 동물이 먼저 나가는&#8217; 곳 입니다. First In First Out(FIFO)라는거죠. 큐를 의미합니다. 그리고 문제의 끝에서 &#8216;LinkedList&#8217;를 사용해도 좋다고 합니다. 결국 LikedList로 표현된 Queue를 구현하라는 것입니다. 그리고 그 큐는 몇가지 제약조건을 가지고 있습니다. 들어온 지 가장 오래된 동물부터 입양하되, 개나 고양이 중에서 선택은 할 수 있도록 해줘라는 것입니다. 그래서 dequeueDog, dequeueCat 연산을 제공합니다. 대충 그림나옵니다. 그럼 시작할까요?

<pre class="brush: plain; title: ; notranslate" title="">private Node head;
private Node tail;
private int size = 0;
private class Node {
	private String name;
	private int id;
	private Node next;
	public Node(String animal, int num){
		this.name = animal;
		this.id = num;
		this.next = null;
	}
}
</pre>

링크드리스트를 구현해야하기 때문에 노드를 만들어줍니다. head와 tail은 큐에서 front(앞)와 rear(뒤)를 맡게됩니다. 일단은 4번째 줄 이후를 집중해서 보겠습니다. 이 노드는 동물의 이름 값(name), 개와 고양이를 분류하기 위한 값(id) 그리고 다음 노드를 가르키는 값(next)을 가지고 있습니다. 사실 저는 이 &#8216;가르키는 값&#8217;이 참 익숙하지 않습니다. C에서는 이걸 포인터로 구현하는데 Java에서는 그냥 값을 참조하면 되는데, 그게 은근히 낯섭니다. 포인터의 그 특징이 더 뇌리에 깊게 박힌 것 같습니다. 여하튼 노드는 이렇게 구성되어 있습니다. 이제 본격적인 연산들을 살펴보겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">public void enqueue(String animal, int num){
	Node newNode = new Node(animal, num);
	if(size == 0){
		tail = head = newNode;
	} else{
		head.next = newNode;
		head = newNode;
	}
	size++;
}
</pre>

이 코드는 노드를 추가(enqueue)하는 과정을 보여줍니다. 이 메소드는 인자로 동물의 이름(animal)과 개와 고양이를 구분하는 숫자(num)을 받습니다. 그리고 새로운 노드를 생성합니다. 이때 생성된 노드가 첫번째 노드라면(queue의 size가 0이라면) head와 tail이 동시에 이 노드를 가르킵니다. 만약 그렇지 않다면 head의 다음(next)에 새로운 노드가 붙습니다. 그리고 head는 새로운 노드를 가르킵니다. 그러니까 새로운 노드가 추가되면 tail로 붙는게 아니라 head가 이동합니다. tail은 움직이지 않습니다. 앞에다가 추가하는 방식인거죠. 추가가 끝나면 size를 증가시켜줍니다. 이로써 tail에는 가장 오래된 동물이 주인을 기다리게 됩니다.

<pre class="brush: plain; title: ; notranslate" title="">public void dequeueAny(){
	System.out.println(tail.name);
	tail = tail.next;
	size--;
	return;
}
</pre>

새로운 주인을 만난 동물을 보내주는 메소드입니다. 가장 먼저 들어온 동물을 보내주겠습니다. 보내주는 걸 확인하기 위해 메세지를 출력합니다. 출력 이후에는 tail을 한칸 뒤로 이동합니다. 다음 차례를 가르키는거죠. 그리곤 size를 감소시켜줍니다.

<pre class="brush: plain; title: ; notranslate" title="">public void dequeueDog(){
	Node chaser_1 = tail;
	Node chaser_2 = tail;
	while(chaser_1.id != 0 && chaser_1.next != null){
		chaser_2 = chaser_1;
		chaser_1 = chaser_2.next;
	}
        //개가 첫번째 노드에 있었던 경우
	if(chaser_1 == tail){
		dequeueAny();
        //개를 발견한 경우
	} else if(chaser_1.id == 0){
		System.out.println(chaser_1.name + ", Bye!\n");
		chaser_2.next = chaser_1.next;
	//개가 없는 경우
        } else{
		System.out.println("No Dog...");
		return;
	}
	size--;
	return;
}
</pre>

이제 새로운 주인이 원하는 동물을 골라서 주겠습니다. 개/고양이 중에서 선택이 가능해야겠죠. 위의 코드는 개를 내보내는 코드입니다. id가 0일 때, 개/ 1일 때, 고양이라고 간주했습니다. 이번 코드에서 중요한건 역시 chaser\_1,chaser\_2 입니다. 이들의 역할은 원하는 동물을 찾아오는 것입니다. 처음에는 tail부터 시작합니다. 가장 오래된 동물부터 확인하는 것이죠.
  
while문을 보겠습니다. 본격적인 추적(chase)가 시작됩니다. id가 0이 아닐 경우 계속 반복됩니다. 다시말해, 0이 아니라는 말은 개가 아니라는 것이니까 고양이라는 의미겠죠? 그리고 만약에 더 이상 개가 남아 있지 않을 경우도 있겠죠? 그런 경우에 무한루프를 방지하기 위해서 next값이 null이면 탈출할 수 있도록 조건을 만들어둡니다. 이제 chaser의 이동을 살펴보겠습니다. 5번 줄에서 chaser\_2가 chaser\_1의 위치로 갑니다. 그리고 다음 줄에서 chaser\_1은 다음 노드로 이동합니다. 이렇게 chaser\_1이 앞으로 한 노드씩 움직이며 개를 찾습니다. 결국 개가 발견되거나 개가 없으면 루프를 벗어납니다.
  
만약에 개가 첫번째 노드에 있었다면 그냥 dequeueAny 메소드를 호출해줍니다. 그리고 만약에 개가 맞다면 개에게 작별을 고하고 보내줍니다. chaser\_2의 다음 노드였던 chaser\_1의 노드를 없애주기 위해 chaser\_1 다음의 노드와 chaser\_2를 이어줍니다. 그렇게 노드를 정리합니다. 만약에 개가 없었다면 더 이상 개가 없다고 메세지를 출력해줍니다.

dequeueCat의 경우는 id 값만 바꿔주면 됩니다. 고로 생략하겠습니다.

<pre class="brush: plain; title: ; notranslate" title="">public class Main {

	public static void main(String[] args) {
		LinkedList animals = new LinkedList();
		
		animals.enqueue("귀욤",1);
		animals.enqueue("개똥",0);
		animals.enqueue("황묘",1);
		animals.enqueue("백구",0);
		
		System.out.println(animals);
		
		animals.dequeueDog();
	
		System.out.println(animals);
	}

}
</pre>

예제 확인을 위한 코드입니다. 개똥이를 보내고 빈자리를 확인하는 것으로 코드가 끝납니다. 아래는 출력결과 입니다.
  
<img class="alignnone size-full wp-image-501" src="http://rabbylab.xyz/blog/wp-content/uploads/2016/04/Aniqueue-실행-결과.jpg" alt="Anishelter 실행 결과" width="339" height="108" srcset="http://rabbylab.xyz/blog/wp-content/uploads/2016/04/Aniqueue-실행-결과.jpg 339w, http://rabbylab.xyz/blog/wp-content/uploads/2016/04/Aniqueue-실행-결과-300x96.jpg 300w" sizes="(max-width: 339px) 100vw, 339px" />

전체 코드는 <a href="https://github.com/joeunha/rabbylab-csbasic/blob/master/src/rabbylab/csbasic/coin/animalshelter/LinkedList.java" target="_blank">이곳</a>에서 확인하실 수 있습니다. 감사합니다.