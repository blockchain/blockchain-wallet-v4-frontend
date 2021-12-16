import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { compose } from 'redux'

import { OrderType, WalletFiatType } from '@core/types'
import Flyout, { duration, FlyoutChild, Trade } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const TradeContainer = (props: Props) => {
  const { close } = props
  const dispatch = useDispatch()
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const closeFlyout = useCallback(() => {
    setShow(false)
    close()
  }, [])

  const handleBuy = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(
        actions.components.buySell.showModal({
          origin: 'Trade'
        })
      )
    }, duration)
  }, [])

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(() => {
      close()
    }, duration)
  }, [])

  const handleSell = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(
        actions.components.buySell.showModal({
          cryptoCurrency: 'BTC',
          orderType: OrderType.SELL,
          origin: 'Trade'
        })
      )
    }, duration)
  }, [])

  const handleSwap = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(actions.components.swap.showModal({ origin: 'Trade' }))
    }, duration)
  }, [])

  const handleSend = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, { origin: 'Trade' }))
    }, duration)
  }, [])

  const handleReceive = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(actions.modals.showModal(ModalName.REQUEST_CRYPTO_MODAL, { origin: 'Trade' }))
    }, duration)
  }, [])

  const handleDeposit = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(
        actions.components.brokerage.handleDepositFiatClick(props.fiatCurrency as WalletFiatType)
      )
    }, duration)
  }, [])
  const handleWithdraw = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(
        actions.components.brokerage.handleWithdrawClick(props.fiatCurrency as WalletFiatType)
      )
    }, duration)
  }, [])

  return (
    <Flyout {...props} onClose={close} isOpen={show} data-e2e='tradeModal'>
      <FlyoutChild>
        <Trade
          handleBuy={handleBuy}
          handleClose={handleClose}
          handleDeposit={handleDeposit}
          handleReceive={handleReceive}
          handleSell={handleSell}
          handleSend={handleSend}
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
