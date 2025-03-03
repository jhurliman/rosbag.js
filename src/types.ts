// Copyright (c) 2018-present, Cruise LLC

// This source code is licensed under the Apache License, Version 2.0,
// found in the LICENSE file in the root directory of this source tree.
// You may not use this file except in compliance with the License.

// A function that must be called with either an error or a value, but not both
export interface Callback<T> {
  (err: Error, result?: null): void;
  (err: undefined | null, result: T): void;
}

export type RawFields = { [k: string]: Buffer };

export interface Constructor<T> {
  new (fields: RawFields): T;
}

// Represents a timestamp based on the UNIX epoch (1970 Jan 1).
// See also: http://wiki.ros.org/roscpp/Overview/Time
export interface Time {
  // whole seconds
  sec: number;
  // additional nanoseconds past the sec value
  nsec: number;
}

export interface Filelike {
  read(offset: number, length: number, callback: Callback<Buffer>): void;
  size(): number;
}

export type RosMsgField = {
  type: string;
  name: string;
  isComplex?: boolean;

  // For arrays
  isArray?: boolean;
  arrayLength?: number | null | undefined;

  // For constants
  isConstant?: boolean;
  value?: string | number | boolean | undefined;
};

export type RosMsgDefinition = {
  name?: string;
  definitions: RosMsgField[];
};
export type NamedRosMsgDefinition = {
  name: string;
  definitions: RosMsgField[];
};
