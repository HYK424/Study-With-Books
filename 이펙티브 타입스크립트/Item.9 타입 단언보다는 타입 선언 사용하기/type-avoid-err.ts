interface PersonName { name: string };
const tom: PersonName = {};
   // ~~~~~ Property 'name' is missing in type '{}'
   //       but required in type 'Person'
const james = {} as PersonName;  // No error