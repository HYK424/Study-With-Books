interface Vector1D {
  x: number;
}
interface Vector2D extends Vector1D {
  y: number;
} //interface Vector2D { x: number; y: number; }
interface Vector3D extends Vector2D {
  z: number;
} //interface Vector3D { x: number; y: number; z: number; }

const vector3DInstance: Vector3D = { x: 1, y: 2, z: 3 };

console.log(vector3DInstance);
