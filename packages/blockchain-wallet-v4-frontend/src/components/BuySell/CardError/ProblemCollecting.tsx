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

const ProblemCollecting = ({
  handleReset,
  handleRetry
}: {
  handleReset: () => void
  handleRetry: () => void
}) => {
  return (
    <>
      <Image name='card-error-icon' width='84px' />

      <Title size='1.25rem' weight={600} color='grey900'>
        <FormattedMessage
          id='modals.buysell.error.problem_collecting.title'
          defaultMessage='Credit cards payments are often declined by the issuer, try a debit card instead.'
        />
      </Title>

      <Description size='0.875rem' weight={500}>
        <FormattedMessage
          id='modals.buysell.error.problem_collecting.description'
          defaultMessage='Add a Visa or Mastercard debit card and try again.'
        />
      </Description>

      <Actions>
        <Button
          data-e2e='cardDCreateFailedBack'
          height='48px'
          size='16px'
          nature='primary'
          fullwidth
          onClick={handleRetry}
        >
          <FormattedMessage
            id='modals.buysell.error.problem_collecting.try_again'
            defaultMessage='Try Again'
          />
        </Button>

        <Button
          data-e2e='cardDCreateFailedReset'
          height='48px'
          size='16px'
          nature='empty-blue'
          fullwidth
          onClick={handleReset}
        >
          <FormattedMessage
            id='modals.buysell.error.problem_collecting.cancel'
            defaultMessage='Cancel'
          />
        </Button>
      </Actions>
    </>
  )
}

export default ProblemCollecting
