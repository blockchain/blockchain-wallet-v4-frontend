import React, { FC, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { ErrorType } from './template.success'

const mapErrorStateToMessage: Record<ErrorType, ReactElement> = {
  CARD_ACTIVATION_FAILED: (
    <FormattedMessage
      id='modals.simplebuy.card_activation_failed'
      defaultMessage='We could not activate your card. Please contact support.'
    />
  ),
  CARD_ALREADY_SAVED: (
    <FormattedMessage
      id='modals.simplebuy.card_already_saved'
      defaultMessage='This card has already been saved.'
    />
  ),
  CARD_CREATION_FAILED: (
    <FormattedMessage
      id='modals.simplebuy.card_creation_failed'
      defaultMessage='We could not save your card. Please contact support.'
    />
  ),
  LINK_CARD_FAILED: (
    <FormattedMessage
      id='modals.simplebuy.link_card_failed'
      defaultMessage='Card failed to link. Please try again or contact support if you believe this occured in error.'
    />
  ),
  PENDING_CARD_AFTER_POLL: (
    <FormattedMessage
      id='modals.simplebuy.card_pending_after_poll'
      defaultMessage='We waited one minute and did not receive an update from our card provider. Your card may still be approved later. Please contact support if you have any questions.'
    />
  )
}

type ErrorProps = { error: ErrorType }

export const Error: FC<ErrorProps> = ({ error }) => mapErrorStateToMessage[error]
