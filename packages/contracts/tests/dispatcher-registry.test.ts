import {
  principalCV,
  uintCV,
  trueCV,
  contractPrincipalCV,
  falseCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("dispatcher registry", () => {
  it("ensures our dispatcher is enabled by default", () => {
    expect(
      simnet.callReadOnlyFn(
        `${deployer}.dispatcher-registry`,
        "is-dispatcher",
        [contractPrincipalCV(deployer, "ap-dispatcher")],
        deployer,
      ).result,
    ).toBeOk(trueCV());
  });
  it("ensures only owner can add and remove dispatchers from the whitelist", async () => {
    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), trueCV()],
        address1,
      ).result,
    ).toBeErr(uintCV(401));
    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), trueCV()],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address2), trueCV()],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    [principalCV(address1), principalCV(address2)].forEach((dispatcher) =>
      expect(
        simnet.callReadOnlyFn(
          `${deployer}.dispatcher-registry`,
          "is-dispatcher",
          [dispatcher],
          deployer,
        ).result,
      ).toBeOk(trueCV()),
    );

    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), falseCV()],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callReadOnlyFn(
        `${deployer}.dispatcher-registry`,
        "is-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(falseCV());
  });
});
