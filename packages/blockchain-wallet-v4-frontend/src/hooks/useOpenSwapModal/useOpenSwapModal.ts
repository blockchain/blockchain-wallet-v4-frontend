import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import { OpenSwapModalCallback, OpenSwapModalHook } from './useOpenSwapModal.types'

export const useOpenSwapModal: OpenSwapModalHook = () => {
  const dispatch = useDispatch()

  const openSwapModal: OpenSwapModalCallback = useCallback(
    (account) => {
      dispatch(
        actions.modals.showModal(ModalName.SWAP_MODAL, {
          origin: 'BuySellOrderSummary'
        })
      )

      dispatch(
        actions.components.swap.changeBase({
          account
        })
      )
    },
    [dispatch]
  )

  return openSwapModal
}
