import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import { FlyoutHeader } from 'components/Flyout/Layout'

import { ResultSubTitleWrapper, ResultTitleWrapper, ResultWrapper } from '../../DebitCard.model'

type Props = {
  handleClose: () => void
  handleRetry: () => void
}

const TerminateFailureStep = ({ handleClose, handleRetry }: Props) => (
  <FlyoutContainer>
    <FlyoutHeader data-e2e='terminateFailedHeader' mode='close' onClick={handleClose} />
    <FlyoutContent mode='middle'>
      <ResultWrapper>
        <Image name='order-failed' />
        <Flex gap={8} flexDirection='column'>
          <ResultTitleWrapper>
            <FormattedMessage
              id='modals.terminate_card.failure.title'
              defaultMessage='Failed To Terminate Your Card'
            />
          </ResultTitleWrapper>
          <ResultSubTitleWrapper>
            <FormattedMessage
              id='modals.order_my_card.creation_failed.sub_title'
              defaultMessage='Sometimes this can happen when the systems are bogged down. You can try again by clicking ‘Retry’ below or come back again in a bit.'
            />
          </ResultSubTitleWrapper>
        </Flex>

        <Flex gap={16} flexDirection='column'>
          <Button fullwidth data-e2e='retryTerminationBtn' nature='primary' onClick={handleRetry}>
            <FormattedMessage id='copy.retry' defaultMessage='Retry' />
          </Button>
          <Button
            fullwidth
            data-e2e='cancelTerminationBtn'
            nature='empty-blue'
            onClick={handleClose}
          >
            <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
          </Button>
        </Flex>
      </ResultWrapper>
    </FlyoutContent>
  </FlyoutContainer>
)

export default TerminateFailureStep
