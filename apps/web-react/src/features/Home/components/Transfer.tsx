import { useConnect } from "@stacks/connect-react";
import {
  FungibleConditionCode,
  contractPrincipalCV,
  createSTXPostCondition,
  noneCV,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { useMemo, useState } from "react";
import { network } from "../../../services/stacks-apis";

export default function TransferTokens({ address }: { address: string }) {
  const { doContractCall } = useConnect();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [contractAddress, contractName] = useMemo(
    () => address.split("."),
    [address],
  );
  async function handleSubmit() {
    await doContractCall({
      contractAddress,
      contractName,
      functionName: "transfer",
      network,
      functionArgs: [
        contractPrincipalCV(
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          "wstx",
        ),
        uintCV(amount),
        contractPrincipalCV(contractAddress, contractName),
        standardPrincipalCV(recipient),
        noneCV(),
      ],
      postConditions: [
        createSTXPostCondition(address, FungibleConditionCode.Equal, amount),
      ],
    });
  }
  return (
    <div>
      <h2>Transfer</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="recipient">Recipient:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <br />
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
}
