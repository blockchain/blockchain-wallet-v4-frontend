import { getTotalBalance } from 'components/Balances/wallet/selectors'

export const getBalance = state => getTotalBalance(state)
