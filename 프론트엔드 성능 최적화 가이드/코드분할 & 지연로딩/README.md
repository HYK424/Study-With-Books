# 코드 분할 & 지연 로딩

**코드 분할이 언제 필요한가**

필요하지 않은 작업에 필요하지 않은 코드가 끼어있을 수 있다.

A 페이지에서 필요하지 않은 라이브러리 관련 번들 코드가 같이 로드되는 경우.

**번들 파일의 정체를 어떻게 알 수 있을까**

chunk파일의 구성을 알아야 한다. 이를 위한 모니터링 라이브러리들이 존재한다.

책에서는 webpack bundle analyzer 라이브러리를 이용해 시각 자료로 번들 파일의 구성을 보여주는 예시를 들었다.

참고: https://www.npmjs.com/package/webpack-bundle-analyzer

CRA로 프로젝트를 시작한 경우는 다르다.

CRA는 webpack에 대한 설정이 숨겨져 있다. 이를 위한 라이브러리도 존재한다.

(책에서는 cra bundle analyzer 라이브러리 사용했다/ 현시점에서 마지막 업데이트가 2년 전이므로 잘 알아보고 사용할 것)

참고: https://www.npmjs.com/package/cra-bundle-analyzer

**왜 코드 분할인가**

코드 분할은 페이지에서 필요하지 않은 코드를 로드하지 않도록 하는 기법이다.

페이지별로 코드를 분할함으로써 하나의 번들 파일을 여러 개의 파일로 쪼갠다.

분할된 코드는, 해당 코드가 필요한 시점에서 로드되어 실행되는데 이를 **지연 로딩** 이라 한다.

코드 분할에는 여러 패턴이 있다.

1. 페이지 별로 코드 분할
2. 모듈 별로 코드 분할 (각 페이지가 공통으로 사용하는 모듈이 많고, 사이즈가 클 경우)

**코드 분할 적용하기**

1. 동적 import를 사용하여 코드를 분할한다 → 기본 import로 모듈을 불러올 경우, 빌드 시에 번들링이 진행된다 → 동적 import(dynamic import)를 사용하면 **런타임 시 해당 모듈**을 로드한다
2. 동적 import를 사용하면 Promise 형태로 모듈이 반환된다.
import 하려는 모듈이 컴포넌트라면 Promise 밖으로 꺼내주어야 한다.
3. 리액트는 해당 문제를 해결하기 위해 **lazy함수**와 **Suspense컴포넌트**를 제공한다.

**lazy  & Suspense**

`React.lazy`는 동적 `import()`를 호출하는 함수를 인자로 가진다. 이 함수가 반환한 값은 Suspense안에서 렌더링해야 한다.

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

`Suspense`는 lazy 컴포넌트가 로드되길 기다리는 동안 로딩 화면과 같은 예비 컨텐츠를 보여줄 수 있게 해준다.

(컴포넌트가 아직 값을 가지지 못한 경우 → fallback prop에 정의된 내용으로 렌더링)

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

이를 통해 사용자가 특정 페이지에 접근할 경우는 해당 페이지와 관련된 컴포넌트의 코드만 동적으로 화면에 띄우게 한다.