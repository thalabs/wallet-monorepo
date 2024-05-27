import { AccountsApi } from "@stacks/blockchain-api-client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { AddressBalanceResponse } from "@stacks/stacks-blockchain-api-types";
import { stacksApiConfig } from "./stacks-apis";

export type stacksPrincipal = `${string}` | `${string}.${string}`;

const api = new AccountsApi(stacksApiConfig);
export const accountsApi = createApi({
  reducerPath: "accountsApi",
  baseQuery: async () => {
    return { data: [] };
  },
  endpoints: (builder) => ({
    getBalances: builder.query<AddressBalanceResponse, stacksPrincipal>({
      queryFn: async (address) => {
        const result = (await api.getAccountBalance({
          principal: address,
        })) as AddressBalanceResponse;
        return {
          data: result,
        };
      },
    }),
  }),
});
export const { useGetBalancesQuery } = accountsApi;
