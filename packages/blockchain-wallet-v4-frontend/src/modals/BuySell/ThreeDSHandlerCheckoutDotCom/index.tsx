import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSOrderType, ProviderDetailsType, WalletOptionsType } from '@core/types'
import CardError from 'components/BuySell/CardError'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { CARD_ERROR_CODE } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const ThreeDSHandlerCheckoutDotCom = (props: Props) => {
  const [isPolling, setPolling] = useState(false)
  const order = useRemote(() => props.orderR)
  const card = useRemote(() => props.cardR)
  const providerDetails = useRemote(() => props.providerDetailsR)

  const handlePostMessage = async ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    if (order.hasData && order.data) {
      props.buySellActions.pollOrder(order.data.id)
    } else if (card.hasData && card.data) {
      props.buySellActions.pollCard(card.data.id)
    }
  }

  const handleBack = () => {
    if (order.hasData) {
      props.buySellActions.setStep({
        step: 'CHECKOUT_CONFIRM'
      })

      return
    }

    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }

  const handleReset = () => {
    props.buySellActions.destroyCheckout()
  }

  const handleRetry = () => {
    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const renderError = useCallback(
    (error: string | Error) => {
      if (isNabuError(error)) {
        return <GenericNabuErrorFlyout error={error} onClickClose={handleBack} />
      } else if (typeof error === 'string') {
        return (
          <CardError
            code={error}
            handleReset={handleReset}
            handleBack={handleBack}
            handleRetry={handleRetry}
          />
        )
      } else {
        return <DataError message={{ message: error.toString() }} />
      }
    },
    [handleReset, handleBack, handleRetry]
  )

  if (order.hasError && order.error) {
    return renderError(order.error)
  }

  if (card.hasError && card.error) {
    return renderError(card.error)
  }

  if (providerDetails.hasError && providerDetails.error) {
    return renderError(providerDetails.error)
  }

  if (order.isLoading || card.isLoading) {
    return <Loading />
  }

  if (order.isNotAsked && card.isNotAsked) {
    return <Loading />
  }

  if (isPolling) {
    return <Loading polling order={order.hasData} />
  }

  let paymentLink = ''

  if (order.data?.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM') {
    paymentLink = encodeURIComponent(order.data?.attributes?.cardProvider.paymentLink)
  } else if (providerDetails.data) {
    paymentLink = encodeURIComponent(providerDetails.data.cardProvider.paymentLink)
  } else if (!providerDetails.isLoading && !order.isLoading) {
    return (
      <CardError
        code={CARD_ERROR_CODE.CREATE_FAILED}
        handleReset={handleReset}
        handleBack={handleBack}
        handleRetry={handleRetry}
      />
    )
  }

  if (!paymentLink) {
    return <Loading />
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
  cardR: selectors.components.buySell.getBSCard(state),
  checkoutDotComApiKey: selectors.components.buySell.getCheckoutApiKey(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  orderR: selectors.components.buySell.getBSOrder(state),
  origin: selectors.components.buySell.getOrigin(state),
  providerDetailsR: selectors.components.buySell.getBSProviderDetails(state)
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
  providerDetails?: ProviderDetailsType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerCheckoutDotCom)
