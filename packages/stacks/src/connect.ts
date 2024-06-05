import { createApi } from "@reduxjs/toolkit/query/react";
import {
  type ContractCallRegularOptions,
  type FinishedTxData,
  openContractCall,
} from "@stacks/connect";

export const connectApi = createApi({
  baseQuery: () => {
    return { data: {} };
  },
  endpoints: (builder) => ({
    callContract: builder.mutation<
      unknown,
      Omit<ContractCallRegularOptions, "onFinish" | "onCancel">
    >({
      queryFn: (options) => {
        return new Promise<{ data: FinishedTxData }>((resolve, reject) => {
          void openContractCall({
            ...options,
            onCancel() {
              reject(new Error("User rejected"));
            },
            onFinish: (result) => {
              resolve({ data: result });
            },
          });
        });
      },
    }),
  }),
  reducerPath: "connectApi",
});

export const { useCallContractMutation } = connectApi;
