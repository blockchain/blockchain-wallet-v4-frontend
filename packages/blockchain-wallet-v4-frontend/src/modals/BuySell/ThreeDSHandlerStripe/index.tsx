import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { WalletOptionsType } from '@core/types'
import BaseError from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { CARD_ERROR_CODE } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

import Loading from '../ThreeDSHandlerEverypay/template.loading'
import Success from './template.success'

const ThreeDSHandlerStripe = (props: Props) => {
  const [isPolling, setPolling] = useState(false)
  const order = useRemote(() => props.orderR)

  const handlePostMessage = async ({
    data
  }: {
    data: { provider: 'STRIPE'; status: 'ERROR' | 'SUCCESS' }
  }) => {
    if (data.provider !== 'STRIPE') return

    setPolling(true)

    if (!order.data || data.status === 'ERROR') {
      throw new Error('ORDER_NOT_FOUND')
    }

    if (data.status === 'SUCCESS') {
      props.buySellActions.pollOrder({ orderId: order.data.id, waitUntilSettled: true })
    }
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const handleRetry = useCallback(() => {
    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }, [props.buySellActions])

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
  }, [props.buySellActions])

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

  if (order.isLoading || order.isNotAsked) {
    return <Loading />
  }

  if (isPolling) {
    return <Loading polling order={order.hasData} />
  }

  let publishableApiKey = ''
  let clientSecret = ''

  if (order.data?.attributes?.cardProvider?.publishableApiKey) {
    publishableApiKey = order.data?.attributes?.cardProvider.publishableApiKey
  }

  if (order.data?.attributes?.cardCassy?.publishableApiKey) {
    publishableApiKey = order.data?.attributes?.cardCassy.publishableApiKey
  }

  if (order.data?.attributes?.cardProvider?.clientSecret) {
    clientSecret = order.data?.attributes?.cardProvider.clientSecret
  }

  if (order.data?.attributes?.cardCassy?.clientSecret) {
    clientSecret = order.data?.attributes?.cardCassy.clientSecret
  }

  if (!publishableApiKey || !clientSecret) {
    return renderError(CARD_ERROR_CODE.CREATE_FAILED)
  }

  return (
    <Success
      handleBack={handleBack}
      publishableApiKey={publishableApiKey}
      clientSecret={clientSecret}
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

export type Props = OwnProps & ConnectedProps<typeof connector>

export type SuccessStateType = {
  domains: WalletOptionsType['domains']
}

export default connector(ThreeDSHandlerStripe)
