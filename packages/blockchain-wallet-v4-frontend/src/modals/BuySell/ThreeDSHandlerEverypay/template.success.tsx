import React from 'react'
import styled from 'styled-components'

import { Remote } from '@core'
import { Icon } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps, State, SuccessStateType } from '.'
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

const Success: React.FC<Props> = (props) => {
  let type = 'ORDER'

  if (Remote.NotAsked.is(props.order)) {
    type = 'CARD'
  }

  const paymentLink = encodeURIComponent(
    type === 'CARD'
      ? props.providerDetails.everypay.paymentLink
      : props.order && props.order.data.attributes && props.order.data.attributes.everypay
      ? props.order.data.attributes.everypay.paymentLink
      : props.order.data.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY'
      ? props.order.data.attributes?.cardProvider.paymentLink
      : ''
  )

  return props.threeDSCallbackReceived ? (
    <Loading polling order={type === 'ORDER'} />
  ) : (
    <CustomFlyoutWrapper>
      <>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          role='button'
          onClick={() => {
            if (type === 'ORDER') {
              props.buySellActions.setStep({
                step: 'ORDER_SUMMARY'
              })
            } else {
              props.buySellActions.setStep({
                step: 'DETERMINE_CARD_PROVIDER'
              })
            }
          }}
        />
        <Iframe
          src={`${props.domains.walletHelper}/wallet-helper/everypay/#/paymentLink/${paymentLink}`}
        />
      </>
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps & State & SuccessStateType

export default Success
