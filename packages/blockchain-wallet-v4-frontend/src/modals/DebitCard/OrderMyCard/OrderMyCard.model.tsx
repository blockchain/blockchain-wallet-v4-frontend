import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { StyledButton } from '../DebitCard.model'

export const SubTextWrapper = styled(Text)`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
`

export const LoadingWrapper = styled.div`
  height: 100%;
`

export const CreateCardButton = ({ onClick }) => (
  <StyledButton data-e2e='createCardBtn' nature='primary' onClick={onClick}>
    <FormattedMessage
      id='modals.order_my_card.select_your_card.create_card'
      defaultMessage='Create Card'
    />
  </StyledButton>
)
