import { Configuration } from "@stacks/blockchain-api-client";
import { StacksDevnet } from "@stacks/network";

export const network = new StacksDevnet();

export const stacksApiConfig = new Configuration({
  basePath: network.coreApiUrl,
});
