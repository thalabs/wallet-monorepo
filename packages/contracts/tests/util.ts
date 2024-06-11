import {
  contractPrincipalCV,
  boolCV,
  standardPrincipalCV,
  UIntCV,
  ResponseOkCV,
  bufferCVFromString,
  noneCV,
  someCV,
  trueCV,
  uintCV,
  ClarityValue,
} from "@stacks/transactions";
import { expect } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- account exists
const deployer = simnet.getAccounts().get("deployer")!;
export function contract(name: string): string {
  return `${deployer}.${name}`;
}

export function setExtension(
  ext: string,
  state: boolean,
  sender = deployer,
): ClarityValue {
  return simnet.callPublicFn(
    contract("wally-main"),
    "set-extension",
    [contractPrincipalCV(deployer, ext), boolCV(state)],
    sender,
  ).result;
}
export function isExtension(ext: string): ClarityValue {
  return simnet.callReadOnlyFn(
    contract("wally-main"),
    "is-extension",
    [contractPrincipalCV(deployer, ext)],
    deployer,
  ).result;
}
export function isOwnerOrExtension(sender: string): ClarityValue {
  return simnet.callPublicFn(
    contract("scw-sip-010"),
    "is-owner-or-extension",
    [],
    sender,
  ).result;
}

export function getStxBalance(address: string): bigint {
  return (
    simnet.callReadOnlyFn(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      "get-balance",
      [
        address.includes(".")
          ? contractPrincipalCV(...(address.split(".") as [string, string]))
          : standardPrincipalCV(address),
      ],
      deployer,
    ).result as ResponseOkCV<UIntCV>
  ).value.value;
}

export function transfer(
  tokenId: string,
  amount: number,
  sender: string,
  recipient: string,
  memo: string,
  caller: string,
) {
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
export function chargeWallet({ amount = 10 } = {}) {
  expect(
    simnet.callPublicFn(
      "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
      "transfer",
      [
        uintCV(amount),
        standardPrincipalCV(deployer),
        contractPrincipalCV(deployer, "scw-sip-010"),
        noneCV(),
      ],
      deployer,
    ).result,
  ).toBeOk(trueCV());
}
export function setTokenWL(
  tokenId: `${string}.${string}`,
  state: boolean,
  sender: string,
) {
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

export function getBlockTimeForUnixTime(unixTime: bigint) {
  const SIMNET_BLOCK_TIME = 30n * 60n;
  return Number(unixTime / SIMNET_BLOCK_TIME);
}
