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

const Success: React.FC<Props> = props => {
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
            props.type === 'ORDER'
              ? props.simpleBuyActions.setStep({
                  step: 'ORDER_SUMMARY',
                  order: props.order
                })
              : props.simpleBuyActions.setStep({
                  step: 'ADD_CARD'
                })
          }}
        />
        <Iframe
          src={
            props.domains.walletHelper +
            '/wallet-helper/everypay/#/paymentLink/' +
            encodeURIComponent(
              props.type === 'CARD'
                ? props.providerDetails.everypay.paymentLink
                : props.order && props.order.attributes
                ? props.order.attributes.everypay.paymentLink
                : ''
            )
          }
        />
      </>
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps & State & SuccessStateType

export default Success
