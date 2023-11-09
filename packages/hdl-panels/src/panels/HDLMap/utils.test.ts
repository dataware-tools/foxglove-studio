// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { getLastIndexBeforeTime } from "./utils";

describe("utils", () => {
  describe("getLastIndexBeforeTime", () => {
    it("returns the last index before specified time", () => {
      const timeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const r1 = getLastIndexBeforeTime(timeArray, 3.5);
      const r2 = getLastIndexBeforeTime(timeArray, 0);
      const r3 = getLastIndexBeforeTime(timeArray, 10);
      expect(r1).toBe(2);
      expect(r2).toBeUndefined();
      expect(r3).toBe(8);
    });
  });
});
