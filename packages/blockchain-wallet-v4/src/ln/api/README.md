# Lightning Network API

## Methods for Interacting with LN plugin

### STARTUP

This action MUST be dispatched before interacting with the plugin in any way. This will initialise it's internal state and
 recreate connections

### OPEN_CHANNEL (publicKey, value)

Will try to open a payment channel over `value` with the node owning `publicKey`.
 After broadcasting the funding transaction, `CHANNEL_FUNDING_BROADCASTED` will get dispatched. TODO

Once the channel is ready to be used for payments, `CHANNEL_OPENED` will get dispatched.

### CLOSE_CHANNEL (channelId)

Will try to close a payment channel. This will close the channel unilaterally, if necessary,
 potentially leading to higher fees. Potentially the UI should display a warning, if the
 peer is currently disconnected.

### SEND (address, value)

Send a payment using *any* available payment channel.

`address` MUST be a valid BOLT #11 encoded lightning address. `value` MUST be null, unless
 `address` is a donation address without an encoded value.

Dispatching this action will immediately try to create the payment. The UI should parse
 the address in beforehand and show appropriate confirmation screens.

### RECEIVE (value)

Creates a payment request to receive money for `value`. If `value` is null, a donation address
 will be created instead, which will not encode the value in the address.

 // TODO how do we communicate back that the address should be shown?