type InferObject<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type OptionalPropertyNames<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadLeftRight<L, R> = InferObject<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

export type MergeObject<A extends readonly [...unknown[]]> = A extends [
  infer L,
  ...infer R
]
  ? SpreadLeftRight<L, MergeObject<R>>
  : unknown;
