import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, Analytics, BuySellStepType, ModalName, ModalOriginType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import { ModalPropsType } from '../../../types'
import AddBankStatus from '../AddBankStatus'
import Handler from './Handler'

const Success: React.FC<Props> = (props) => {
  const dispatch = useDispatch()

  const {
    brokerageMethod,
    buySellMethod,
    buySellStep,
    close,
    origin,
    reason,
    step,
    userClickedOutside
  } = props

  const handleClose = () => {
    setTimeout(() => {
      close()
    }, duration)
  }

  // If user clicks outside in the process of linking, report to Amplitude
  useEffect(() => {
    if (userClickedOutside) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.PLAID_CLICK_OUTSIDE,
          properties: {
            buy_sell_step: buySellStep,
            modal_step: step,
            origin
          }
        })
      )
    }
  }, [userClickedOutside])

  return (
    <Flyout {...props} isOpen data-e2e='addBankModal' onClose={handleClose}>
      {step === AddBankStepType.ADD_BANK && (
        <FlyoutChild>
          {buySellMethod?.id ? (
            <Handler handleClose={handleClose} reason={reason} paymentMethodId={buySellMethod.id} />
          ) : brokerageMethod?.id ? (
            <Handler
              handleClose={handleClose}
              reason={reason}
              paymentMethodId={brokerageMethod.id}
            />
          ) : (
            <Handler handleClose={handleClose} />
          )}
        </FlyoutChild>
      )}
      {step === AddBankStepType.ADD_BANK_STATUS && (
        <FlyoutChild>
          <AddBankStatus handleClose={handleClose} />
        </FlyoutChild>
      )}
      {step === AddBankStepType.LOADING && (
        <FlyoutChild>
          <Loading text={LoadingTextEnum.PROCESSING} />
        </FlyoutChild>
      )}
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  brokerageMethod: selectors.components.brokerage.getAccount(state),
  buySellMethod: selectors.components.buySell.getBSPaymentMethod(state),
  reason: selectors.components.buySell.getReason(state),
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_PLAID_MODAL, { transition: duration }),
  connector
)

type OwnProps = {
  buySellStep: keyof typeof BuySellStepType
  origin: ModalOriginType
} & ModalPropsType

type LinkStatePropsType = ReturnType<typeof mapStateToProps>

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

export default enhance(Success)
