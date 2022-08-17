import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'

import { ResultWrapper } from '../../DebitCard.model'
import { SubTextWrapper } from '../OrderCard.model'

type Props = {
  handleClose: () => void
  handleCreateCard: () => void
}

const NotAsked = ({ handleClose, handleCreateCard }: Props) => {
  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='orderMyCardHeader' mode='close' onClick={handleClose}>
        <FormattedMessage
          id='modals.order_my_card.select_your_card.title'
          defaultMessage='Select Your Card'
        />
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <ResultWrapper>
          <Image name='order-my-card' />
          <Text size='32px' weight={600} color='grey800'>
            <FormattedMessage
              id='modals.order_my_card.select_your_card.subtitle'
              defaultMessage='Virtual'
            />
          </Text>
          <SubTextWrapper>
            <FormattedMessage
              id='modals.order_my_card.select_your_card.content'
              defaultMessage='Our digital only card, use instantly for online payments.'
            />
          </SubTextWrapper>
        </ResultWrapper>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Button
          data-e2e='createCardBtn'
          fullwidth
          nature='primary'
          height='48px'
          size='16px'
          onClick={handleCreateCard}
        >
          <FormattedMessage
            id='modals.order_my_card.select_your_card.create_card'
            defaultMessage='Create Card'
          />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}
export default NotAsked
