import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'

const Title = styled(Text)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const Description = styled(Text)`
  margin-bottom: 1.5rem;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > * {
    margin-bottom: 1rem;
  }
`

const CardErrorPendingAfterPoll = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <>
      <Image name='card-warning-icon' width='84px' />

      <Title size='1.25rem' weight={600} color='grey900'>
        <FormattedMessage
          id='modals.buysell.error.pending_after_poll.title'
          defaultMessage='Card Verification in Progress'
        />
      </Title>

      <Description size='0.875rem' weight={500}>
        <FormattedMessage
          id='modals.buysell.error.pending_after_poll.description'
          defaultMessage='The card you tried to add is still pending verification. We suggest you to check the status later, or try another payment method.'
        />
      </Description>

      <Actions>
        <Button
          data-e2e='cardDCreateFailedReset'
          height='48px'
          size='16px'
          nature='empty-blue'
          fullwidth
          onClick={handleBack}
        >
          <FormattedMessage
            id='modals.buysell.error.pending_after_poll.back'
            defaultMessage='Try A Different Payment Method'
          />
        </Button>
      </Actions>
    </>
  )
}

export default CardErrorPendingAfterPoll
