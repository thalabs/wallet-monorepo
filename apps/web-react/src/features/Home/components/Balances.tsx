import { useGetBalancesQuery } from "../../../services/accounts";

export default function Balances({
  address,
}: {
  address: `${string}` | `${string}.${string}`;
}) {
  const { data, error, isLoading } = useGetBalancesQuery(address);
  console.log(data);
  return (
    <div>
      <h2>Balances</h2>
      {isLoading && <p>Loading...</p>}
      {data?.stx?.balance && (
        <p>STX Balance: {Number(data.stx.balance) / 1e6}</p>
      )}
    </div>
  );
}
