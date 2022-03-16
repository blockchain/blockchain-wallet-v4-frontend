import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSCardType, BSOrderType, Everypay3DSResponseType, ProviderDetailsType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

const ThreeDSHandlerCheckoutDotCom = (props: Props) => {
  const [isPolling, setPolling] = useState(false)

  const handlePostMessage = async ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    const { card, order, type } = props.data.getOrFail('NO ORDER/CARD TO POLL')

    switch (type) {
      case 'ORDER':
        props.buySellActions.pollOrder(order.id)
        break
      case 'CARD':
        props.buySellActions.pollCard(card.id)
        break
      default:
    }
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const handleBack = () => {
    const { order, type } = props.data.getOrElse({})

    if (!order || !type) {
      props.buySellActions.setStep({
        step: 'DETERMINE_CARD_PROVIDER'
      })
    }

    if (type === 'ORDER') {
      props.buySellActions.setStep({
        order,
        step: 'ORDER_SUMMARY'
      })
    } else {
      props.buySellActions.setStep({
        step: 'DETERMINE_CARD_PROVIDER'
      })
    }
  }

  const handleReset = () => {
    props.buySellActions.destroyCheckout()
  }

  const handleRetry = () => {
    props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
  }

  return props.data.cata({
    Failure: (code) => <Failure code={code} handleBack={handleBack} handleRetry={handleRetry} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} handleBack={handleBack} isPolling={isPolling} />
  })
}

const mapStateToProps = (state: RootState) => ({
  checkoutDotComApiKey: selectors.components.buySell.getCheckoutApiKey(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}

export type SuccessStateType =
  | { domains: { walletHelper: string }; order: BSOrderType; type: 'ORDER' }
  | {
      card: BSCardType
      domains: { walletHelper: string }
      order: BSOrderType
      providerDetails: ProviderDetailsType
      threeDSDetails: Everypay3DSResponseType
      type: 'CARD'
    }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerCheckoutDotCom)
