import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { SEND_FORM } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/model'
import { change } from 'redux-form'

import { duration } from 'components/Flyout'
import { actions } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { ModalName } from 'data/types'

import { OpenSendCryptoModalHook, OpenSendCryptoModalHookOpenCallback } from './types'

export const useOpenSendCryptoModal: OpenSendCryptoModalHook = () => {
  const dispatch = useDispatch()

  const open: OpenSendCryptoModalHookOpenCallback = useCallback(
    async ({ coin, initialValue, origin }) => {
      if (initialValue && initialValue.account) {
        const { account } = initialValue

        dispatch(actions.components.sendCrypto.setInitialCoin(coin))

        dispatch(actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, { account, origin: 'Send' }))

        await new Promise((r) => setTimeout(r, duration))

        dispatch(change(SEND_FORM, 'selectedAccount', account))
        dispatch(actions.components.sendCrypto.setStep({ step: SendCryptoStepType.ENTER_TO }))
        dispatch(actions.components.sendCrypto.fetchSendLimits({ account }))
      } else {
        dispatch(
          actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, {
            coin,
            origin
          })
        )
      }
    },
    [dispatch]
  )

  return open
}
