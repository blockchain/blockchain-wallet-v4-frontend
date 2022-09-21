import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { OrderType } from '@core/types'
import { actions } from 'data'

import { OpenBuyFlowHook, OpenBuyFlowHookOpenCallback } from './types'

export const useOpenBuyFlow: OpenBuyFlowHook = () => {
  const dispatch = useDispatch()

  const open: OpenBuyFlowHookOpenCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.components.buySell.showModal({
          cryptoCurrency: coin,
          orderType: OrderType.BUY,
          origin
        })
      )
    },
    [dispatch]
  )

  return open
}
