import React from 'react'
import styled from 'styled-components'

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
  const paymentLink = encodeURIComponent(
    props.type === 'CARD'
      ? props.providerDetails.everypay.paymentLink
      : props.order && props.order.attributes && props.order.attributes.everypay
      ? props.order.attributes.everypay.paymentLink
      : props.order.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY'
      ? props.order.attributes?.cardProvider.paymentLink
      : ''
  )

  return props.threeDSCallbackReceived ? (
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
          onClick={() => {
            if (props.type === 'ORDER') {
              props.buySellActions.setStep({
                order: props.order,
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
