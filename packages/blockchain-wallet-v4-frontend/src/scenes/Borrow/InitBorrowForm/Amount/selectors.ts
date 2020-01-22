import { CoinType } from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const { INVALID_COIN_TYPE } = model.components.borrow

export type ValuesType = {
  coin: CoinType
}

export const getBalance = state => {
  const values: ValuesType = selectors.form.getFormValues('initBorrow')(state)

  switch (values.coin) {
    case 'BTC':
      return selectors.core.data.btc.getBalance(state)
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
