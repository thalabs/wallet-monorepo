import {
  ResponseOkCV,
  SomeCV,
  TupleCV,
  UIntCV,
  contractPrincipalCV,
  listCV,
  principalCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { chargeWallet, setExtension, setTokenWL, getStxBalance } from "./util";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("Automatic payment", () => {
  // FIXME: the test doesn't work because simnet deployment is fluctuating
  // it("expects to find the token id, amount, cadence, expiry, whitelisted dispatchers that will be used for tha payment", async () => {
  //   const tokenQueryResult = simnet.callReadOnlyFn(
  //     `${deployer}.scw-ap`,
  //     "get-ap-meta",
  //     [],
  //     address1
  //   ).result;
  //   const blockTimeDay = 144;
  //   expect(tokenQueryResult).toBeOk(
  //     tupleCV({
  //       cadence: uintCV(blockTimeDay),
  //       "expires-at": someCV(uintCV(blockTimeDay * 7 + simnet.blockHeight - 1)),
  //       "dispatcher-whitelist": listCV([
  //         contractPrincipalCV(deployer, "ap-dispatcher"),
  //       ]),
  //     })
  //   );
  // });
  it("ensures only owner can add and remove dispatchers from the whitelist", async () => {
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeErr(uintCV(401));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address2)],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callReadOnlyFn(
        `${deployer}.scw-ap`,
        "get-dispatchers",
        [],
        deployer,
      ).result,
    ).toBeOk(
      listCV([
        contractPrincipalCV(deployer, "ap-dispatcher"),
        principalCV(address1),
        principalCV(address2),
      ]),
    );
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "remove-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "remove-dispatcher",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeErr(uintCV(401));

    expect(
      simnet.callReadOnlyFn(
        `${deployer}.scw-ap`,
        "get-dispatchers",
        [],
        deployer,
      ).result,
    ).toBeOk(
      listCV([
        contractPrincipalCV(deployer, "ap-dispatcher"),
        principalCV(address2),
      ]),
    );
  });
  it("expects that only the owner or a whitelisted dispatcher can call this function", async () => {
    chargeWallet({ amount: 1000_000_000 });
    setExtension("scw-sip-010", true, deployer);
    setExtension("scw-ap", true, deployer);
    simnet.mineEmptyBlocks(144);
    setTokenWL(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      true,
      deployer,
    );
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeErr(uintCV(401));

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    const beforeBalance = getStxBalance(address1);

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeOk(trueCV());

    const afterBalance = getStxBalance(address1);
    expect(afterBalance - beforeBalance).toEqual(500_000n);
  });
  it("ensures cadence is enforced", () => {
    simnet.mineEmptyBlocks(144);
    chargeWallet({ amount: 1000_000_000 });
    setExtension("scw-sip-010", true, deployer);
    setExtension("scw-ap", true, deployer);
    setTokenWL(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      true,
      deployer,
    );
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeOk(trueCV());

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeErr(uintCV(402));

    const result = simnet.callReadOnlyFn(
      `${deployer}.scw-ap`,
      "get-ap-meta",
      [],
      deployer,
    ).result as ResponseOkCV<TupleCV<{ cadence: UIntCV }>>;

    simnet.mineEmptyBlocks(Number(result.value.data.cadence.value));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeOk(trueCV());
  });
  it("ensures that the ap is disabled when expiry is reached", async () => {
    simnet.mineEmptyBlocks(100);
    chargeWallet({ amount: 1000_000_000 });
    setExtension("scw-sip-010", true, deployer);
    setExtension("scw-ap", true, deployer);
    setTokenWL(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      true,
      deployer,
    );
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "add-dispatcher",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    simnet.mineEmptyBlocks(100);
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeOk(trueCV());

    const result = simnet.callReadOnlyFn(
      `${deployer}.scw-ap`,
      "get-ap-meta",
      [],
      deployer,
    ).result as ResponseOkCV<
      TupleCV<{ cadence: UIntCV; "expires-at": SomeCV<UIntCV> }>
    >;

    simnet.mineEmptyBlocks(Number(result.value.data["expires-at"].value.value));

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        address1,
      ).result,
    ).toBeErr(uintCV(408));
  });
});
