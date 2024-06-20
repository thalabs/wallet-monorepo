import {
  contractPrincipalCV,
  stringAsciiCV,
  trueCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import {
  chargeWallet,
  getStxBalance,
  setExtension,
  setTokenWL,
  TEST_ADDRESS,
} from "./util";
import { CoreNodeEventType, projectFactory } from "@clarigen/core";
import { filterEvents, txErr, txOk } from "@clarigen/test";

import { project, accounts } from "../src/clarigen-types";

const address1 = accounts.wallet_1.address;

const deployer = accounts.deployer.address;
const { apDispatcher } = projectFactory(project, "simnet");
/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("automatic payment dispatcher", () => {
  it("Ensures that only the owner can dispatch an automatic payment", () => {
    expect(chargeWallet({ amount: 1000_000_000 })).toBeOk(trueCV());
    setExtension("scw-sip-010", true, deployer);
    setExtension("scw-ap", true, deployer);
    setTokenWL(`${TEST_ADDRESS}.wstx`, true, deployer);
    const beforeBalance = getStxBalance(deployer);
    expect(
      txErr(apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }), address1)
        .result,
    ).toBeErr(uintCV(401));
    const { events, value } = txOk(
      apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }),
      deployer,
    );
    expect(value).toBe(true);

    const printEvents = filterEvents(events, CoreNodeEventType.ContractEvent);
    expect(printEvents[0].data.value).toEqual(
      tupleCV({
        event: stringAsciiCV("dispatch-successful"),
        payload: tupleCV({
          ap: contractPrincipalCV(deployer, "scw-ap"),
        }),
      }),
    );
    const afterBalance = getStxBalance(deployer);
    expect(afterBalance - beforeBalance).toEqual(500_000n);
  });
});
