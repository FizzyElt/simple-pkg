import { dual } from './function';
import { someTag, noneTag } from './symbol';

export type None = {
  readonly _tag: Symbol;
};

export type Some<T> = {
  readonly _tag: Symbol;
  readonly value: T;
};

export type Option<T> = Some<T> | None;

export const some = <T>(value: T): Option<T> => ({
  _tag: someTag,
  value,
});

export const none = <T = never>(): Option<T> => ({
  _tag: noneTag,
});

export const of = some;

export const isSome = <T>(option: Option<T>): option is Some<T> => option._tag === someTag;

export const isNone = <T>(option: Option<T>): option is None => option._tag === noneTag;

const _map = <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> =>
  isSome(option) ? some(fn(option.value)) : option;

export const map: {
  <T, U>(option: Option<T>, fn: (value: T) => U): Option<U>;
  <T, U>(fn: (value: T) => U): (option: Option<T>) => Option<U>;
} = dual(2, _map);

export const flatten = <T>(option: Option<Option<T>>): Option<T> =>
  isSome(option) ? option.value : option;

const _flatMap = <T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> =>
  isSome(option) ? fn(option.value) : option;

export const flatMap: {
  <T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U>;
  <T, U>(fn: (value: T) => Option<U>): (option: Option<T>) => Option<U>;
} = dual(2, _flatMap);

const _getOrElse = <T, U>(option: Option<T>, fallback: () => U): T | U =>
  isSome(option) ? option.value : fallback();

export const getOrElse: {
  <T, U>(option: Option<T>, fallback: () => U): T;
  <U>(fallback: () => U): <T>(option: Option<T>) => T | U;
} = dual(2, _getOrElse);

const _match = <T, A, B>(
  option: Option<T>,
  { onSome, onNone }: { onSome: (value: T) => A; onNone: () => B }
): A | B => (isSome(option) ? onSome(option.value) : onNone());

export const match: {
  <T, A, B>(option: Option<T>, options: { onSome: (value: T) => A; onNone: () => B }): A | B;
  <T, A, B>(options: { onSome: (value: T) => A; onNone: () => B }): (option: Option<T>) => A | B;
} = dual(2, _match);
