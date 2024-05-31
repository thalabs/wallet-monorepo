import {
  contractPrincipalCV,
  boolCV,
  standardPrincipalCV,
  UIntCV,
  ResponseOkCV,
} from "@stacks/transactions";

const deployer = simnet.getAccounts().get("deployer")!;
export function contract(name: string) {
  return `${deployer}.${name}`;
}

export function setExtension(ext: string, state: boolean, sender = deployer) {
  return simnet.callPublicFn(
    contract("wally-main"),
    "set-extension",
    [contractPrincipalCV(deployer, ext), boolCV(state)],
    sender,
  ).result;
}
export function isExtension(ext: string) {
  return simnet.callReadOnlyFn(
    contract("wally-main"),
    "is-extension",
    [contractPrincipalCV(deployer, ext)],
    deployer,
  ).result;
}
export function isOwnerOrExtension(sender: string) {
  return simnet.callPublicFn(
    contract("scw-sip-010"),
    "is-owner-or-extension",
    [],
    sender,
  ).result;
}

export function getStxBalance(address: string) {
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
