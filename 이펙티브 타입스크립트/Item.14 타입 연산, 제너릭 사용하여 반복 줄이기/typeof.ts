const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00FF00',
  label: 'VGA',
};
//방법1
interface Type_INIT_OPTIONS {
  width: number;
  height: number;
  color: string;
  label: string;
}
//방법2
type Type_INIT_OPTIONS2 = typeof INIT_OPTIONS;
// {
//     width: number;
//     height: number;
//     color: string;
//     label: string;
//   } 와 같다
