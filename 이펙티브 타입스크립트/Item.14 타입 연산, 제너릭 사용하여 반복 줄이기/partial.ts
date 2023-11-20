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
//방법2
type OptionsUpdate2 = { [k in keyof Options]?: Options[k] };

class UIWidget2 {
  constructor(init: Options) {
    /* ... */
  }
  update(options: OptionsUpdate2) {
    /* ... */
  }
}
//방법3
class UIWidget3 {
  constructor(init: Options) {
    /* ... */
  }
  update(options: Partial<Options>) {
    /* ... */
  }
}
