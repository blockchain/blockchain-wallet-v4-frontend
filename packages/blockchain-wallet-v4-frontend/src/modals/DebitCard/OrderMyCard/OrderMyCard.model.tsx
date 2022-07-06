import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

import { StyledButton } from '../DebitCard.model'

export const SubTextWrapper = styled(Text)`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  margin-top: 8px;
  text-align: center;
  width: 288px;
  margin-bottom: 33px;
`

const StyledSeeCardDetailsButton = styled(Button)`
  border: none;
  border-radius: 32px;
  justify-content: space-between;
  margin-bottom: 31px;
  padding: 6px 8px;
  width: 173px;
  height: 32px;

  > div {
    font-weight: 500;
  }
`

export const LoadingWrapper = styled.div`
  height: 100%;
`

export const SeeCardDetailsButton = ({ onClick }) => (
  <StyledSeeCardDetailsButton data-e2e='seeCardDetailsBtn' onClick={onClick} nature='grey400'>
    <Icon name='info' color='blue600' />
    <Text size='0.875rem' color='black'>
      <FormattedMessage
        id='modals.order_my_card.select_your_card.see_card_details'
        defaultMessage='See Card Details'
      />
    </Text>
    <Text color='blue600'>{'->'}</Text>
  </StyledSeeCardDetailsButton>
)

export const CreateCardButton = ({ onClick }) => (
  <StyledButton data-e2e='createCardBtn' nature='primary' onClick={onClick}>
    <FormattedMessage
      id='modals.order_my_card.select_your_card.create_card'
      defaultMessage='Create Card'
    />
  </StyledButton>
)
