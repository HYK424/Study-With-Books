# 사전 로딩 & 지연 로딩

지연 로딩의 단점을 보완하기 위한 기법이다. 특정 데이터가 필요할 때 동적으로 불러오는 지연 로딩에서는 로드 되기 전까지 일정 시간을 기다려야 한다.

사전 로딩은 미리 데이터를 로드시켜 놓음으로써 딜레이를 줄일 수 있다.

**사전 로딩 타이밍(컴포넌트)**

그렇다면 언제 사전 로딩이 실행되야 할까. 

책에서는 모달 컴포넌트를 예시로 들고 있으며, 이때 제안된 타이밍은 2가지다.

1. 버튼 위에 마우스를 올려놓았을 때
리액트에서는 Button의 onMouseEnter 이벤트를 통해 마우스가 버튼에 올라왔는지 알 수 있다.
이 시점에서 동적 import를 실행한다.
2. 최초의 페이지가 로드되고 모든 컴포넌트의 마운트가 끝났을 때
1의 경우와 다르게, 모달 컴포넌트 크기가 크면 로드하는 데 많은 시간이 걸릴 수 있다.
대신 최초 마운트 완료 후, 브라우저에 여유가 생긴 시점에서 모달을 로드할 수 있다.

이외에도 어떤 서비스인지, 어떤 컴포넌트를 로드할 건지에 따라 타이밍을 지정할 수 있다.

**사전 로딩 타이밍(이미지)**

이미지를 HTML, CSS에서 이미지를 사용하는 시점에서 로드하는 게 아니라, JS에서 직접 로드하는 방법을 사용한다.

(HTML에서 form태그로 직접 api요청을 보내는 것보다 JS에서 api요청을 보내는 것이 로직 관리에 더 용이하다는 것과 같은 원리)

JS에서 new연산자를 통해 Image 객체의 인스턴스를 생성하고 src속성에 원하는 주소를 입력함으로써 이미지를 로드할 수 있다.

```jsx
const img = new Image();
img.src = '이미지 주소'
```

이것을 이용해 useEffect에서 특정 컴포넌트를 사전 로딩할 때, 해당 컴포넌트에서 사용되는 이미지 또한 사전 로딩되도록 한다.

**이미지 사전 로딩 2가지 방법**

책에서는 단순히 이미지 인스턴스에 반복문으로 src메소드를 실행하는 방법을 제시했다.

이외에도 재귀 함수를 사용한 방법도 있다.

1. 병렬로 이미지 사전 로딩

```jsx
useEffect(() => {
  function preloading(imageArray) {
    imageArray.forEach((url) => {
      const image = new Image();
      image.src = url;
    });
  }

  preloading(["1.png", "2.png", "3.png"]);
}, []);
```

이미지 배열을 받아 반복문을 돌린다. 이전의 이미지가 완전히 로드될 때까지 기다리지 않고 로직을 실행한다. 

로드 순서가 중요하지 않고 가능한 한 빨리 이미지를 로드할 경우 적합.

1. 재귀로 이미지 사전 로딩

```jsx
useEffect(() => {
  function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
      const image = new Image();
      image.onload = function () {
        preload(imageArray, index + 1);
      };
      image.src = images[index];
    }
  }

  preload(images);
}, []);
```

onload(이미지 로드 성공 조건)메소드로 다음 인덱스로 자신을 호출하도록 한다. 이전의 이미지가 성공적으로 로드된 후 순차적으로 다음 인덱스의 이미지를 로드한다.

이미지가 순서대로 로드 되었는지 확인하고 로드된 후 특정 작업을 수행할 때 적합하다.

- 참고: https://www.photo-mark.com/notes/image-preloading/
https://pshdev1030.github.io/2022/02/10/React-Image-preload/
[https://inpa.tistory.com/entry/JS-📚-자바스크립트-이미지-객체-사용법](https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EA%B0%9D%EC%B2%B4-%EC%82%AC%EC%9A%A9%EB%B2%95)

**지연 로딩(스크롤 이벤트)**

이미지 지연 로딩을 스크롤 이벤트에 적용할 수도 있다.

예컨대, 페이지에 이미지, 동영상 등의 컨텐츠가 많을 때 이것들을 한 번에 로드한다면 로딩 시간이 길어진다. 스크롤 이벤트에 사전 로딩 로직을 결합하여, 스크롤 이동 → 해당 뷰포트에서 이미지 로드 하도록 설정하면 될 것이다.

브라우저가 제공하는 InterSection Observer API와 useEffect를 사용하여 구현할 수 있을 것이다.

1. useEffect 안에서 InterSection Observer 인스턴스를 생성하여 ‘스크롤 이벤트로 매번 렌더링’이 실행되는 것을 막는다.
언마운트 시 클린업 함수에서 disconnect메소드를 통해 스크롤 감시를 종료한다.
2. 최초에는 이미지에 주소를 지정해주지 않고 있다가 옵저버가 뷰포트를 확인할 때 콜백 함수로 이미지를 로드하도록 한다.
이때, data-src에 먼저 이미지 주소를 넣어준 다음 이미지 로드 시점에 실제 src로 옮겨준다.

**data-src란?**

data-*는 HTML의 데이터셋 속성이다. 커스텀 사용자 속성을 DOM 요소에 저장하기 위해 사용하며 data-src도 데이터셋의 일종이다.

바로 src에 이미지 주소를 붙여주는 사전 로딩과 다르게, 먼저 data-src에 주소를 넣어주고 대기하다가 로드 트리거 발생 시 주소를 넣어주기 위해 사용한다.