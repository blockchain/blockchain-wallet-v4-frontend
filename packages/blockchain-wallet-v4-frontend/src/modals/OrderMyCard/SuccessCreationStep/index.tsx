import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image } from 'blockchain-info-components'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import { FlyoutHeader } from 'components/Flyout/Layout'

import { ResultSubTitleWrapper, ResultTitleWrapper, ResultWrapper, StyledButton } from '../model'

const SuccessCreationStep = () => {
  const handleClose = () => {
    // TODO: see how or when change the default page to one with the card view
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='creationSuccessHeader' mode='close' onClick={handleClose} />
      <FlyoutContent mode='middle'>
        <ResultWrapper>
          <Image name='order-success' />
          <ResultTitleWrapper>
            <FormattedMessage
              id='modals.order_my_card.creation_success.title'
              defaultMessage='Card Successfully Created'
            />
          </ResultTitleWrapper>
          <ResultSubTitleWrapper>
            <FormattedMessage
              id='modals.order_my_card.creation_success.sub_title'
              defaultMessage='Welcome to the club, to view your card dashboard please press Continue below.'
            />
          </ResultSubTitleWrapper>
          <StyledButton data-e2e='cancelCreationBtn' nature='empty-blue' onClick={handleClose}>
            <FormattedMessage id='buttons.dismiss' defaultMessage='Dismiss' />
          </StyledButton>
        </ResultWrapper>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default SuccessCreationStep
