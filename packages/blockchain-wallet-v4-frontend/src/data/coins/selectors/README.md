# Wallet Coins & Balances Selectors

## Overview
Almost every page and feature in the Wallet relies on getting balances in some capacity. 
There are many variations on what type of balance you may need. 
This document will help you decide which selectors you should be using.


## Using The Selectors
The files detailed below all export their individual selectors for easy consumption such as the following:

```js
 import { getCoinCustodialBalance } from 'data/coins/selectors'

const mapStateToProps = (state) => ({
  custodialEthBalance: data.coins.selectors.getCoinCustodialBalance('ETH')(state)
})
```

## Balance Selector Definitions

### Total (`total.selectors.ts`)
These selectors should be used if you need the total balance of the entire wallet or of a specific coin.
Total balance means custodial (trading, interest, etc.) + non-custodial + fiat (if applicable).

### Custodial (`custodial.selectors.ts`)
These selectors should be used if you need the total balance of the just custodial coins/feature of the wallet or of a specific coin.
Custodial balance means Trading, Buy/Sell, Interest + fiat (if applicable).

### Non-Custodial (`non-custodial.selectors.ts`)
These selectors should be used if you need the total balance of just the non-custodial coins/feature of the wallet or of a specific coin.
Non-custodial balance means on-chain balances of private key wallets.

### Fiat (`fiat.selectors.ts`)
These selectors should be used if you need the total balance of custodially held fiat currencies.
This data is usually used in Buy/Sell type flows.

## Coin Selector
Some coins export