import {UNDEFINED} from './strings.ts';
import {isInstanceOf} from './other.ts';
import {object} from './obj.ts';

export const jsonStringWithMap = (obj: unknown): string =>
  JSON.stringify(obj, (_key, value) =>
    isInstanceOf(value, Map) ? object.fromEntries([...value]) : value,
  );

export const jsonParse = JSON.parse;

export const jsonStringWithUndefined = (obj: unknown): string =>
  JSON.stringify(obj, (_key, value) =>
    value === undefined ? UNDEFINED : value,
  );

export const jsonParseWithUndefined = (str: string): any =>
  JSON.parse(str, (_key, value) => (value === UNDEFINED ? undefined : value));
