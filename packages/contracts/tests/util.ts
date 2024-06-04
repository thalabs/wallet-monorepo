import {
  contractPrincipalCV,
  boolCV,
  standardPrincipalCV,
  type UIntCV,
  type ResponseOkCV,
  type ClarityValue,
} from "@stacks/transactions";

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
