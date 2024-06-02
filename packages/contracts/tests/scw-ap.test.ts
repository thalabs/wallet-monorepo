import {
  NoneCV,
  ResponseOkCV,
  SomeCV,
  TupleCV,
  UIntCV,
  noneCV,
  principalCV,
  someCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";
import { chargeWallet, setExtension, setTokenWL, getStxBalance } from "./util";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/
const setupTest = () => {
  chargeWallet({ amount: 1000_000_000 });
  setExtension("scw-sip-010", true, deployer);
  setExtension("scw-ap", true, deployer);
  setTokenWL("SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx", true, deployer);
};
describe("Automatic payment", () => {
  beforeEach(setupTest);
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
  it("expects that only the owner or a whitelisted dispatcher can call this function", async () => {
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
        `${deployer}.dispatcher-registry`,
        "set-dispatcher",
        [principalCV(address1), trueCV()],
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
  it("ensures user can update the expiry of the AP", () => {
    const result = simnet.callReadOnlyFn(
      `${deployer}.scw-ap`,
      "get-ap-meta",
      [],
      deployer,
    ).result as ResponseOkCV<TupleCV<{ "expires-at": SomeCV<UIntCV> }>>;
    const expiresAt = result.value.data["expires-at"].value.value;
    const newExpiresAt = expiresAt + 1000n;
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeErr(uintCV(402));

    simnet.mineEmptyBlocks(Number(expiresAt));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeErr(uintCV(408));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "update-expiry",
        [someCV(uintCV(newExpiresAt))],
        address1,
      ).result,
    ).toBeErr(uintCV(401));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "update-expiry",
        [someCV(uintCV(newExpiresAt))],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    expect(
      (
        simnet.callReadOnlyFn(`${deployer}.scw-ap`, "get-ap-meta", [], deployer)
          .result as ResponseOkCV<TupleCV<{ "expires-at": SomeCV<UIntCV> }>>
      ).value.data["expires-at"].value,
    ).toBeUint(newExpiresAt);

    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());

    simnet.mineEmptyBlocks(Number(1000));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeErr(uintCV(408));
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "update-expiry",
        [noneCV()],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    expect(
      (
        simnet.callReadOnlyFn(`${deployer}.scw-ap`, "get-ap-meta", [], deployer)
          .result as ResponseOkCV<TupleCV<{ "expires-at": NoneCV }>>
      ).value.data["expires-at"],
    ).toBeNone();
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeOk(trueCV());
    expect(
      simnet.callPublicFn(
        `${deployer}.scw-ap`,
        "execute",
        [principalCV(address1)],
        deployer,
      ).result,
    ).toBeErr(uintCV(402));
  });
});
