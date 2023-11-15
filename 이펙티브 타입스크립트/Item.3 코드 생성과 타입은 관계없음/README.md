# Item.3 코드 생성과 타입은 상관 없음

**타입 스크립트 컴파일러가 수행하는 역할 2가지**

1. 최신의 JS/TS → 구버전의 JS로 트랜스파일
2. 코드의 타입 오류 체크

여기서 위 2가지는 서로 독립적으로 실행된다.
즉, 컴파일은 타입 체크와 상관없이 독립적으로 동작 → **타입 에러가 있는 코드도 컴파일 될 수 있다.**

만약 타입 에러가 있을 때 컴파일 하지 않으려면 어떻게 해야 할까?
tsconfig.json 에서 noEmitOnError: true 로 설정한다.

```jsx
"compilerOptions": {
    noEmitOnError": true, //에러 발생 시 컴파일 금지, 기본은 false로 설정
}
```

**타입 연산은 런타임에 영향을 주지 않는다.**

먼저, 아래의 함수에서는 타입 에러가 발생하지 않는다.

```jsx
function asNumber(val: number | string): number {
  return val as number;
}
```

 as 키워드를 사용하여 결과값을 number로 고정시킴으로써 이 함수의 반환값은 ‘항상’ number라고  타입을 단언했기 때문이다.

그리고 컴파일되어 변환된 JS코드는 다음과 같다. 이 코드에는 아무런 변화가 일어나지 않았다.

타입 단언을 했다고 반환값이 반드시 number로 고정된다는 게 아니란 뜻이다.

```jsx
function asNumber(val) {
  return val;
}
```

즉, 원래의 의도대로 값을 정제하기 위해서는 JS 코드로 연산 과정을 추가해야 한다.

이제 런타임 과정에서 타입을 체크하고, 그에 따라 정제된 값을 반환하게 된다.

```jsx
function asNumberRefined(val: number | string): number {
  return typeof val === 'string' ? Number(val) : val;
}
```

**런타임 타입과 선언된 타입이 다를 수도 있다.**

아래 코드는 API요청에 따라 switch문에서 각기 다른 결과를 반환하도록 하는 로직이다.

```tsx
function turnLightOn() {}
function turnLightOff() {}
function setLightSwitch(value: boolean) {
  switch (value) {
    case true:
      turnLightOn();
      break;
    case false:
      turnLightOff();
      break;
    default:
      console.log(`I'm afraid I can't do that.`);
  }
}
interface LightApiResponse {
  lightSwitchValue: boolean;
}
async function setLight() {
  const response = await fetch('/light');
  const result: LightApiResponse = await response.json();
  setLightSwitch(result.lightSwitchValue);
}
```

‘/light’ api요청에 따른 반환값이 boolean 이라는 것을 가정하고 함수가 정의되어 있다.

하지만 api가 변경되어 반환값이 boolean이 아닌 number나 string이라면? 원래의 의도와 다르게 switch문이 동작하지 않을 수 있다.

런타임 타입과 선언된 타입이 다를 수 있음을 명시하고 코드를 짜도록 하자.

**즉, TS의 타입은 런타임 성능에 영향을 주지 않는다.**

위의 예시들에서 알 수 있듯이 TS의 타입은 JS의 런타임 성능에 영향을 주지 않는다. 타입과 타입 연산자는 JS변환 시점에 제거되기 때문이다.

타입 에러가 존재하더라도 컴파일은 가능하며/ 런타임에서 타입을 체크하려면 별도의 로직을 추가해야 한다.