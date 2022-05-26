import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image } from 'blockchain-info-components'
import FlyoutContainer from 'components/Flyout/Container'
import { FlyoutContent } from 'components/Flyout/Layout'

import {
  ResultSubTitleWrapper,
  ResultTitleWrapper,
  ResultWrapper,
  StyledButton
} from '../../DebitCard.model'

type Props = {
  handleClose: () => void
  handleTerminate: () => void
  last4: string
}

const TerminateStep = ({ handleClose, handleTerminate, last4 }: Props) => (
  <FlyoutContainer>
    <FlyoutContent mode='middle'>
      <ResultWrapper>
        <Image name='terminate-card' />
        <ResultTitleWrapper>
          <FormattedMessage
            id='modals.terminate_card.title'
            defaultMessage='Close ***{last4}'
            values={{ last4 }}
          />
        </ResultTitleWrapper>
        <ResultSubTitleWrapper>
          <FormattedMessage
            id='modals.terminate_card.sub_title'
            defaultMessage='Are you sure? Once confirmed this action cannot be undone. If you do want to permanently close this card, click the big red button.'
          />
        </ResultSubTitleWrapper>
        <StyledButton data-e2e='retryCreationBtn' nature='warning' onClick={handleTerminate}>
          <FormattedMessage id='modals.terminate_card.yes_btn' defaultMessage='Yes Delete Card' />
        </StyledButton>
        <StyledButton data-e2e='cancelCreationBtn' nature='empty-blue' onClick={handleClose}>
          <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
        </StyledButton>
      </ResultWrapper>
    </FlyoutContent>
  </FlyoutContainer>
)

export default TerminateStep
