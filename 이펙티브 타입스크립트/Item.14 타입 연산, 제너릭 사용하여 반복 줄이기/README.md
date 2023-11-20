# Item.14 Item.14 타입 연산, 제네릭 사용하여 반복 줄이기

SW개발 원칙 중 DRY 원칙이 있다. Dont Repeat yourself의 약자로, 반복되는 코드나 로직을 최소화하라는 원칙이다.

이는 TS에서도 간과해서는 안된다.

**일반적인 방법**

1. 타입에 이름 붙이기
   명명된 타입을 선언하여 중복을 줄일 수 있다.

```jsx
// function distance(a: {x: number, y: number}, b: {x: number, y: number}) {
//     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
//   }

interface Point2D {
  x: number;
  y: number;
}
function distance(a: Point2D, b: Point2D) {
  /* ... */
}
```

1. 함수 시그니처를 명명된 타입으로 분리
   2개 이상의 함수가 같은 타입을 사용하고 있다면, 명명된 타입을 선언하여 분리할 수 있다.

```jsx
interface Options {}

// function get(url: string, opts: Options): Promise<Response> {
//   /* COMPRESS */ return Promise.resolve(new Response()); /* END */
// }
// function post(url: string, opts: Options): Promise<Response> {
//   /* COMPRESS */ return Promise.resolve(new Response()); /* END */
// }
type HTTPFunction = (url: string, options: Options) => Promise<Response>;
const get: HTTPFunction = (url, options) => {
  /* COMPRESS */ return Promise.resolve(new Response()); /* END */
};
const post: HTTPFunction = (url, options) => {
  /* COMPRESS */ return Promise.resolve(new Response()); /* END */
};
```

이외에도,

1. extends 를 이용해 인터페이스 확장
2. 인터섹션(&)을 사용하여 type 확장

등의 방법을 사용할 수도 있다.

하지만 보다 특별한 상황이 존재할 수도 있다.

이를 위해 TS가 제공하는 도구들을 이용하면 간편하게 타입을 매핑할 수 있을 것이다.

유틸리티 타입이라고도 불리는 도구들은 제네릭으로 구성되어 있는데, 함수처럼 사용할 수 있다.

**Pick**

Pick은 주어진 타입에서 특정 타입만 선택하여 새로운 타입을 생성한다.

만약 A 타입이 있고, A타입의 부분 속성만으로 구성된 새로운 타입을 정의하려면 아래 코드와 같은 방법들을 사용할 수 있을 것이다.

```jsx
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

//방법1
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
};
//방법2
type TopNavState2 = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
};
```

하지만 Pick을 사용하면, 알아서 두 개의 타입을 받아 결과 타입을 반환한다.

위의 방법들보다 간결하게 타입을 구성할 수 있다.

```jsx
type TopNavState3 = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

**Partial**

Partial는 주어진 집합의 모든 타입에 대한 하위 집합을 생성한다.

만약, 생성 여부에 따라 업데이트 되는 클래스를 정의한다면 update메소드의 매개변수 타입은 생성자와 동일하되, 선택적 필드가 될 것이다.

아래 코드와 같은 방법을 사용할 수 있다.

```jsx
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
//방법1
interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

class UIWidget {
  constructor(init: Options) {
    /* ... */
  }
  update(options: OptionsUpdate) {
    /* ... */
  }
}
//방법2 - keyof 조합
type OptionsUpdate2 = { [k in keyof Options]?: Options[k] };

class UIWidget2 {
  constructor(init: Options) {
    /* ... */
  }
  update(options: OptionsUpdate2) {
    /* ... */
  }
}
```

대신 표준 라이브러리가 제공하는 Partial를 사용할 수 있다. 위의 두 방법보다 편리하게 부분 집합 타입을 만들 수 있다.

```jsx
class UIWidget3 {
  constructor(init: Options) {
    /* ... */
  }
  update(options: Partial<Options>) {
    /* ... */
  }
}
```

**typeof**

변수 값의 타입들로 구성된 새 타입을 만들 때는 typeof 연산자를 사용할 수 있다.

아래 코드는 변수를 먼저 선언한 뒤, 하드 코딩하여 새로운 타입을 만들었다.

```jsx
const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00FF00',
  label: 'VGA',
};
//방법1
interface Type_INIT_OPTIONS {
  width: number;
  height: number;
  color: string;
  label: string;
}
```

하지만 typeof 연산자를 사용하면 알아서 값에 대한 타입으로 구성된 새 타입을 생성할 수 있다.

```jsx
type Type_INIT_OPTIONS2 = typeof INIT_OPTIONS;
// {
//     width: number;
//     height: number;
//     color: string;
//     label: string;
//   } 와 같다
```

JS의 typeof연산자를 사용한 것처럼 보이나 실제로는 TS 단계에서 타입을 명시하게 된다.

이때, 타입 정의를 먼저 하고 그 값이 타입에 할당되도록 선언하면 타입 변동에 의한 실수를 최소화할 수 있다.

**ReturnType**

함수나 메서드에 대한 반환 타입을 만들 때는 ReturnType을 이용할 수 있다.

```jsx
function getUserInfo(userId: string) {
  // COMPRESS
  const name = 'Bob';
  const age = 12;
  const height = 48;
  const weight = 70;
  const favoriteColor = 'blue';
  // END
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  };
}
// Return type inferred as { userId: string; name: string; age: number, ... }

type UserInfo = ReturnType<typeof getUserInfo>;
//getUserInfo함수의 반환 타입 선언
```

이외에도 TS에서 지원하는 여러 도구들이 있으며 공식 사이트를 참고하는 것을 권장한다.

공식 사이트: https://www.typescriptlang.org/ko/docs/handbook/utility-types.html

**제네릭에서 매개변수 제한하기**

앞서 함수에서 매개변수를 제한하기 위해 제네릭을 사용했다. 이처럼 제네릭 타입에서 매개변수를 제한할 방법이 필요하다.

extends를 사용하면 제네릭 매개변수가 특정 타입으로 확장하도록 선언할 수 있다.

아래 코드처럼 제한할 형식의 타입을 생성한 후 제네릭 타입에 extends 매개변수로 넣어주면 된다.

```jsx
interface Name {
  first: string;
  last: string;
}
type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  { first: 'Fred', last: 'Astaire' },
  { first: 'Ginger', last: 'Rogers' },
]; // OK
```

아래 스샷처럼 조건에 부합하지 않는 매개변수를 넣어줄 경우 에러가 발생한다.

![14-1](https://github.com/planit-works/front-end/assets/88307030/a71d2939-2a99-41ba-bf95-790ec1eefe47)

유틸리티 도구에서도 제네릭을 통해 매개변수를 제한할 수 있다.

예를 들어 Pick에서도 첫 번째 매개변수 값에 포함되지 않는 값을 두 번째 매개변수로 넣을 경우 에러가 발생한다.

```jsx
interface Name {
  first: string;
  last: string;
}

type FirstLast = Pick<Name, 'first' | 'last'>; // Ok
type FirstMiddle = Pick<Name, 'first' | 'middle'>; //에러 발생
```

- 참고: https://www.typescriptlang.org/ko/docs/handbook/utility-types.html
  https://github.com/danvk/effective-typescript/tree/master/samples/ch02-types/item-14-map-between-types
