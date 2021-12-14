import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild, Trade } from 'components/Flyout'
import { actions } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const TradeContainer = (props: OwnPropsType) => {
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

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(() => {
      close()
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
      dispatch(actions.modals.showModal(ModalName.BANK_DEPOSIT_MODAL, { origin: 'Trade' }))
    }, duration)
  }, [])
  const handleWithdraw = useCallback(() => {
    closeFlyout()
    setTimeout(() => {
      dispatch(actions.modals.showModal(ModalName.CUSTODY_WITHDRAW_MODAL, { origin: 'Trade' }))
    }, duration)
  }, [])

  return (
    <Flyout {...props} onClose={close} isOpen={show} data-e2e='tradeModal'>
      <FlyoutChild>
        <Trade
          handleClose={handleClose}
          handleDeposit={handleDeposit}
          handleReceive={handleReceive}
          handleSend={handleSend}
          handleSwap={handleSwap}
          handleWithdraw={handleWithdraw}
        />
      </FlyoutChild>
    </Flyout>
  )
}

type OwnPropsType = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

const enhance = compose<any>(modalEnhancer(ModalName.TRADE_MODAL, { transition: duration }))

export default enhance(TradeContainer)
