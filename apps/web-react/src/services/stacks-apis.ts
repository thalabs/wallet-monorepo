import { Configuration } from "@stacks/blockchain-api-client";
import { StacksDevnet } from "@stacks/network";

const network = new StacksDevnet();

export const stacksApiConfig = new Configuration({
  basePath: network.coreApiUrl,
});
