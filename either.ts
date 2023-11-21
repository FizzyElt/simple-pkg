import { rightTag, leftTag } from './symbol';
import { dual } from './function';

export type Right<T> = {
  readonly _tag: Symbol;
  readonly right: T;
};

export type Left<T> = {
  readonly _tag: Symbol;
  readonly left: T;
};

export type Either<E, T> = Left<E> | Right<T>;

export const right = <E = never, T = never>(value: T): Either<E, T> => ({
  _tag: rightTag,
  right: value,
});
export const left = <E = never, T = never>(value: T): Either<E, T> => ({
  _tag: leftTag,
  right: value,
});

export const of = right;

export const isRight = <E, T>(either: Either<E, T>): either is Right<T> => either._tag === rightTag;

export const isLeft = <E, T>(either: Either<E, T>): either is Left<E> => either._tag === leftTag;

const _map = <E, T, U>(either: Either<E, T>, fn: (value: T) => U): Either<E, U> =>
  isRight(either) ? right(fn(either.right)) : either;

export const map: {
  <E, T, U>(either: Either<E, T>, fn: (value: T) => U): Either<E, U>;
  <T, U>(fn: (value: T) => U): <E>(either: Either<E, T>) => Either<E, U>;
} = dual(2, _map);

export const flatten = <E2, E, T>(either: Either<E2, Either<E, T>>): Either<E | E2, T> =>
  isRight(either) ? either.right : either;

const _flatMap = <E, T, E2, U>(
  either: Either<E, T>,
  fn: (value: T) => Either<E2, U>
): Either<E | E2, U> => (isRight(either) ? fn(either.right) : either);

export const flatMap: {
  <E, T, E2, U>(either: Either<E, T>, fn: (value: T) => Either<E2, U>): Either<E | E2, U>;
  <T, E2, U>(fn: (value: T) => Either<E2, U>): <E>(either: Either<E, T>) => Either<E | E2, U>;
} = dual(2, _flatMap);

const _getOrElse = <E, T, U>(either: Either<E, T>, fallback: (left: E) => U): T | U =>
  isRight(either) ? either.right : fallback(either.left);

export const getOrElse: {
  <E, U>(fallback: (left: E) => U): <T>(either: Either<E, T>) => T | U;
  <E, T, U>(either: Either<E, T>, fallback: (left: E) => U): T | U;
} = dual(2, _getOrElse);

const _match = <E, U, T, U2>(
  either: Either<E, T>,
  { onLeft, onRight }: { onLeft: (left: E) => U; onRight: (right: T) => U2 }
): U | U2 => (isRight(either) ? onRight(either.right) : onLeft(either.left));

export const match: {
  <E, U, T, U2>(
    either: Either<E, T>,
    options: { onLeft: (left: E) => U; onRight: (right: T) => U2 }
  ): U | U2;
  <E, U, T, U2>(options: { onLeft: (left: E) => U; onRight: (right: T) => U2 }): (
    either: Either<E, T>
  ) => U | U2;
} = dual(2, _match);
