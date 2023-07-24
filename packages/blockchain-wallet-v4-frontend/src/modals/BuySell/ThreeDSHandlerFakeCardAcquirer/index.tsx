import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { clearSubmitErrors } from 'redux-form'

import { BSOrderType, WalletOptionsType } from '@core/types'
import BaseError from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { CARD_ERROR_CODE, FORM_BS_PREVIEW_SELL } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

import Loading from '../ThreeDSHandlerEverypay/template.loading'
import Success from '../ThreeDSHandlerEverypay/template.success'

const ThreeDSHandlerFakeCardAcquirer = (props: Props) => {
  const [isPolling, setPolling] = useState(false)
  const order = useRemote(() => props.orderR)
  const dispatch = useDispatch()

  const handlePostMessage = async ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    if (!order.data) {
      throw new Error('ORDER_NOT_FOUND')
    }

    props.buySellActions.pollOrder({ orderId: order.data.id, waitUntilSettled: true })
  }

  const handleBack = useCallback(() => {
    if (order.data) {
      return props.buySellActions.proceedToBuyConfirmation({
        mobilePaymentMethod: props.mobilePaymentMethod,
        paymentMethodId: order.data.paymentMethodId,
        paymentType: order.data.paymentType
      })
    }

    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }, [order.data, props.buySellActions, props.mobilePaymentMethod])

  const handleReset = useCallback(() => {
    props.buySellActions.destroyCheckout()

    dispatch(clearSubmitErrors(FORM_BS_PREVIEW_SELL))
  }, [props.buySellActions, dispatch])

  const handleRetry = useCallback(() => {
    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }, [props.buySellActions])

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const renderError = useCallback(
    (error: unknown) => {
      if (isNabuError(error)) {
        return <GenericNabuErrorFlyout error={error} onDismiss={handleBack} />
      }

      return (
        <BaseError
          code={error}
          handleReset={handleReset}
          handleBack={handleBack}
          handleRetry={handleRetry}
        />
      )
    },
    [handleReset, handleBack, handleRetry]
  )

  if (order.hasError && order.error) {
    return renderError(order.error)
  }

  if (order.isLoading) {
    return <Loading />
  }

  if (order.isNotAsked) {
    return <Loading />
  }

  if (isPolling) {
    return <Loading polling order={order.hasData} />
  }

  let paymentLink = ''

  if (order.data?.attributes?.cardProvider?.cardAcquirerName === 'FAKE_CARD_ACQUIRER') {
    paymentLink = encodeURIComponent(order.data?.attributes?.cardProvider.paymentLink)
  }

  if (order.data?.attributes?.cardCassy?.cardAcquirerName === 'FAKE_CARD_ACQUIRER') {
    paymentLink = encodeURIComponent(order.data?.attributes?.cardCassy.paymentLink)
  }

  if (!paymentLink) {
    return renderError(CARD_ERROR_CODE.CREATE_FAILED)
  }

  return (
    <Success
      handleBack={handleBack}
      order={order?.data}
      paymentLink={paymentLink}
      domains={props.domains}
    />
  )
}

const mapStateToProps = (state: RootState) => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state),
  orderR: selectors.components.buySell.getBSOrder(state)
})

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}

export type SuccessStateType = {
  domains: WalletOptionsType['domains']
  order?: BSOrderType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerFakeCardAcquirer)
