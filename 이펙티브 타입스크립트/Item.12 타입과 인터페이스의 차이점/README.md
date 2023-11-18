# Item.13 타입과 인터페이스의 차이점

TS에서 명명된 타입을 정의하는 방법 2가지

1. type 키워드를 사용하여 타입 정의
2. interface 키워드를 사용하여 타입 정의

```jsx
type TState = {
  name: string,
  capital: string,
};
interface IState {
  name: string;
  capital: string;
}
```

어떤 방법을 사용하던 간에 타입을 정의하는 데는 문제 없다. 그러나 ‘어떠한’ 상황에서 사용되는지를 알면 일관성 있는 코드를 짤 수 있을 것이다.

**유니온의 유무**

유니온 타입은 존재하지만 유니온 인터페이스는 없다.

인터페이스에서 유니온 타입을 이용해 확장하는 건 가능하다. 아래 코드는 별도의 두 타입을 하나의 변수명으로 매핑하여 인터페이스를 만드는 예시다.

```jsx
type Input = {
  /* ... */
};
type Output = {
  /* ... */
};
interface VariableMap {
  [name: string]: Input | Output;
}
```

아래 코드는 인터페이스로는 할 수 없는, 유니온 타입의 확장 방법이다.

```jsx
type NamedVariable = (Input | Output) & { name: string };
```

**배열 타입 구현**

배열 타입은 타입 키워드를 사용하는 것이 더 간결하다.

1. 타입을 이용한 구현

```jsx
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```

1. 인터페이스를 이용한 구현

```jsx
interface Tuple {
  0: number;
  1: number;
  length: 2;
}
const t: Tuple = [10, 20]; // OK
```

사실 배열 타입을 정의하는 데 타입이나 인터페이스나 큰 차이가 없어 보일 수도 있다.

하지만 가장 큰 차이점은, 인터페이스를 이용한 구현에는 배열 메소드를 사용할 수 없다는 데 있다.

![13-1](https://github.com/planit-works/front-end/assets/88307030/1d14dd05-1cab-4587-991b-88511ea7acda)

**선언 병합**

선언 병합(declarartion merging)은 속성을 확장하는 기법으로, 인터페이스를 사용해야만 한다.

아래 코드처럼 동일한 이름의 인터페이스를 여러 번 선언하면 TS는 이를 병합하게 된다.

```jsx
interface IState {
  name: string;
  capital: string;
}
interface IState {
  population: number;
}
const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000,
}; // OK
```

기본적으로 TS는 여러 버전의 JS 라이브러리에서 타입을 모아 병합한다.

예를 들어, Array 인터페이스는 lib.es5.d.ts에 정의되어 있으며 해당 파일에 선언된 인터페이스가 사용된다. 그러나 tsconfig.json 목록에 ES2015를 추가하면 TS는 lib.es2015.d.ts에 선언된 인터페이스를 병합하게 된다.
이때 ES2015에 추가된 Array메소드가 새로 병합된다(es5 + es2015).

즉, 선언 병합은 TS컴파일러가 동일한 이름을 가진 여러 개의 개별 선언을 단일 정의로 결합하는 프로세스라고 할 수 있다.

언뜻 보면 extends 이용해 인터페이스를 확장하여 사용하는 방법과 비슷해 보인다.
둘은 어떤 차이점이 있을까?

1. 자동 확장 vs 명시적 확장

   선언 병합: 동일한 이름의 인터페이스를 여러 번 선언함으로써 자동 병합

   extends: 인터페이스를 명시적으로 확장하여 새로운 유형을 만듦

2. 기존 선언의 재사용
   선언 병합: 기존 선언과 함께 사용하며 외부 라이브러리에서 유형을 확장할 때 사용. 기존 선언이 재구성된다.
   extends: 기존 인터페이스는 유지됨.

**그래서 언제 사용해야 할까?**

1. 타입
   1. 복잡한 타입인 경우
2. 인터페이스
   1. 향후 타입 보강의 가능성이 있는 프로젝트인 경우 (ex: API)
3. 타입과 인터페이스 모두 작업이 가능하다면 일관성에 따라 취사 선택
