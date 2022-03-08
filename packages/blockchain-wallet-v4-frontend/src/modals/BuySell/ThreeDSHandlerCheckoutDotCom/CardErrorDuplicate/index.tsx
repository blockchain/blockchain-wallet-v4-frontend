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
`

const CardErrorDuplicate = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <>
      <Image name='card-error-icon' width='84px' />

      <Title size='1.25rem' weight={600} color='grey900'>
        <FormattedMessage
          id='modals.buysell.error.duplicate.title'
          defaultMessage='This Card Already Exists'
        />
      </Title>

      <Description size='0.875rem' weight={500}>
        <FormattedMessage
          id='modals.buysell.error.duplicate.description'
          defaultMessage='It looks like the card you tried to add is already an existing linked card with your account.'
        />
      </Description>

      <Actions>
        <Button
          data-e2e='cardDCreateFailedTryDifferentMethod'
          height='48px'
          size='16px'
          nature='primary'
          fullwidth
          onClick={handleBack}
        >
          <FormattedMessage
            id='modals.buysell.error.duplicate.back'
            defaultMessage='Try A Different Payment Method'
          />
        </Button>
      </Actions>
    </>
  )
}

export default CardErrorDuplicate
