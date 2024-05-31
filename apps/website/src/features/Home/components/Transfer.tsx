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

export function TransferTokens({ address }: { address: string }): JSX.Element {
  const { doContractCall } = useConnect();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [contractAddress, contractName] = useMemo(
    () => address.split("."),
    [address],
  );
  function handleSubmit(): void {
    void doContractCall({
      contractAddress,
      contractName,
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
      functionName: "transfer",
      network,
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
          onChange={(e) => {
            setRecipient(e.target.value);
          }}
        />
        <br />
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <br />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
}
