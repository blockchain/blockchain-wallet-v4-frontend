import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import DataError from 'components/DataError'
import { FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const ThreeDSHandlerStripe = ({ buySellActions, domains, order }: Props) => {
  const [isError, setError] = useState(false)
  if (!order) {
    throw new Error('Order is not defined')
  }

  const handlePostMessage = async ({
    data
  }: {
    data: { provider: 'STRIPE'; status: 'ERROR' | 'SUCCESS' }
  }) => {
    if (data.provider !== 'STRIPE') return

    if (data.status === 'ERROR') {
      setError(true)
    }

    if (data.status === 'SUCCESS') {
      await buySellActions.pollOrder(order.id)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const handleRefresh = () => {
    buySellActions.destroyCheckout()
  }

  if (
    !order.attributes?.cardProvider?.publishableApiKey ||
    !order.attributes?.cardProvider?.clientSecret
  ) {
    return <DataError onClick={handleRefresh} />
  }

  if (isError) {
    return <DataError onClick={handleRefresh} />
  }

  return (
    <CustomFlyoutWrapper>
      <Iframe
        src={`${domains.walletHelper}/wallet-helper/stripe/#/paymentLink/${order.attributes.cardProvider.publishableApiKey}/${order.attributes.cardProvider.clientSecret}`}
      />
    </CustomFlyoutWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  order: selectors.components.buySell.getBSOrder(state)
})

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandlerStripe)
