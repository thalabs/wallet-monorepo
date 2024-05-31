import { useConnect } from "@stacks/connect-react";
import { useCallback } from "react";
import { network } from "../../../services/stacks-apis";

export function FundWallet({ address }: { address: string }): JSX.Element {
  const { doSTXTransfer } = useConnect();
  const fundWallet = useCallback(() => {
    doSTXTransfer({
      amount: "1000000000",
      network,
      recipient: address,
    });
  }, [doSTXTransfer, address]);
  return (
    <div>
      <h2>Fund Wallet</h2>
      <button type="button" onClick={fundWallet}>
        Fund Wallet
      </button>
    </div>
  );
}
