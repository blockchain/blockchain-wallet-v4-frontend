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
- `getTotalWalletBalance` - returns the total balance of the wallet across all accounts
- `getTotalWalletBalancesSorted` - returns a list of coins with any balance sorted by balance descending

### Custodial Only Balances
These selectors should be used if you need the total balance of the just custodial coins/feature of the wallet or of a specific coin.
Custodial balance means Trading, Buy/Sell, Interest, etc. + fiat (if applicable).

- `getCoinCustodialBalance` - given `CoinType`, returns its custodial balance
- `getCoinTradingBalance` - given `CoinType`, returns its trading account balance
- `getCoinInterestBalance` - given `CoinType`, returns its interest account balance

### Non-Custodial Only Balances
These selectors should be used if you need the total balance of just the non-custodial coins/feature of the wallet or of a specific coin.
Non-custodial balance means on-chain balances of private key wallets.

- `getCoinNonCustodialBalance` - given `CoinType`, returns the non-custodial balance

### Fiat Currency Balances
These selectors should be used if you need the total balance of custodially held fiat currencies.
This data is usually used in Buy/Sell type flows.

- `getFiatCurrencyBalance` - given `FiatType`, returns the total balance
- `getFiatCurrencyWithdrawableBalance` - given `FiatType`, returns its withdrawable balance