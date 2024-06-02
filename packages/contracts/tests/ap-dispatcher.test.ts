import { contractPrincipalCV, trueCV, uintCV } from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { chargeWallet, getStxBalance, setExtension, setTokenWL } from "./util";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("automatic payment dispatcher", () => {
  it("Ensures that only the owner can dispatch an automatic payment", () => {
    chargeWallet({ amount: 1000_000_000 });
    setExtension("scw-sip-010", true, deployer);
    setExtension("scw-ap", true, deployer);
    setTokenWL(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      true,
      deployer,
    );
    const beforeBalance = getStxBalance(deployer);
    expect(
      simnet.callPublicFn(
        `${deployer}.ap-dispatcher`,
        "dispatch",
        [contractPrincipalCV(deployer, "scw-ap")],
        address1,
      ).result,
    ).toBeErr(uintCV(401));

    expect(
      simnet.callPublicFn(
        `${deployer}.ap-dispatcher`,
        "dispatch",
        [contractPrincipalCV(deployer, "scw-ap")],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    const afterBalance = getStxBalance(deployer);
    expect(afterBalance - beforeBalance).toEqual(500_000n);
  });
});
