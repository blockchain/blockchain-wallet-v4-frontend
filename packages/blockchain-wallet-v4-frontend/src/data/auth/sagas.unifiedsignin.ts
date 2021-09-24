/*
Just Exchange, Upgrade (create) Wallet, Login to Exchange

* Authenticate into exchange using password
* Detect 2FA and prompt for it
* If upgradeable === true, show upgrade prompt
* If choice === upgrade
* route to password create screen
* User enter password, create new wallet
* Link accounts endpoint(s)
* Route to exchange with JWT on deep link
* If choice !== upgrade
* Route to exchange with JWT on deep link

*/

const ExchangeAuthorization = function* () {
  // passing password to exchange
  // if 2FA error
  // set exchangeAuthType to Google Auth
}

/*
Existing Exchange and existing Wallet —> Login to Exchange
* Authenticate into exchange using password
* Detect 2FA and prompt for it
* If mergeable === true, show upgrade prompt
* If choice === merge/upgrade
* Authenticate into wallet using password
* Finish wallet 2fa if applicable
* Show update password screen
* Reencrypt wallet and save payload
* Make API call(s) to merge accounts
* Route to Exchange with JWT on deep link
* If !== merge/upgrade
* Route to Exchange with JWT on deep link

Existing Exchange and existing Wallet —> Login to Wallet


Existing Exchange and existing Wallet —> Login to Wallet
* Authenticate into wa;;et using password
* Detect 2FA and prompt for it
* If mergeable === true, show upgrade prompt
* If choice === merge/upgrade
* Authenticate into exchange using password
* Finish exchange 2fa if applicable
* Show update password screen
* Reencrypt wallet and save payload
* Make API call(s) to merge accounts
* Route to Wallet
* If !== merge/upgrade
* Route to Wallet

Existing Exchange and existing Wallet —> Login to Wallet
 
 





*/
