import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { SuccessStateType } from '.'
import Loading from './template.loading'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success = (props: Props) => {
  const paymentLink = encodeURIComponent(
    props.type === 'CARD'
      ? props.providerDetails.cardProvider.paymentLink
      : props.order.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM'
      ? props.order.attributes?.cardProvider.paymentLink
      : ''
  )

  return props.isPolling ? (
    <Loading polling order={props.type === 'ORDER'} />
  ) : (
    <CustomFlyoutWrapper>
      <>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          role='button'
          onClick={props.handleBack}
        />
        <Iframe
          src={`${props.domains.walletHelper}/wallet-helper/checkoutdotcom/#/paymentLink/${paymentLink}`}
        />
      </>
    </CustomFlyoutWrapper>
  )
}

type Props = SuccessStateType & { handleBack: () => void; isPolling: boolean }

export default Success
