import {
  contractPrincipalCV,
  listCV,
  principalCV,
  someCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("Automatic payment", () => {
  it("expects to find the token id, amount, cadence, expiry, whitelisted dispatchers that will be used for tha payment", async () => {
    const tokenQueryResult = simnet.callReadOnlyFn(
      `${deployer}.scw-ap`,
      "get-ap-meta",
      [],
      address1
    ).result;
    const blockTimeDay = 144;

    expect(tokenQueryResult).toBeOk(
      tupleCV({
        "token-id": contractPrincipalCV(deployer, "wstx"),
        amount: uintCV(1000_000),
        cadence: uintCV(blockTimeDay),
        "expires-at": someCV(uintCV(blockTimeDay * 7 + simnet.blockHeight - 1)),
        "dispatcher-whitelist": listCV([principalCV(deployer)]),
      })
    );
  });

  it;
});
