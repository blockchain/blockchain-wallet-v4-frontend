import * as AT from './actionTypes'

import { CoinType } from 'core/types'
import { ModalOriginType } from 'data/modals/types'

export const showModal = (
  origin: ModalOriginType,
  baseCurrency?: CoinType,
  counterCurrency?: CoinType
) => ({
  type: AT.SHOW_MODAL,
  payload: {
    origin,
    baseCurrency,
    counterCurrency
  }
})
