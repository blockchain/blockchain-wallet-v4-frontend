import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSOrderType, WalletOptionsType } from '@core/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'

import Loading from './template.loading'
import Success from './template.success'

const ThreeDSHandlerEverypay = (props: Props) => {
  const [isPolling, setPolling] = useState(false)
  const order = useRemote(() => props.orderR)

  const handlePostMessage = async ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    if (!order.data) {
      throw new Error('ORDER_NOT_FOUND')
    }

    props.buySellActions.pollOrder(order.data.id)
  }

  const handleBack = () => {
    props.buySellActions.setStep({
      step: 'ORDER_SUMMARY'
    })
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  if (order.hasError && order.error) {
    return <DataError message={{ message: order.error }} />
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

  if (order.data?.attributes && order.data.attributes.everypay) {
    paymentLink = encodeURIComponent(order.data?.attributes?.everypay.paymentLink)
  }

  if (order.data?.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY') {
    paymentLink = encodeURIComponent(order.data?.attributes?.cardProvider.paymentLink)
  }

  if (!paymentLink) {
    throw new Error('PAYMENT_LINK_NOT_FOUND')
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

export default connector(ThreeDSHandlerEverypay)
