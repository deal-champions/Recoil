/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+recoil
 * @flow strict-local
 * @format
 */

'use strict';

// @fb-only: const expectationViolation = require('expectationViolation');

// prettier-ignore
function expectationViolation(format: string, ...args: $ReadOnlyArray<mixed>) { // @oss-only
  if (__DEV__) { // @oss-only
    const message = `${format} ${args}`;
    const error = new Error(message); // @oss-only
    error.name = 'Expectation Violation'; // @oss-only
    console.error(error); // @oss-only
  } // @oss-only
} // @oss-only

module.exports = expectationViolation;
