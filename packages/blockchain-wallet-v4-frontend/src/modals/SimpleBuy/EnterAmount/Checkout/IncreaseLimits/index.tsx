import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'

import { Props } from '../template.success'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px 40px;
  border-top: 1px solid ${props => props.theme['grey000']};
`
const TitleText = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`
const InfoText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  margin-top: 22px;
`

const IncreaseLimits: React.FC<Props> = () => (
  <Wrapper>
    <Container>
      <HeaderContainer>
        <DisplayPaymentIcon showBackground={true}>
          <Icon name='question-in-circle-filled' size='22px' color='blue600' />
        </DisplayPaymentIcon>
        <TitleText size='16px' weight={600} color='grey800'>
          <FormattedMessage
            id='modals.simplebuy.checkout.larger_amount.title'
            defaultMessage='Want to buy larger amounts?'
          />
        </TitleText>
      </HeaderContainer>
      <InfoText color='grey600'>
        <FormattedMessage
          id='modals.simplebuy.checkout.larger_amount.info'
          defaultMessage='After completing this transaction, upgrade to Gold level to unlock higher transaction limits and more payment methods.'
        />
      </InfoText>
    </Container>
  </Wrapper>
)

export default IncreaseLimits
