import { contractPrincipalCV, trueCV, uintCV } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("automatic payment dispatcher", () => {
  it("Ensures that only the owner can dispatch an automatic payment", () => {
    expect(
      simnet.callPublicFn(
        `${deployer}.ap-dispatcher`,
        "dispatch",
        [contractPrincipalCV(deployer, "scw-ap")],
        address1
      ).result
    ).toBeErr(uintCV(401));
    expect(
      simnet.callPublicFn(
        `${deployer}.ap-dispatcher`,
        "dispatch",
        [contractPrincipalCV(deployer, "scw-ap")],
        deployer
      ).result
    ).toBeOk(trueCV());
  });
});
