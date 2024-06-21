# **Dispatcher Registry Smart Contract**

The Dispatcher Registry smart contract is a user-controlled registry that keeps track of which dispatchers are authorized to execute automatic payment smart contracts on behalf of the user. The contract allows users to update the registry at any time, and it emits events on the blockchain informing dispatcher backends of their allowed or disallowed status.

## **Contract Functions**

#### `(set-dispatcher (dispatcherAddress principal) (enabled bool))`

This function adds a new dispatcher to the allowed list, notifying all backend dispatchers that this user has authorized them to execute automatic payment smart contracts.

#### `(is-dispatcher (dispatcher principal))`

This function returns a list of addresses representing the dispatchers currently authorized by the user.

## **Events**

#### `DispatcherAuthorizationUpdate { dispatcher: principal, enabled: bool }`

Emitted when a dispatcher's state is updated in the allowed list, notifying all dispatchers that this user has authorized them to execute automatic payment smart contracts.
