import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { MobilePaymentType } from '@core/types'
import { Box, Icon, Image } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/BuySell'
import {
  DisplayValue,
  getIcon,
  getText,
  PaymentArrowContainer,
  PaymentText,
  SectionTitle
} from 'components/Flyout/model'

import { Props } from '../template.success'

const RightArrowIcon = styled(Icon)<{
  disabled?: boolean
}>`
  transform: rotate(180deg);
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

const Payment: React.FC<Props> = (props: Props) => {
  const nextStep = props.hasPaymentAccount ? 'LINKED_PAYMENT_ACCOUNTS' : 'PAYMENT_METHODS'

  // ensure only non SDD flow and non empty amount field open the payment selection screen
  const onPaymentMethodClick = () => {
    return !props.isSddFlow
      ? props.buySellActions.setStep({
          cryptoCurrency: props.cryptoCurrency,
          fiatCurrency: props.fiatCurrency || 'USD',
          pair: props.pair,
          step: nextStep
        })
      : null
  }

  const isApplePay = props.mobilePaymentMethod === MobilePaymentType.APPLE_PAY

  return (
    <>
      <SectionTitle color='grey900' size='14px' weight={500}>
        {props.orderType === 'SELL' && (
          <FormattedMessage
            id='modals.simplebuy.checkout.receive'
            defaultMessage='Recipient Account'
          />
        )}
      </SectionTitle>
      <Box role='button' data-e2e='paymentMethodSelect' onClick={onPaymentMethodClick}>
        <DisplayPaymentIcon showBackground={!props.method}>
          {isApplePay ? (
            <Image name='apple-pay' height='18px' />
          ) : (
            getIcon(props.method, props.isSddFlow)
          )}
        </DisplayPaymentIcon>
        <PaymentText isMethod={!!props.method}>
          {isApplePay ? (
            <DisplayValue>Apple Pay</DisplayValue>
          ) : (
            getText(props.method, props.sbBalances, props.isSddFlow)
          )}
        </PaymentText>
        {!props.isSddFlow && (
          <PaymentArrowContainer>
            <RightArrowIcon cursor name='arrow-back' size='20px' color='grey600' />
          </PaymentArrowContainer>
        )}
      </Box>
    </>
  )
}

export default Payment
