# Main Wallet

The main wallet's responsibility is to enable and disable extensions.

~~The wallet's ownership can be transferred to a different principal by the owner,~~
~~first user must start the cool down period and after it passes they can complete the transfer~~
~~we might send an email notification.~~

## Methods

### Set Extension

Arguments:

- `extension_id` - contract id of the extension that should be enabled
- `enabled` - boolean value indicating whether the extension should be enabled or disabled

### Is Extension Enabled

Arguments:

- `extension_id` - contract id of the extension that should be enabled

Returns:

- `bool` - true if extension is enabled,

## Events

- `ExtensionEnabled`
- `ExtensionDisabled`
