import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Box, Icon } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'

import { Props } from '../template.success'
import { getIcon, getText, PaymentArrowContainer, PaymentText, SectionTitle } from './model'

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
      ? props.simpleBuyActions.setStep({
          cryptoCurrency: props.cryptoCurrency,
          fiatCurrency: props.fiatCurrency || 'USD',
          pair: props.pair,
          step: nextStep
        })
      : null
  }

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
          {getIcon(props.method, props.isSddFlow)}
        </DisplayPaymentIcon>
        <PaymentText isMethod={!!props.method}>
          {getText(props.method, props.sbBalances, props.isSddFlow)}
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
