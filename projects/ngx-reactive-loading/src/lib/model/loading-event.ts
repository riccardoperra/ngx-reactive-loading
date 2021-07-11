export type LoadingEvent<T extends PropertyKey = PropertyKey> = {
  type: T;
  loading: boolean;
};
