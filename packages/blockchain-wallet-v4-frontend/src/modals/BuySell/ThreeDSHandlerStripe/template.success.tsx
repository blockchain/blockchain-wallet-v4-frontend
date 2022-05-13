import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import DataError from 'components/DataError'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as _P, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success = ({ buySellActions, domains, order }: Props) => {
  const [isError, setError] = useState(false)

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

export type Props = Omit<_P, 'data'> & SuccessStateType

export default Success
