# Item.9 타입 단언보다는 타입 선언 사용하기

**TS에서 변수에 값을 할당하고 타입을 부여하는 방법은 2가지 방법**

1. as 키워드를 사용한 타입 단언
TS가 추론한 타입이 있더라도 단언한 타입으로 간주한다
2. : 키워드를 사용한 타입 선언
해당 값이 선언된 타입임을 명시한다

```jsx
interface Person3 {
  name: string;
}

const alice: Person3 = { name: 'Alice' }; // Type is Person
const bob = { name: 'Bob' } as Person3; // Type is Person
```

그렇다면 왜 타입 단언보다 타입 선언을 사용해야 할까?

**타입 단언은 타입 체크를 회피한다**

타입 단언은 강제로 타입을 지정한다. 컴파일 단계에서 타입 체크가 이뤄지지 않기 때문에 에러를 무시하게 된다.

아래 코드처럼 변수 tom에서는 에러가 발생하지만 james에서는 에러가 회피된다.

![9-1](https://github.com/planit-works/front-end/assets/88307030/5f138f75-8ec5-45a0-af5f-3ac9e10ecd3e)

**타입 단언 vs 타입 선언 (화살표 함수)**

화살표 함수에서 타입 단언을 이용해 쉽게 타입을 추론할 수 있다고 생각한다.

```jsx
interface Person {
  name: string;
}
const people = ['alice', 'bob', 'jan'].map((name) => ({ name } as Person));
// Type is Person[]
```

하지만 아래 코드와 같이 타입 단언을 사용하면 타입 체크는 회피하고 런타임에서 에러가 잡히게 된다.

```jsx
interface Person {
  name: string;
}
const peopleArr = ['alice', 'bob', 'jan'].map((name) => ({} as Person));
// No error
```

화살표 함수에서는 어떻게 타입을 추론해야 할까?

먼저, 콜백 함수 내부에서 변수를 만들고 타입 선언을 통해 타입을 규정하는 방법이 있다.

```jsx
interface Person {
  name: string;
}
const peopleArrDeclarar = ['alice', 'bob', 'jan'].map((name) => {
  const person: Person = { name };
  return person;
}); // Type is Person[]
```

아래 코드는 보다 간결하게 구성한 버전이다.

(name): Person 이 쓰였다는 것을 살펴보자.

1. (name): Person ⇒ {…} : name의 타입이 없고 반환값의 타입이 Person
2. (name: Person) ⇒ {…} : name의 타입이 Person이고 반환값의 타입 없음

```jsx
interface Person {
  name: string;
}
const peopleArrDeclarar2 = ['alice', 'bob', 'jan'].map((name): Person => ({ name }));
// Type is Person[]
```

**타입 단언이 요구되는 상황은?**

타입 단언은 타입 체커로 추론되는 타입보다 개발자가 예상하는 타입이 더 정확할 때 사용되어야 한다.

예컨대, DOM 엘리먼트를 이용하는 부분에서는 개발자가 더 명확히 알고 있을 것이다. TS는 DOM에 접근할 수가 없기 때문에 가리키고 있는 엘리먼트가 무엇인지, 무슨 이벤트인지 알 수 없다.

 

아래 코드는 접미사로 !를 사용하여 null 이 아님은 단언하는 경우다.

이 경우, 타입 체커는 HTMLElement | null 이 아니라, HTMLElement 임을 확신하게 된다.

```jsx
const elNull = document.getElementById('foo');  // Type is HTMLElement | null
const el = document.getElementById('foo')!; // Type is HTMLElement
```