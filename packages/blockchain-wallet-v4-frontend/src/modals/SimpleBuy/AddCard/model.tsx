import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'

import { ErrorType, Props as OwnProps } from './template.success'

export const Error = ({ error }: { error: Props['error'] }) => {
  switch (error) {
    case 'CARD_ALREADY_SAVED':
      return (
        <FormattedMessage
          id='modals.simplebuy.card_already_saved'
          defaultMessage='This card has already been saved.'
        />
      )

    case 'CARD_CREATION_FAILED':
      return (
        <FormattedMessage
          id='modals.simplebuy.card_creation_failed'
          defaultMessage='We could not save your card. Please contact support.'
        />
      )

    case 'CARD_ACTIVATION_FAILED':
      return (
        <FormattedMessage
          id='modals.simplebuy.card_activation_failed'
          defaultMessage='We could not activate your card. Please contact support.'
        />
      )

    case 'PENDING_CARD_AFTER_POLL':
      return (
        <FormattedMessage
          id='modals.simplebuy.card_pending_after_poll'
          defaultMessage='We waited one minute and did not receive an update from our card provider. Your card may still be approved later. Please contact support if you have any questions.'
        />
      )

    case 'LINK_CARD_FAILED':
      return (
        <FormattedMessage
          id='modals.simplebuy.link_card_failed'
          defaultMessage='Card failed to link. Please try again or contact support if you believe this occured in error.'
        />
      )

    default:
      return <>{'System Error: ' + JSON.stringify(error)}</>
  }
}

type Props = InjectedFormProps<{}, Props, ErrorType> & OwnProps
