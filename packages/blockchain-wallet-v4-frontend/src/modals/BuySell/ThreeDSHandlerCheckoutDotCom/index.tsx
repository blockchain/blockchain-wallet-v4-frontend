import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSOrderType, ProviderDetailsType, WalletOptionsType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'

import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

const ThreeDSHandlerCheckoutDotCom = (props: Props) => {
  const [isPolling, setPolling] = useState(false)
  const order = useRemote(() => props.orderR)
  const card = useRemote(() => props.cardR)
  const providerDetails = useRemote(() => props.providerDetailsR)

  const handlePostMessage = async ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    let type = 'ORDER'

    if (order.isNotAsked) {
      type = 'CARD'
    }

    switch (type) {
      case 'ORDER':
        if (!order.data) {
          throw new Error('ORDER_NOT_FOUND')
        }

        props.buySellActions.pollOrder(order.data.id)

        break

      case 'CARD':
        if (!card.data) {
          throw new Error('CARD_NOT_FOUND')
        }

        props.buySellActions.pollCard(card.data.id)

        break
      default:
    }
  }

  const handleBack = () => {
    let type = 'ORDER'

    if (order.isNotAsked) {
      type = 'CARD'
    }

    if (type === 'ORDER') {
      props.buySellActions.setStep({
        step: 'ORDER_SUMMARY'
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

  if (order.hasError && order.error) {
    return (
      <Failure
        code={order.error}
        handleReset={handleReset}
        handleBack={handleBack}
        handleRetry={handleRetry}
      />
    )
  }

  if (card.hasError && card.error) {
    return (
      <Failure
        code={card.error}
        handleReset={handleReset}
        handleBack={handleBack}
        handleRetry={handleRetry}
      />
    )
  }

  if (providerDetails.hasError && providerDetails.error) {
    return (
      <Failure
        code={providerDetails.error}
        handleReset={handleReset}
        handleBack={handleBack}
        handleRetry={handleRetry}
      />
    )
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

  return (
    <Success
      handleBack={handleBack}
      order={order?.data}
      providerDetails={providerDetails?.data}
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
