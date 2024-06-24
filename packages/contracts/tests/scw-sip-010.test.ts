import { describe, expect, it } from "vitest";
import {
  bufferCVFromString,
  contractPrincipalCV,
  falseCV,
  trueCV,
} from "@stacks/transactions";

import {
  chargeWallet,
  contract,
  expectErrorByCode,
  getStxBalance,
  setExtension,
  setTokenWL,
  TEST_ADDRESS,
  transfer,
} from "./util";

function getTokenWL(tokenId: `${string}.${string}`) {
  return simnet.callReadOnlyFn(
    contract("scw-sip-010"),
    "get-token-wl",
    [contractPrincipalCV(...(tokenId.split(".") as [string, string]))],
    deployer,
  ).result;
}
const accounts = simnet.getAccounts();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const deployer = accounts.get("deployer")!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const address1 = accounts.get("wallet_1")!;

describe("sip-010 extension", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
  it("ensures that only owner can change a token's whitelist status", () => {
    expect(chargeWallet({ amount: 1000_000_000 })).toBeOk(trueCV());
    expect(setExtension("scw-sip-010", true, deployer)).toBeOk(trueCV());
    expectErrorByCode(setTokenWL(`${TEST_ADDRESS}.wstx`, true, address1), 401);

    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, true, deployer)).toBeOk(trueCV());

    expect(getTokenWL(`${TEST_ADDRESS}.wstx`)).toBeOk(trueCV());

    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, false, deployer)).toBeOk(
      trueCV(),
    );

    expect(getTokenWL(`${TEST_ADDRESS}.wstx`)).toBeOk(falseCV());
  });

  it("ensures extension can transfer only be used when it's enabled by owner and token is wl'ed", () => {
    expect(chargeWallet({ amount: 1000_000_000 })).toBeOk(trueCV());
    expectErrorByCode(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
      401,
    );
    expect(setExtension("scw-sip-010", true, deployer)).toBeOk(trueCV());

    expectErrorByCode(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
      402,
    );

    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, true, deployer)).toBeOk(trueCV());
    const successFulTransfer = transfer(
      "wstx",
      10,
      contract("scw-sip-010"),
      address1,
      "test",
      deployer,
    );
    expect(successFulTransfer.result).toBeOk(trueCV());
    const [transferEvent, printEvent] = successFulTransfer.events;
    expect(transferEvent.event).toBe("stx_transfer_event");
    expect(transferEvent.data.amount).toBe("10");
    expect(printEvent.event).toBe("print_event");
    expect(printEvent.data.value).toStrictEqual(bufferCVFromString("test"));

    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, false, deployer)).toBeOk(
      trueCV(),
    );
    expectErrorByCode(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
      402,
    );
  });

  it("ensures the sender in transfer is always the contract address", () => {
    setExtension("scw-sip-010", true, deployer);

    expectErrorByCode(
      transfer("wstx", 10, address1, address1, "test", deployer).result,
      400,
    );
  });
  it("ensures extension can be called only by owner and other extensions", () => {
    setExtension("scw-sip-010", true, deployer);
    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, true, deployer)).toBeOk(trueCV());
    expect(chargeWallet({ amount: 1000_000_000 })).toBeOk(trueCV());
    expectErrorByCode(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", address1)
        .result,
      401,
    );

    expectErrorByCode(
      simnet.callPublicFn(
        contract("dummy-caller-ext"),
        "test-sip-010",
        [],
        address1,
      ).result,
      401,
    );

    setExtension("dummy-caller-ext", true, deployer);
    expect(
      simnet.callPublicFn(
        contract("dummy-caller-ext"),
        "test-sip-010",
        [],
        address1,
      ).result,
    ).toBeOk(trueCV());
  });

  it("ensures that a transfer is complete if called by the owner", () => {
    const address1StxBalance = getStxBalance(address1);
    const deployerStxBalance = getStxBalance(deployer);

    setExtension("scw-sip-010", true, deployer);
    expect(setTokenWL(`${TEST_ADDRESS}.wstx`, true, deployer)).toBeOk(trueCV());
    expect(chargeWallet({ amount: 10 })).toBeOk(trueCV());
    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
    ).toBeOk(trueCV());

    expect(getStxBalance(address1)).toEqual(address1StxBalance + 10n);
    expect(getStxBalance(deployer)).toEqual(deployerStxBalance - 10n);
  });
});
