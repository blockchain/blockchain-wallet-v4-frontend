import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { compose } from 'redux'

import { OrderType, WalletFiatType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { Trade } from 'components/Flyout/Brokerage'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const TradeContainer = (props: Props) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState<boolean>(false)
  const closeTradeModal = useCallback(() => {
    dispatch(actions.modals.closeModal('TRADE_MODAL'))
  }, [])

  useEffect(() => {
    setShow(true)
  }, [])

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }, [])

  const handleBuy = useCallback(() => {
    dispatch(
      actions.components.buySell.showModal({
        origin: 'Trade'
      })
    )
    closeTradeModal()
  }, [])

  const handleSell = useCallback(() => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: 'BTC',
        orderType: OrderType.SELL,
        origin: 'Trade'
      })
    )
    closeTradeModal()
  }, [])

  const handleSwap = useCallback(() => {
    dispatch(actions.components.swap.showModal({ origin: 'Trade' }))
    closeTradeModal()
  }, [])

  const handleDeposit = useCallback(() => {
    dispatch(
      actions.components.brokerage.handleDepositFiatClick(props.fiatCurrency as WalletFiatType)
    )
    closeTradeModal()
  }, [])

  const handleWithdraw = useCallback(() => {
    dispatch(actions.components.brokerage.handleWithdrawClick(props.fiatCurrency as WalletFiatType))
    closeTradeModal()
  }, [])

  return (
    <Flyout {...props} onClose={props.close} isOpen={show} data-e2e='tradeModal'>
      <FlyoutChild>
        <Trade
          handleBuy={handleBuy}
          handleClose={handleClose}
          handleDeposit={handleDeposit}
          handleSell={handleSell}
          handleSwap={handleSwap}
          handleWithdraw={handleWithdraw}
        />
      </FlyoutChild>
    </Flyout>
  )
}

type OwnProps = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}
const mapStateToProps = (state: RootState) => ({
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const connector = connect(mapStateToProps)

const enhance = compose<any>(modalEnhancer(ModalName.TRADE_MODAL, { transition: duration }))

export type Props = OwnProps & ConnectedProps<typeof connector>
export default connector(enhance(TradeContainer))
