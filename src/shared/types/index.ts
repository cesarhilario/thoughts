export type RemoveAttribute<T, K extends keyof T> = Omit<T, K>;
export type Replace<T, R> = Omit<T, keyof R> & R;
