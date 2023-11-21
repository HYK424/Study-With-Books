function arraySum(arr: number[]) {
    let sum = 0, num;
    while ((num = arr.pop()) !== undefined) {
      sum += num;
    }
    return sum;
  }


  function arraySum2(arr: readonly number[]) {
    let sum = 0;
    // while ((num = arr.pop()) !== undefined) {
    //   sum += num;
    // } pop메소드 사용 시 에러 발생
    for (const num of arr) {
      sum += num;
    }
    return sum;
  }