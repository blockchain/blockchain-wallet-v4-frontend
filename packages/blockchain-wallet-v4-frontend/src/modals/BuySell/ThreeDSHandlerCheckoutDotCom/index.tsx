import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSCardType, BSOrderType, Everypay3DSResponseType, ProviderDetailsType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
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

  const handleIconClick = () => {
    const { order, type } = props.data.getOrFail('NO ORDER/CARD TO GET')

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

  return props.data.cata({
    Failure: (e) => <DataError message={{ message: e }} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} handleIconClick={handleIconClick} isPolling={isPolling} />
  })
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
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

type LinkStatePropsType = {
  data: ReturnType<typeof getData>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerCheckoutDotCom)
