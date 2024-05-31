import { describe, expect, it } from "vitest";
import { uintCV, trueCV } from "@stacks/transactions";
import { contract, isExtension, setExtension } from "./util";
const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;
const sip10Ext = "scw-sip-010";
const dummyExt = "dummy-caller-ext";
describe("main wallet", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("ensures that an extension is enabled", () => {
    expect(isExtension(sip10Ext)).toBeBool(false);

    expect(setExtension(sip10Ext, true, deployer)).toBeOk(trueCV());

    expect(isExtension(sip10Ext)).toBeBool(true);
  });

  it("ensures that an extension is disabled", () => {
    expect(isExtension(sip10Ext)).toBeBool(false);

    expect(setExtension(sip10Ext, true, deployer)).toBeOk(trueCV());

    expect(isExtension(sip10Ext)).toBeBool(true);
    expect(setExtension(sip10Ext, false, deployer)).toBeOk(trueCV());
    expect(isExtension(sip10Ext)).toBeBool(false);
  });

  it("ensures that owner only can enable or disable extensions", () => {
    expect(isExtension(sip10Ext)).toBeBool(false);

    expect(setExtension(sip10Ext, true, address1)).toBeErr(uintCV(401));
    expect(setExtension(dummyExt, true, deployer)).toBeOk(trueCV());

    // not even extension are able to control extension state
    expect(
      simnet.callPublicFn(
        contract(dummyExt),
        "test-set-extension",
        [],
        address1,
      ).result,
    ).toBeErr(uintCV(401));

    expect(
      simnet.callPublicFn(
        contract(dummyExt),
        "test-set-extension",
        [],
        deployer,
      ).result,
    ).toBeErr(uintCV(401));

    expect(isExtension(sip10Ext)).toBeBool(false);

    expect(setExtension(sip10Ext, true, deployer)).toBeOk(trueCV());
    expect(isExtension(sip10Ext)).toBeBool(true);

    expect(setExtension(sip10Ext, false, address1)).toBeErr(uintCV(401));
    expect(isExtension(sip10Ext)).toBeBool(true);
  });
});
