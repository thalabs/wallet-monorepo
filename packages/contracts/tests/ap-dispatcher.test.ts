import {
  contractPrincipalCV,
  stringAsciiCV,
  tupleCV,
} from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";
import { expectErrorByCode, getStxBalance, setupTest } from "./util";
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
  beforeEach(setupTest);

  it("should not allow unauthorized users to dispatch", () => {
    expectErrorByCode(
      txErr(apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }), address1)
        .result,
      401,
    );
  });

  it("should allow only the owner to dispatch an automatic payment", () => {
    const { value } = txOk(
      apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }),
      deployer,
    );
    expect(value).toBe(true);
  });

  it("should emit the correct event on successful dispatch", () => {
    const { events } = txOk(
      apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }),
      deployer,
    );

    const printEvents = filterEvents(events, CoreNodeEventType.ContractEvent);
    expect(printEvents[0].data.value).toEqual(
      tupleCV({
        event: stringAsciiCV("dispatch-successful"),
        payload: tupleCV({
          ap: contractPrincipalCV(deployer, "scw-ap"),
        }),
      }),
    );
  });

  it("should deduct fees from the dispatcher's balance on dispatch", () => {
    const beforeBalance = getStxBalance(deployer);
    txOk(apDispatcher.dispatch({ ap: `${deployer}.scw-ap` }), deployer);
    const afterBalance = getStxBalance(deployer);

    expect(afterBalance - beforeBalance).toEqual(500_000n);
  });
});
