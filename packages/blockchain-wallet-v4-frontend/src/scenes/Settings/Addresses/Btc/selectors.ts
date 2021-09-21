import { Remote } from '@core'
import { selectors } from 'data'

export const getData = (state) => {
  return Remote.of(selectors.core.wallet.getWalletContext(state)).getOrElse('')
}
