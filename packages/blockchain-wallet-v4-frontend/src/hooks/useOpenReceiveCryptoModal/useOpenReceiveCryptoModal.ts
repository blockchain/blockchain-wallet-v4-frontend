import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import { OpenReceiveCryptoModalHook } from './types'

export const useOpenReceiveCryptoModal: OpenReceiveCryptoModalHook = () => {
  const dispatch = useDispatch()

  const open = useCallback(
    ({ coin, origin }) => {
      actions.modals.showModal({
        props: {
          origin,
          preselectedCoin: coin
        },
        type: ModalName.REQUEST_CRYPTO_MODAL
      })
    },
    [dispatch]
  )

  return [open]
}
