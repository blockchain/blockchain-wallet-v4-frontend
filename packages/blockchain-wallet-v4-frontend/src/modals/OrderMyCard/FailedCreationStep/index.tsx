import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image } from 'blockchain-info-components'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import { FlyoutHeader } from 'components/Flyout/Layout'

import { ResultSubTitleWrapper, ResultTitleWrapper, ResultWrapper, StyledButton } from '../model'

type Props = {
  handleClose: () => void
  handleRetry: () => void
}

const FailedCreationStep = ({ handleClose, handleRetry }: Props) => (
  <FlyoutContainer>
    <FlyoutHeader data-e2e='creationFailedHeader' mode='close' onClick={handleClose} />
    <FlyoutContent mode='middle'>
      <ResultWrapper>
        <Image name='order-failed' />
        <ResultTitleWrapper>
          <FormattedMessage
            id='modals.order_my_card.creation_failed.title'
            defaultMessage='Failed To Successfully Create Your Card'
          />
        </ResultTitleWrapper>
        <ResultSubTitleWrapper>
          <FormattedMessage
            id='modals.order_my_card.creation_failed.sub_title'
            defaultMessage='Sometimes this can happen when the systems are bogged down. You can try again by clicking ‘Retry’ below or come back again in a bit.'
          />
        </ResultSubTitleWrapper>
        <StyledButton data-e2e='retryCreationBtn' nature='primary' onClick={handleRetry}>
          <FormattedMessage id='copy.retry' defaultMessage='Retry' />
        </StyledButton>
        <StyledButton data-e2e='cancelCreationBtn' nature='empty-blue' onClick={handleClose}>
          <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
        </StyledButton>
      </ResultWrapper>
    </FlyoutContent>
  </FlyoutContainer>
)

export default FailedCreationStep
