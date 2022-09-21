import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenViewInterestAccountModalCallback,
  OpenViewInterestAccountModalHook
} from './useOpenViewInterestAccountModal.types'

export const useOpenViewInterestAccountModal: OpenViewInterestAccountModalHook = () => {
  const dispatch = useDispatch()

  const openViewInterestAccountModal: OpenViewInterestAccountModalCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.VIEW_INTEREST_ACCOUNT, {
          coin,
          origin
        })
      )
    },
    [dispatch]
  )

  return openViewInterestAccountModal
}
