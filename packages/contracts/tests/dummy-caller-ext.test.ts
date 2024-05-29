import { describe, expect, it } from "vitest";

describe("dummy caller", () => {
  it("ensures simnet is well initalised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
});
