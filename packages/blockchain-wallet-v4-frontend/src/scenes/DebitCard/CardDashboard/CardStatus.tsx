import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { CardStateType } from 'data/components/debitCard/types'

const StatusMessageWrapper = styled(Text)`
  font-weight: 600;
  font-size: 0.75rem;
  align-items: center;
  padding-top: 0.25rem;
`

const CardStatus = ({ status }) => {
  switch (status) {
    case CardStateType.ACTIVE:
      return (
        <StatusMessageWrapper color='green600'>
          <FormattedMessage
            id='scenes.debit_card.dashboard.cards_state.available'
            defaultMessage='Ready to use'
          />
        </StatusMessageWrapper>
      )
    case CardStateType.LOCKED:
      return (
        <StatusMessageWrapper color='blue600'>
          <FormattedMessage
            id='scenes.debit_card.dashboard.cards_state.lock'
            defaultMessage='Locked'
          />
        </StatusMessageWrapper>
      )
    case CardStateType.TERMINATED:
      return (
        <StatusMessageWrapper color='red600'>
          <FormattedMessage
            id='scenes.debit_card.dashboard.cards_state.terminated'
            defaultMessage='Terminated'
          />
        </StatusMessageWrapper>
      )
    default:
      return (
        <StatusMessageWrapper>
          <FormattedMessage
            id='scenes.debit_card.dashboard.cards_state.unknown'
            defaultMessage='Unknown'
          />
        </StatusMessageWrapper>
      )
  }
}

export default CardStatus
