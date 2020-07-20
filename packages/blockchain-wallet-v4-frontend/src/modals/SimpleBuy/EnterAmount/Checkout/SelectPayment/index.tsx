import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props } from '..'
import React from 'react'
import styled from 'styled-components'

const SelectPaymentContainer = styled.div`
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  width: 400px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 23px 28px 28px 28px;
  line-height: 32px;
  justify-content: space-between;
`

const SelectIconWrapper = styled.div`
  background-color: ${props => props.theme.blue000};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 22px;
`
const SelectPaymentText = styled(Text)`
  width: 285px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
`

const SelectPayment: React.FC<Props> = props => (
  <SelectPaymentContainer
    onClick={() =>
      props.simpleBuyActions.setStep({
        step: 'PAYMENT_METHODS',
        pair: props.pair,
        fiatCurrency: props.fiatCurrency || 'USD',
        cryptoCurrency: props.cryptoCurrency
      })
    }
  >
    <SelectIconWrapper>
      <Icon
        cursor
        name='plus-in-circle-filled'
        size='22px'
        color='blue600'
        style={{ marginLeft: '4px' }}
      />
    </SelectIconWrapper>
    <SelectPaymentText>
      <FormattedMessage
        id='modals.simplebuy.confirm.jump_to_payment'
        defaultMessage='Select Cash or Card'
      />
    </SelectPaymentText>
    <Icon cursor name='arrow-right' size='20px' color='grey600' />
  </SelectPaymentContainer>
)

export default SelectPayment
