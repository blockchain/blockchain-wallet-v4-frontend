# Wallet Balances Selectors

## Overview

Almost every page and feature in the Wallet relies on getting balances in some capacity.
There are many variations on what type of balance data you may need.
This document will outline each of the public selectors available to help you decide which selectors you should be using.

## Balance Selector Definitions

All the selectors outlined below are available on the `data.selectors.balances` namespace.

### Total Balances

These selectors should be used if you need the total balance of the entire wallet or of a specific coin.
Total balance means custodial (Trading, Buy/Sell, Interest, etc.) + non-custodial + fiat (if applicable).

- `getCoinTotalBalance` - given `CoinType` or `FiatType`, will return its total balance across all accounts
- `getCoinBalancesTypeSeparated` given `CoinType`, will return its balances in a list seperated by balance type ([non-custodial, custodial]). This selector should be used sparingly and with caution!
- `getTotalWalletBalance` - returns the total balance of the wallet across all accounts
- `getTotalWalletBalancesSorted` - returns a list of coins with any balance sorted by balance descending

### Custodial Only Balances

These selectors should be used if you need the total balance of the just custodial coins/feature of the wallet or of a specific coin.
Custodial balance means Trading, Buy/Sell, Interest, etc. + fiat (if applicable).

- `getCoinCustodialBalance` - given `CoinType`, returns its custodial balance
- `getCoinTradingBalance` - given `CoinType`, returns its trading account balance
- `getCoinInterestBalance` - given `CoinType`, returns its interest account balance

### Non-Custodial Only Balances

These selectors should be used if you need the total non-custodial balance of a specific coin.
Non-custodial balance means on-chain balances of DeFi wallets, IT DOES NOT YET INCLUDE DYNAMIC SELF-CUSTODY BALANCES!

- `getCoinNonCustodialBalance` - given `CoinType`, returns the non-custodial balance

### Dynamic Self Custody Only Balances

Not yet implemented. Perhaps these specific balance selectors shouldn't exist, and they should just be included in the non-custodial selectors

### Fiat Currency Balances

These selectors should be used if you need the total balance of custodially held fiat currencies.
This data is usually used in Buy/Sell type flows.

- `getFiatCurrencyBalance` - given `FiatType`, returns the total balance
- `getFiatCurrencyWithdrawableBalance` - given `FiatType`, returns its withdrawable balance
