import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { REQUEST_FORM } from 'blockchain-wallet-v4-frontend/src/modals/RequestCrypto/model'
import { RequestSteps } from 'blockchain-wallet-v4-frontend/src/modals/RequestCrypto/types'

import { duration } from 'components/Flyout'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { OpenReceiveModalCallback, OpenReceiveModalHook } from './useOpenReceiveModal.types'

export const useOpenReceiveModal: OpenReceiveModalHook = () => {
  const dispatch = useDispatch()

  const openReceiveModal: OpenReceiveModalCallback = useCallback(
    async (wallet) => {
      dispatch(
        actions.modals.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
          origin: 'BuySellOrderSummary'
        })
      )

      await new Promise((r) => setTimeout(r, duration))

      dispatch(actions.form.change(REQUEST_FORM, 'selectedAccount', wallet))

      dispatch(actions.form.change(REQUEST_FORM, 'step', RequestSteps.SHOW_ADDRESS))
    },
    [dispatch]
  )

  return openReceiveModal
}
