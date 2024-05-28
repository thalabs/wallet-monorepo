import { useConnect } from "@stacks/connect-react";
import { useCallback } from "react";
import { network } from "../../../services/stacks-apis";

export default function FundWallet({ address }: { address: string }) {
  const { doSTXTransfer } = useConnect();
  const fundWallet = useCallback(() => {
    doSTXTransfer({
      amount: "1000000000",
      network,
      recipient: address,
    });
  }, [doSTXTransfer]);
  return (
    <div>
      <h2>Fund Wallet</h2>
      <button onClick={fundWallet}>Fund Wallet</button>
    </div>
  );
}
