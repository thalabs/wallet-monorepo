import {
  principalCV,
  uintCV,
  trueCV,
  contractPrincipalCV,
  falseCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const address1 = accounts.get("wallet_1")!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const address2 = accounts.get("wallet_2")!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("dispatcher registry", () => {
  it("should enable our dispatcher by default", () => {
    expect(
      simnet.callReadOnlyFn(
        `${deployer}.dispatcher-registry`,
        "is-dispatcher",
        [contractPrincipalCV(deployer, "ap-dispatcher")],
        deployer,
      ).result,
    ).toBeOk(trueCV());
  });

  it("should only allow the owner to add dispatchers", () => {
    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), trueCV()],
        address1,
      ).result,
    ).toBeErr(uintCV(401));
  });

  it("should indicate that a dispatcher is not set if it wasn't set before", () => {
    expect(
      simnet.callReadOnlyFn(
        `${deployer}.dispatcher-registry`,
        "is-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(falseCV());
  });

  it("should correctly set the dispatcher when authorized", () => {
    expect(
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), trueCV()],
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
    ).toBeOk(trueCV());
  });

  it("should indicate that a dispatcher is not set after it has been removed", () => {
    simnet.callPublicFn(
      `${deployer}.dispatcher-registry`,
      "set-dispatcher",
      [principalCV(address1), falseCV()],
      deployer,
    ).result;

    expect(
      simnet.callReadOnlyFn(
        `${deployer}.dispatcher-registry`,
        "is-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(falseCV());
  });

  it("should allow the owner to add multiple dispatchers", () => {
    const dispatchers = [principalCV(address1), principalCV(address2)];
    dispatchers.forEach((dispatcher) => {
      simnet.callPublicFn(
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [dispatcher, trueCV()],
        deployer,
      ).result;
    });

    dispatchers.forEach((dispatcher) => {
      expect(
        simnet.callReadOnlyFn(
          `${deployer}.dispatcher-registry`,
          "is-dispatcher",
          [dispatcher],
          deployer,
        ).result,
      ).toBeOk(trueCV());
    });
  });
});
