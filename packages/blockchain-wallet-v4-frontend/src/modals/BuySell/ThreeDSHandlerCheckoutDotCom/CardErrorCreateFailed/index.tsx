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

const CardErrorCreateFailed = ({
  handleBack,
  handleRetry
}: {
  handleBack: () => void
  handleRetry: () => void
}) => {
  return (
    <>
      <Image name='card-error-icon' width='84px' />

      <Title size='1.25rem' weight={600} color='grey900'>
        <FormattedMessage
          id='modals.buysell.error.create_failed.title'
          defaultMessage='Failed To Add Card'
        />
      </Title>

      <Description size='0.875rem' weight={500}>
        <FormattedMessage
          id='modals.buysell.error.create_failed.description'
          defaultMessage='The card you tried to add has failed, please try again or another payment method.'
        />
      </Description>

      <Actions>
        <Button
          data-e2e='cardDCreateFailedTryAgain'
          height='48px'
          size='16px'
          nature='primary'
          fullwidth
          onClick={handleRetry}
        >
          <FormattedMessage
            id='modals.buysell.error.create_failed.try_again'
            defaultMessage='Try Again'
          />
        </Button>

        <Button
          data-e2e='cardDCreateFailedTryDifferentMethod'
          height='48px'
          size='16px'
          nature='empty-blue'
          fullwidth
          onClick={handleBack}
        >
          <FormattedMessage
            id='modals.buysell.error.create_failed.back'
            defaultMessage='Try A Different Payment Method'
          />
        </Button>
      </Actions>
    </>
  )
}

export default CardErrorCreateFailed
