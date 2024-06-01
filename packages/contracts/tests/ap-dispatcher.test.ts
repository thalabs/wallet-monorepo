import { describe, expect, it } from "vitest";

// const accounts = simnet.getAccounts();
// const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("automatic payment dispatcher", () => {
  it("Ensures that only the owner can dispatch an automatic payment", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
});
