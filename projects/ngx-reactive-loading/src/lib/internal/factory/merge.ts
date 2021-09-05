export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Merge<U extends readonly unknown[]> = UnionToIntersection<
  U[number]
>;
