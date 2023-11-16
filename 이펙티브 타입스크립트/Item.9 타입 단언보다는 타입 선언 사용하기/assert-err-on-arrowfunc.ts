interface Person {
  name: string;
}
const peopleArr = ['alice', 'bob', 'jan'].map((name) => ({} as Person));
// No error
