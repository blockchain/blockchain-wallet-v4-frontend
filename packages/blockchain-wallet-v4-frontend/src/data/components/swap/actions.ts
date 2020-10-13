import * as AT from './actionTypes'

import { CoinType } from 'core/types'
import { ModalOriginType } from 'data/modals/types'
import { SwapStepPayload } from './types'

export const setStep = ({ step }: SwapStepPayload) => ({
  type: AT.SET_STEP,
  payload: {
    step
  }
})

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
