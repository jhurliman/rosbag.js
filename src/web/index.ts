// Copyright (c) 2018-present, Cruise LLC

// This source code is licensed under the Apache License, Version 2.0,
// found in the LICENSE file in the root directory of this source tree.
// You may not use this file except in compliance with the License.

import { Buffer } from "buffer";

import { Callback } from "../types";
import Bag from "../bag";
import BagReader from "../BagReader";
import { extractFields, extractTime } from "../fields";
import { MessageReader } from "../MessageReader";
import { MessageWriter } from "../MessageWriter";
import { parseMessageDefinition, rosPrimitiveTypes } from "../parseMessageDefinition";
import * as TimeUtil from "../TimeUtil";

// browser reader for Blob|File objects
export class Reader {
  _blob: Blob;
  _size: number;

  constructor(blob: Blob) {
    this._blob = blob;
    this._size = blob.size;
  }

  // read length (bytes) starting from offset (bytes)
  // callback(err, buffer)
  read(offset: number, length: number, cb: Callback<Buffer>) {
    const reader = new FileReader();
    reader.onload = function () {
      reader.onload = null;
      reader.onerror = null;
      cb(null, Buffer.from(reader.result as ArrayBuffer));
    };
    reader.onerror = function () {
      reader.onload = null;
      reader.onerror = null;
      cb(reader.error ?? new Error("Unknown FileReader error"));
    };
    reader.readAsArrayBuffer(this._blob.slice(offset, offset + length));
  }

  // return the size of the file
  size() {
    return this._size;
  }
}

const open = async (file: File | string) => {
  if (!(file instanceof Blob)) {
    throw new Error(
      "Expected file to be a File or Blob. Make sure you are correctly importing the node or web version of Bag."
    );
  }
  const bag = new Bag(new BagReader(new Reader(file)));
  await bag.open();
  return bag;
};
Bag.open = open;

export * from "../types";
export {
  TimeUtil,
  BagReader,
  MessageReader,
  MessageWriter,
  open,
  parseMessageDefinition,
  rosPrimitiveTypes,
  extractFields,
  extractTime,
};
export default Bag;
