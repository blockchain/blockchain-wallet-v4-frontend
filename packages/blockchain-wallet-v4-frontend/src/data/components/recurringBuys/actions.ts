import { ModalOriginType } from 'data/modals/types'

import * as AT from './actionTypes'
import { RecurringBuysPayload } from './types'

export const showModal = (origin: ModalOriginType) => ({
  payload: {
    origin
  },
  type: AT.SHOW_MODAL
})

export const setStep = ({ options, step }: RecurringBuysPayload) => ({
  payload: {
    options,
    step
  },
  type: AT.SET_STEP
})
