import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

export const SubTextWrapper = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  margin-top: 8px;
  text-align: center;
  width: 288px;
  margin-bottom: 33px;
`

const StyledSeeCardDetailsBtn = styled(Button)`
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

export const SeeCardDetailsBtn = ({ onClick }) => (
  <StyledSeeCardDetailsBtn data-e2e='seeCardDetailsBtn' onClick={onClick} nature='grey400'>
    <Icon name='info' color='blue600' />
    <Text size='14px' color='black'>
      <FormattedMessage
        id='modals.order_my_card.select_your_card.see_card_details'
        defaultMessage='See Card Details'
      />
    </Text>
    <Text color='blue600'>{'->'}</Text>
  </StyledSeeCardDetailsBtn>
)

export const CreateCardBtn = ({ onClick }) => (
  <Button
    data-e2e='createCardBtn'
    nature='primary'
    onClick={onClick}
    width='327px'
    style={{ marginTop: '33px' }}
  >
    <FormattedMessage
      id='modals.order_my_card.select_your_card.create_card'
      defaultMessage='Create Card'
    />
  </Button>
)
