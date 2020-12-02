import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { Icon, Text } from 'blockchain-info-components'

import { Props } from '../template.success'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const AmountText = styled(Text)`
  flex: 1;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 108px;
`
const InfoText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  margin-top: 22px;
`

const IncreaseLimits: React.FC<Props> = () => (
  <Container>
    <IconContainer>
      <DisplayPaymentIcon showBackground={true}>
        <Icon cursor name='plus' size='22px' color='blue600' />
      </DisplayPaymentIcon>
      <AmountText size='16px' weight={600} color='grey800'>
        <FormattedMessage
          id='modals.simplebuy.checkout.larger_amount.title'
          defaultMessage='Want to buy larger amounts?'
        />
      </AmountText>
    </IconContainer>
    <InfoText color='grey600'>
      <FormattedMessage
        id='modals.simplebuy.checkout.larger_amount.info'
        defaultMessage='After completing this transaction, upgrade to Gold level to unlock higher transaction limits and more payment methods.'
      />
    </InfoText>
  </Container>
)

export default IncreaseLimits
