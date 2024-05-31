import { AccountsApi } from "@stacks/blockchain-api-client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { type AddressBalanceResponse } from "@stacks/stacks-blockchain-api-types";
import { stacksApiConfig } from "./stacks-apis";

export type StacksPrincipal = `${string}` | `${string}.${string}`;

const api = new AccountsApi(stacksApiConfig);
export const accountsApi = createApi({
  baseQuery: () => {
    return { data: [] };
  },
  endpoints: (builder) => ({
    getBalances: builder.query<AddressBalanceResponse, StacksPrincipal>({
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
  reducerPath: "accountsApi",
});
export const { useGetBalancesQuery } = accountsApi;
