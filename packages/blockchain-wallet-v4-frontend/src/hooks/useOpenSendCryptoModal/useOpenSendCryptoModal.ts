import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import { OpenSendCryptoModalHook, OpenSendCryptoModalHookOpenCallback } from './types'

export const useOpenSendCryptoModal: OpenSendCryptoModalHook = () => {
  const dispatch = useDispatch()

  const open: OpenSendCryptoModalHookOpenCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, {
          coin,
          origin
        })
      )
    },
    [dispatch]
  )

  return [open]
}
