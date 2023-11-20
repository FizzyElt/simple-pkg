import { someTag, noneTag } from './symbol';

type None = {
  readonly _tag: Symbol;
};

type Some<T> = {
  readonly _tag: Symbol;
  readonly value: T;
};

type Option<T> = Some<T> | None;

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
