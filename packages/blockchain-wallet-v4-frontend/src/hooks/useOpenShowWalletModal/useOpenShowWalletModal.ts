import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenShowWalletModalCallback,
  OpenShowWalletModalHook
} from './useOpenShowWalletModal.types'

export const useOpenShowWalletModal: OpenShowWalletModalHook = () => {
  const dispatch = useDispatch()

  const open: OpenShowWalletModalCallback = useCallback(
    ({ address, origin }) => {
      dispatch(actions.modals.showModal(ModalName.SHOW_WALLET, { address, origin }))
    },
    [dispatch]
  )

  return [open]
}
