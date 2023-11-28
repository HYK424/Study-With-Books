# 병목 코드 최적화

**병목 코드**

병목(영어: bottleneck) 현상은 전체 시스템의 성능이나 용량이 하나의 구성 요소로 인해 제한을 받는 현상 을 일컫는다.

병목 코드는 병목 현상을 발생하는 특정 코드를 말한다.

**개선 예시**

책에서는 인자로 넘어오는 문자열에서 특수 문자를 제거하는 함수를 예시로 들었다.

해당 함수는 각 특수 문자마다 반복문을 돌려 일치하는 내용을 탐색/ 제거 한다.

```jsx
function removeSpecialCharacter(str) {
  const removeCharacters = ['#', '_', '*', '~', '&', ';', '!', '[', ']', '`', '>', '\n', '=', '-']
  let _str = str
  let i = 0,
    j = 0

  for (i = 0; i < removeCharacters.length; i++) {
    j = 0
    while (j < _str.length) {
      if (_str[j] === removeCharacters[i]) {
        _str = _str.substring(0, j).concat(_str.substring(j + 1))
        continue
      }
      j++
    }
  }

  return _str
}
```

결과적으로, 탐색/ 제거의 로직을 위해 반복문이 2번 중첩되어 사용된다. 이는 효율적이지 않으므로,

 substring/ concat → replace함수를 사용해 리팩토링할 것을 권장한다.