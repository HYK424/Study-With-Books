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
//getUserInfo함수의 반환 타입 선언s
