# Item.7 타입은 값들의 집합

**TS에서 타입은 단일 값인가?**

런타임에서 JS의 변수들에는 고유한 값들이 할당된다. 그리고 TS가 에러를 체크할 때는 변수에 지정된 ‘타입’을 확인하게 된다.

여기서 타입은, ‘할당 가능한 값들의 집합’ 이다.

가장 작은 집합은 공집합이다. TS에서는 이를 never 타입으로 나타낸다. 따라서, never 타입에는 아무런 값도 할당할 수 없다.

```jsx
const x: never = 12;
   // ~ Type '12' is not assignable to type 'never'
```

다음으로 작은 집합은 ‘한 가지 값만 포함하는’ 타입이다. TS에서는 이를 유닛 타입으로 부른다.

```jsx
type A = 'A';
type B = 'B';
type Twelve = 12;
```

**Union타입**

리터럴 타입을 복수로 사용하기 위해서는 유니온 타입을 사용하면 된다.

아래 코드에서는 변수 a에 유니온 타입으로 묶은 ‘A’, ‘B’가 할당가능하다.

반대로 변수 c에 유니온 타입이 아닌 값을 할당하려고 하자 TS가 에러를 내뱉는다.

```jsx
type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
const a: AB = 'A'; // OK, value 'A' is a member of the set {'A', 'B'}
const c: AB = 'C';
// ~ Type '"C"' is not assignable to type 'AB'
```

**keyof 연산자를 사용할 경우, 유니온 타입 사용에 주의를 요한다**

keyof는 객체 타입을 받아 객체의 key들로 구성된 유니온 타입을 생성하는 연산자다.

유니온 타입에 대한 유니온 타입을 생성한다는 건, 유니온 타입에 대한 '합집합'을 생성한다는 것이다.



합집합 조건은, 'A와 B의 합집합은 A∪B={a∣a∈A 또는 a∈B}' 이다.

즉, 아래 코드에서 타입 K가 Person2, LifeSpan에 대해 합집합을 구성하려면 Person2나 LifeSpan에 속하는 속성이 있어야 한다.

그러나 Person2나 LifeSpan에 속할 수 있는 공통된 요소는 없으므로 never를 추론하게 된다. 

```jsx
interface Identified {
  id: string;
}
interface Person2 {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}

type J = keyof Identified; //"id"
type K = keyof (Person2 | Lifespan); //never
```

**Intersection타입**

인터섹션 타입을 사용하여 집합으로 사용할 수도 있다.

인터섹션 타입은 &연산자를 사용하며 교집합을 계산한다. 

아래 코드처럼 인터페이스에 &을 사용하면 공통된 속성이 없기 때문에 공집합(never 타입)을 예상할 수도 있지만, 타입의 관점에서는 다른 결과가 나오게 된다.

```jsx
interface Identified {
    id: string;
  }
  interface Person2 {
    name: string;
  }
  interface Lifespan {
    birth: Date;
    death?: Date;
  }

  type PersonSpan = Person2 & Lifespan;
  const ps: PersonSpan = {
    name: 'Alan Turing',
    birth: new Date('1912/06/23'),
    death: new Date('1954/06/07'),
  };  // OK
```

TS는 덕 타이핑 기반의 JS를 모델링하기 위해 구조적 타이핑를 사용한다.

(JS의 덕 타이핑과 TS의 구조적 타이핑의 개념은 다르지 않다. 다만, 덕 타이핑은 JS 런타임 중에 인식되지만 구조적 타이핑은 컴파일 단계에서 유효 호환성을 체크하면서 사용된다.)

따라서 타입에서 교집합이 존재한려면 Person2와 LifeSpan의 모든 속성을 갖고 있는 타입을 가지고 있어야 한다. 반대로, Person2와 LifeSpan의 속성을 모두 가지고 있는 타입이 존재하기에 Person2, LifeSpan이 각각 존재해도 문제되지 않는다.

**extends**

Java에서는 extends로 상속한다. TS에서도 비슷하게 사용할 수 있는데, 이 경우 상속 보다는 부분 집합 개념의 확장에 가깝다.

```jsx
interface Vector1D {
  x: number;
}
interface Vector2D extends Vector1D {
  y: number;
} //interface Vector2D { x: number; y: number; }
interface Vector3D extends Vector2D {
  z: number;
} //interface Vector3D { x: number; y: number; z: number; }

const vector3DInstance: Vector3D = { x: 1, y: 2, z: 3 };

console.log(vector3DInstance);
```

extends 키워드는 제네릭 타입의 한정자로도 사용할 수 있다. 

아래 코드에서 k는 ‘string을 부분 집합으로 갖는 어떠한 타입’이 된다.

```tsx
function getKey<K extends string>(val: any, key: K) {
  // ...
}
getKey({}, 'x'); // OK, 'x' extends string
getKey({}, Math.random() < 0.5 ? 'a' : 'b'); // OK, 'a'|'b' extends string
getKey({}, document.title); // OK, string extends string
getKey({}, 12);
// ~~ Type '12' is not assignable to parameter of type 'string'
```

**배열을 통해 타입이 집합이라는 예시 살펴보기**

아래 코드 첫 번째 예시를 보자. number[]는 [number, number]의 부분 집합이 아니므로 에러가 난다.

두 번째 예시에서 변수triple은 구조적 타이핑의 관점에서 [number, number]타입의 double에 할당 가능할 것 같다. 그러나 에러가 발생한다.

두 타입은 엄연히 길이가 다른 배열이므로 연관 관계가 없다. 속성이 같다고 해서 구조적 타이핑의 규칙에 의해 두 타입이 호환되지 않으며 집합의 관점에서도 일치하는 부분이 없다.

```jsx
//1
const list = [1, 2]; // Type is number[]
const tuple: [number, number] = list;
// ~~~~~ Type 'number[]' is missing the following
//       properties from type '[number, number]': 0, 1
//2
const triple: [number, number, number] = [1, 2, 3];
const double: [number, number] = triple;
// ~~~~~~ '[number, number, number]' is not assignable to '[number, number]'
//          Types of property 'length' are incompatible
//          Type '3' is not assignable to type '2'
```

참고

- https://blog.hwahae.co.kr/all/tech/9954