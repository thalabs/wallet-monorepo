import { useGetBalancesQuery } from "../../../services/accounts";

export default function Balances({
  address,
}: {
  address: `${string}` | `${string}.${string}`;
}) {
  const { data, isLoading } = useGetBalancesQuery(address);

  return (
    <div>
      <h2>Balances</h2>
      {isLoading ? <p>Loading balances...</p> : null}
      {data?.stx.balance ? <p>STX Balance: {Number(data.stx.balance) / 1e6}</p> : null}
    </div>
  );
}
