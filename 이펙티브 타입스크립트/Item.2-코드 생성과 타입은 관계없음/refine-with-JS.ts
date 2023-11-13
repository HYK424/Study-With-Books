function asNumberRefined(val: number | string): number {
  return typeof val === 'string' ? Number(val) : val;
}
