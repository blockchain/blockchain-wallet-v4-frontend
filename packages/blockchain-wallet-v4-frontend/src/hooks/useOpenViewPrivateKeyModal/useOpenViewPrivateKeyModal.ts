import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenViewPrivateKeyModalCallback,
  OpenViewPrivateKeyModalHook
} from './useOpenViewPrivateKeyModal.types'

export const useOpenViewPrivateKeyModal: OpenViewPrivateKeyModalHook = () => {
  const dispatch = useDispatch()

  const openViewPrivateKeyModal: OpenViewPrivateKeyModalCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.VIEW_PRIVATE_KEY_WALLET, {
          coin,
          origin
        })
      )
    },
    [dispatch]
  )

  return openViewPrivateKeyModal
}
