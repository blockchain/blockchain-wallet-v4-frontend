import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image, Text } from 'blockchain-info-components'
import { FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'

import { CreateCardButton, SubTextWrapper } from '../model'

type Props = {
  handleClose: () => void
  handleCreateCard: () => void
}

const CreateCardStep = ({ handleClose, handleCreateCard }: Props) => (
  <>
    <FlyoutHeader data-e2e='orderMyCardHeader' mode='close' onClick={handleClose}>
      <FormattedMessage
        id='modals.order_my_card.select_your_card.title'
        defaultMessage='Select Your Card'
      />
    </FlyoutHeader>
    <FlyoutContent mode='middle'>
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

      {/* disabled for MVP, will need this for V1 */}
      {/* <SeeCardDetailsBtn onClick={handleShowCardDetails} /> */}

      <CreateCardButton onClick={handleCreateCard} />
    </FlyoutContent>
  </>
)

export default CreateCardStep
