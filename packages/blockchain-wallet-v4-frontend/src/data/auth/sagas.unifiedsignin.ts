/*
Just Exchange, Upgrade (create) Wallet, Login to Exchange
* Authenticate into exchange using password
* Detect 2FA and prompt for it
* If upgradeable === true, show upgrade prompt
      - ExchangeAuthorization Function

* If choice === upgrade
* route to password create screen
    - This will be function that sets step 
    - when upgrade is pressed

* User enter password, create new wallet
* Link accounts endpoint(s)
    - ExchangeUpgrade function

* Route to exchange with JWT on deep link
     - RouteToExchange Function 

* If choice !== upgrade
* Route to exchange with JWT on deep link

*/

const ExchangeAuthorization = function* () {
  // passing password to exchange
  // if 2FA error
  // set exchangeAuthType to Google Auth
  // take whatver success token is generated here and save it to state
  // to allow us to log into exchange
  // show user upgrade prompt
}

const ExchangeUpgrade = function* () {
  // create new wallet with email + upgrade password
  // Take whatever information is needed to merge newly
  // created wallet and existing exchange account and
  // pass to merge endpoint
}

const RouteToExchange = function* () {
  // Take JWT token saved from ExchangeAuthorization function
  // route/auth user to Exchange
}

/*
Existing Exchange and existing Wallet —> Login to Exchange
* Authenticate into exchange using password
* Detect 2FA and prompt for it
* If mergeable === true, show upgrade prompt
    - ExchangeAuthorizationFunction

* If choice === merge/upgrade
    - This merge button will set step 
    - to upgrade password screen

* Authenticate into wallet using password
* Finish wallet 2fa if applicable
    - QUESTION: do we use existing login function?
    - create one for this scenario that doesn't redirect yet?

* Show update password screen
* Reencrypt wallet and save payload
* Change password for exchange
* Make API call(s) to merge accounts?? 
    - MergeExchangeAndWalletAccount function

* Route to Exchange with JWT on deep link
    - RouteToExchange function 

* If !== merge/upgrade
* Route to Exchange with JWT on deep link
    - RouteToExchange Function
*/

const MergeExchangeAndWalletAccount = function* () {
  // Not sure what information is needed here to merge account
  // But do that
}

/*
Existing Exchange and existing Wallet —> Login to Wallet
* Authenticate into wallet using password
* Detect 2FA and prompt for it
    - New authorization function here?
    - similar to previous case
    - create an auth function that just stops 

* If mergeable === true, show upgrade prompt
* If choice === merge/upgrade
    - Function that will swtich user to
    - exchange password screen

* Authenticate into exchange using password
* Finish exchange 2fa if applicable
    - ExchangeAuthorization function

* Show update password screen

* Reencrypt wallet and save payload

* Make API call(s) to merge accounts
    - MergeExchangeAndWalletAcount function

* Route to Wallet

* If !== merge/upgrade
* Route to Wallet




*/
