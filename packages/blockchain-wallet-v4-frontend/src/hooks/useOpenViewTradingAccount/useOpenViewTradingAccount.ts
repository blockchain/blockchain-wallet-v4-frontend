import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenViewTradingAccountCallback,
  OpenViewTradingAccountHook
} from './useOpenViewTradingAccount.types'

export const useOpenViewTradingAccount: OpenViewTradingAccountHook = () => {
  const dispatch = useDispatch()

  const openViewTradingAccount: OpenViewTradingAccountCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.VIEW_TRADING_ACCOUNT, {
          coin,
          origin
        })
      )
    },
    [dispatch]
  )

  return openViewTradingAccount
}
