## Coins/Tokens in Wallet 

### Overview

### Steps to Add new Coin/Token


### TODO List
Focused only on frontend package for now and ignoring core package
- App Dashboard (layouts, menus, etc)
- Borrow ✅
- Buy/Sell
- Interest ✅
- Transactions
- Swap ✅
- Send 
- Request ✅ 

#### Places to Check
// BALANCES
- home balance data selectors - packages/blockchain-wallet-v4-frontend/src/scenes/Transactions/WalletBalanceDropdown/selectors.ts
- coin balance dropdown selectors - packages/blockchain-wallet-v4-frontend/src/components/Form/CoinBalanceDropdown/selectors.ts
- wallet balance selectors - packages/blockchain-wallet-v4-frontend/src/components/Balances/wallet/selectors.ts
- total balance selectors - packages/blockchain-wallet-v4-frontend/src/components/Balances/total/selectors.ts
- NC balance selectors - packages/blockchain-wallet-v4-frontend/src/components/Balances/nonCustodial/selectors.ts
- Login balances fetch - packages/blockchain-wallet-v4-frontend/src/data/auth/sagas.js (90)
- Refresh saga - packages/blockchain-wallet-v4-frontend/src/data/components/refresh/sagas.ts

// TRANSACTIONS
- actions - packages/blockchain-wallet-v4-frontend/src/scenes/Transactions/index.tsx
- selections - packages/blockchain-wallet-v4-frontend/src/scenes/Transactions/selectors.tsx
- {coin}Transactions - packages/blockchain-wallet-v4-frontend/src/data/components/{coin}Transactions
- export - packages/blockchain-wallet-v4-frontend/src/modals/Transactions/DownloadTransactions/index.tsx
- handleEditDescription - packages/blockchain-wallet-v4-frontend/src/scenes/Transactions/NonCustodialTx/index.tsx

// REQUEST
- select NC receive address - packages/blockchain-wallet-v4-frontend/src/data/components/utils/sagas.ts

// SEND
- send saga - packages/blockchain-wallet-v4-frontend/src/data/components/send/sagas.ts
- NC send confirmation selectors - packages/blockchain-wallet-v4-frontend/src/scenes/Transactions/NonCustodialTx/Confirmations/selectors.tsx

// MISC SEARCH
- search results for "toLower(coin)"
- search results for case statements "case ('ETH')"
- search results for `selectors.core.common[toLower(coin)]`