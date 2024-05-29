# Extensions

An extension is a contract that can utilize other extensions if and only if the extension is enabled in the main wallet.

Extensions have arbitrary functions and can be multiparty or single-party.

Extensions are used to complete specific tasks. For example, the "send coffee" extension is used to send coffee to someone.

Extensions can only be used by the owner or a different extension as long as its enabled.

## Example: Registering a "Send Coffee" Extension

To register a "send coffee" extension, follow these steps:

### 1. Create Smart Contract for the Extension

- Create a smart contract for the `.coffee` extension.
- The contract will contain a function that can only be executed every month unless cancelled.
- The `send-coffee` function within the contract calls the `sip-010` extension.
- The `.sip-010` extension will send tokens to the recipient.
- The `.coffee` contract will mark the current timestamp as last execution.
- There should be a function where only the owner can add/remove/read recipients and matching amounts and sip-010 token.

### 2. Deploy the Extension Contract

- Deploy the contract to the blockchain.

### 3. Enable the Extension

- The owner enables the extension through the SC wallet.

## Caveats

- Extensions may depend on other extensions and the user might not have them enabled.
- Disabling an extension might break the chain of execution for other extensions.
- Automatic payments will be affected by disabling extensions will need somehow to track chain of dependencies through watching user actions disabling extensions.
- A user might interrupt an existing automatic operation extension (AOE) by withdrawing tokens.
- The contract wallet has to be tracked and verified by us automatically somehow.
