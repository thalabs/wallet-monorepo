import { describe, expect, it } from "vitest";
import {
  type ClarityValue,
  boolCV,
  bufferCVFromString,
  contractPrincipalCV,
  falseCV,
  noneCV,
  someCV,
  standardPrincipalCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { type ParsedTransactionResult } from "@hirosystems/clarinet-sdk";
import { contract, getStxBalance, setExtension } from "./util";
// import { projectFactory } from "@clarigen/core";
import {
  accounts,
  // project
} from "../src/clarigen-types";

// const {} = projectFactory(project, "simnet");

function transfer(
  tokenId: string,
  amount: number,
  sender: string,
  recipient: string,
  memo: string,
  caller: string,
): ParsedTransactionResult {
  return simnet.callPublicFn(
    contract("scw-sip-010"),
    "transfer",
    [
      contractPrincipalCV("SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ", tokenId),
      uintCV(amount),
      sender.includes(".")
        ? contractPrincipalCV(...(sender.split(".") as [string, string]))
        : standardPrincipalCV(sender),
      standardPrincipalCV(recipient),
      memo ? someCV(bufferCVFromString(memo)) : noneCV(),
    ],
    caller,
  );
}
function chargeWallet(): void {
  expect(
    simnet.callPublicFn(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      "transfer",
      [
        uintCV(10),
        standardPrincipalCV(deployer),
        contractPrincipalCV(deployer, "scw-sip-010"),
        noneCV(),
      ],
      deployer,
    ).result,
  ).toBeOk(trueCV());
}
function setTokenWL(
  tokenId: `${string}.${string}`,
  state: boolean,
  sender: string,
): ClarityValue {
  return simnet.callPublicFn(
    contract("scw-sip-010"),
    "set-token-wl",
    [
      contractPrincipalCV(...(tokenId.split(".") as [string, string])),
      boolCV(state),
    ],
    sender,
  ).result;
}

function getTokenWL(tokenId: `${string}.${string}`): ClarityValue {
  return simnet.callReadOnlyFn(
    contract("scw-sip-010"),
    "get-token-wl",
    [contractPrincipalCV(...(tokenId.split(".") as [string, string]))],
    deployer,
  ).result;
}

const deployer = accounts.deployer.address;
const address1 = accounts.wallet_1.address;

describe("sip-010 extension", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
  it("ensures that only owner can change a token's whitelist status", () => {
    chargeWallet();
    expect(setExtension("scw-sip-010", true, deployer)).toBeOk(trueCV());
    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        true,
        address1,
      ),
    ).toBeErr(uintCV(401));

    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        true,
        deployer,
      ),
    ).toBeOk(trueCV());

    expect(getTokenWL("SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx")).toBeOk(
      trueCV(),
    );

    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        false,
        deployer,
      ),
    ).toBeOk(trueCV());

    expect(getTokenWL("SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx")).toBeOk(
      falseCV(),
    );
  });

  it("ensures extension can transfer only be used when it's enabled by owner and token is wl'ed", () => {
    chargeWallet();
    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
    ).toBeErr(uintCV(401));
    expect(setExtension("scw-sip-010", true, deployer)).toBeOk(trueCV());

    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
    ).toBeErr(uintCV(402));

    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        true,
        deployer,
      ),
    ).toBeOk(trueCV());
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

    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        false,
        deployer,
      ),
    ).toBeOk(trueCV());
    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
    ).toBeErr(uintCV(402));
  });

  it("ensures the sender in transfer is always the contract address", () => {
    setExtension("scw-sip-010", true, deployer);

    expect(
      transfer("wstx", 10, address1, address1, "test", deployer).result,
    ).toBeErr(uintCV(400));
  });
  it("ensures extension can be called only by owner and other extensions", () => {
    setExtension("scw-sip-010", true, deployer);
    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        true,
        deployer,
      ),
    ).toBeOk(trueCV());
    chargeWallet();
    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", address1)
        .result,
    ).toBeErr(uintCV(401));

    expect(
      simnet.callPublicFn(
        contract("dummy-caller-ext"),
        "test-sip-010",
        [],
        address1,
      ).result,
    ).toBeErr(uintCV(401));

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
    expect(
      setTokenWL(
        "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
        true,
        deployer,
      ),
    ).toBeOk(trueCV());
    chargeWallet();
    expect(
      transfer("wstx", 10, contract("scw-sip-010"), address1, "test", deployer)
        .result,
    ).toBeOk(trueCV());

    expect(getStxBalance(address1)).toEqual(address1StxBalance + 10n);
    expect(getStxBalance(deployer)).toEqual(deployerStxBalance - 10n);
  });
});
