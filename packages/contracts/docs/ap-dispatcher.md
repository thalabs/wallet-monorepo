# Automatic Payment Dispatcher Contract

The automatic payment dispatcher contract is designed to handle automated payments. This system operates under the guidance of a 'dispatcher', who executes transactions on behalf of users, allowing them to pay without needing to interact directly with the underlying blockchain network. The purpose of this design decision is to ensure user privacy and security as it allows for dispatchers to execute transactions securely and privately.

## Dispatcher Registry

In order for a dispatcher to execute the Automatic Payment on behalf of users, they need to be added to a registry. This process involves users allowing or whitelisting dispatchers in the dispatcher registry for each user.
The registry is responsible for verifying and authenticating these dispatchers before allowing them access to initiate transactions.

The dispatcher registry ensures that only authorized entities can execute payments on behalf of users, maintaining the integrity and security of the user's data, and makes sure an attack surface is covered.

## How Does It Work?

1. A user adds X's dispatcher contract to their dispatcher registry
2. The dispatcher sees the update that they've been allowed to execute APs on behalf of the user.
3. The dispatcher lists all the automatic payments the user has created before and adds them to their AP database.
4. The dispatcher can use the contract to call an AP when its time has come with an address that receives the dispatch fee.
5. Upon successful execution of the transaction on the network, the dispatcher backend marks the AP last execution time and if it was expired or not.

This process ensures seamless automatic payments without requiring users to interact directly with the underlying blockchain network, providing them with enhanced security and convenience.
