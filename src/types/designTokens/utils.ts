export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
