# Item.12 함수 표현식에 타입 적용하기

JS에서 함수를 선언하는 데는 2가지 방법이 있다. 함수 선언식과 함수 표현식이다.

호이스팅 문제를 회피하기 위해서나 콜백함수로 이용 가능하다는 점에서 함수 표현식을 사용하곤 한다.

TS에서도 함수 표현식을 권장하고 있다.

**함수 타입의 재사용성**

함수 선언식에서 TS를 사용하려면 아래와 같이 정의해야 할 것이다.

```jsx
function add(a: number, b: number) {
  return a + b;
}
function sub(a: number, b: number) {
  return a - b;
}
function mul(a: number, b: number) {
  return a * b;
}
function div(a: number, b: number) {
  return a / b;
}
```

그러나 함수 표현식으로 타입을 선언하면 중복되는 함수에 대해 재사용이 가능하다.

```jsx
type BinaryFn = (a: number, b: number) => number;
const add2: BinaryFn = (a, b) => a + b;
const sub2: BinaryFn = (a, b) => a - b;
const mul2: BinaryFn = (a, b) => a * b;
const div2: BinaryFn = (a, b) => a / b;
```

**다른 함수의 시그니처(고유 형태)와 동일한 타입을 가지는 새 함수를 작성할 경우**

예를 들어 fetch함수를 사용하여 새로운 함수를 만든다고 해보자.

함수 선언식을 사용하면 다음과 같이 작성할 수 있다.

```jsx
async function checkedFetchDeclarar(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    // Converted to a rejected Promise in an async function
    throw new Error('Request failed: ' + response.status);
  }
  return response;
}
```

함수 표현식에서는 typeof를 사용하여 더 간결하게 만들 수 있다.

typeof fetch 로 함수 전체에 타입을 적용하여 인자인 (input, init)의 타입을 추론하도록 한다.

에러 체크의 측면에서도 typeof fetch를 통해 fetch함수와 동일한 반환 타입을 보장받기 때문에, throw 대신 return 을 사용하면 에러가 발생한다.
