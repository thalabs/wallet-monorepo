# Automatic Payment Process

### Dispatcher

The dispatcher is responsible for sending transactions to execute automatic payments.
The design of the dispatcher is a smart contract that is whitelisted in the `dispatcher-registry` extension

### Smart Contract Wallet

The smart contract wallet is used by users to deposit funds that can be utilized by automatic payment contracts. It serves as a secure and transparent medium for managing user funds. specifically the `sip-010` extension.

### Automatic Payment Contracts

Automatic payment contracts are executed by the dispatcher on behalf of the user, utilizing the deposited funds in their smart contract wallet. These contracts enable seamless transactions between parties involved in a specific payment agreement.
Each automatic payment is a contract.

**Step-by-Step Process**

1. **Fund Deposit**: The user deposits funds into their smart contract wallet.
2. **Dispatcher Initialization**: The dispatcher backend is initialized with an event that comes through the blockchain from the user's smart contract wallet address containing automatic payment information (cadence, expiry).
3. **Transaction Execution**: The dispatcher sends a transaction to execute an automatic payment, the AP can have arbitrary code, and is executed without post conditions (this has to change in the future).
4. **Smart Contract Verification**: The dispatcher verifies the transaction details, ensuring that the funds are sufficient for the payment, before execution.
5. **Payment Execution**: The dispatcher executes the payment by calling the `execute` function on the AP contract, and passing the fee collection address.
6. **Transaction Confirmation**: The dispatcher receives confirmation of the successful transaction execution and updates its records accordingly.

**Benefits**

- **Convenience**: Automatic payments simplify the process of making recurring or one-time transactions, saving time and effort for users.
- **Security**: Smart contract wallets ensure the secure storage and management of user funds, minimizing the risk of fraud or unauthorized transactions.
- **Transparency**: The entire payment process is transparent, happening on the blockchain with dispatcher having no access to user funds.

By following this documentation, you can better understand how automatic payments work through the collaboration of a dispatcher, smart contract wallet, and automatic payment contracts.
